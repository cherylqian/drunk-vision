import React, { Component } from "react";
import { Bus } from "gl-react";
import { Surface } from "gl-react-dom";
import { Video } from "./Video";
import { BlurV } from "./shaders/Blur";
import StaticBlurMap from "./shaders/StaticBlurMap";
import { Vignette } from "./shaders/Vignette";

// We can give our <Video> component a <WebCamSource> to have webcam stream!
export class WebCamSource extends Component {
  state = { src: null };
  componentWillMount() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => this.setState({ src: URL.createObjectURL(stream) }));
  }
  render() {
    const { src } = this.state;
    return src ? <source src={src} /> : null;
  }
}

function convert(uri) {
  return <img src={uri} alt="" />;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      blur: false,
      factor: 7,
      passes: 1,
      map: StaticBlurMap.images[0]
    };
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  render() {
    const style = {
      margin: "0 auto"
    };
    const { map, passes, factor } = this.state;
    return (
      <div>
        <Surface width={1260} height={720} style={style}>
          <Bus ref="vid">
            {redraw => (
              <Video onFrame={redraw} autoPlay>
                <WebCamSource />
              </Video>
            )}
          </Bus>
          <Vignette mouse={[0.5, 0.5]}>
            <BlurV map={map} passes={passes} factor={factor}>
              {() => this.refs.vid}
            </BlurV>
          </Vignette>
        </Surface>
      </div>
    );
  }
}

export default App;
