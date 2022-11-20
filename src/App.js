import "./App.css";
import Image from "./img/image3.png";
import { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      x: 0,
      y: 0,
      dimensions: {},
      naturalSize: {},
      scales: {},
      rectCoords: {},
      isDrawing: false,
      rectData: {
        pos: { rectX: null, rectY: null },
        size: { width: null, height: null },
      },
      anyRects: false,
    };

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onImgLoad = this.onImgLoad.bind(this);
    this.onMouseClick = this.onMouseClick.bind(this);
    this.realCoordinatesCalculating =
      this.realCoordinatesCalculating.bind(this);
    this.rectSizeCalculating = this.rectSizeCalculating.bind(this);
    this.addArea = this.addArea.bind(this);
  }

  onMouseMove(e) {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    this.setState({ x: x, y: y });
  }

  onMouseClick = (e) => {
    const x = this.state.x;
    const y = this.state.y;
    if (e.type === "mousedown") {
      this.setState({
        rectCoords: {
          rectX: x,
          rectY: y,
        },
        isDrawing: true,
      });
    } else {
      this.setState({
        rectData: {
          pos: this.state.rectCoords,
          size: this.rectSizeCalculating(this.state.x, this.state.y),
        },
        isDrawing: false,
        anyRects: true,
      });
    }
  };

  rectSizeCalculating(x, y) {
    const { rectX, rectY } = this.state.rectCoords;
    if (x >= rectX || y >= rectY) {
      const width = (x - rectX).toFixed();
      const height = (y - rectY).toFixed();
      return { width, height };
    } else {
      const height = (-y + rectY).toFixed();
      const width = (-x + rectX).toFixed();
      return { width, height };
    }
  }

  realSizeCalculating(w, h) {
    const { scaleX, scaleY } = this.state.scales;

    const height = (h * scaleY).toFixed();
    const width = (w * scaleX).toFixed();

    return { height, width };
  }

  realCoordinatesCalculating(x, y) {
    const { scaleX, scaleY } = this.state.scales;

    const errorX = x < this.state.dimensions.width / 2 ? 0 : 1;
    const errorY = y < this.state.dimensions.height / 2 ? 0 : 1;
    const realX = (x * scaleX + errorX * 4).toFixed();
    const realY = (y * scaleY + errorY * 4).toFixed();
    return { realX, realY };
  }

  onImgLoad({ target: img }) {
    this.setState({
      dimensions: {
        height: img.offsetHeight,
        width: img.offsetWidth,
      },
      naturalSize: {
        natHeight: img.naturalHeight,
        natWidth: img.naturalWidth,
      },
      scales: {
        scaleX: (img.naturalHeight - 1) / img.offsetHeight,
        scaleY: (img.naturalWidth - 1) / img.offsetWidth,
      },
    });
  }

  addArea() {
    if (
      this.state.anyRects &&
      !!(this.state.rectData.size.height && this.state.rectData.size.width)
    ) {
      const { rectX, rectY } = this.state.rectData.pos;
      const { width, height } = this.state.rectData.size;
      const responseData = {
        id: "1",
        object_id: "1",
        region: {
          origin: {
            x: rectX,
            y: rectY,
          },
          size: this.realSizeCalculating(width, height),
        },
      };
      console.log(JSON.stringify(responseData));
      this.setState({
        anyRects: false,
      });
    } else {
      console.log("You need to select any area.");
    }
  }

  render() {
    const { x, y } = this.state;
    const { realX, realY } = this.realCoordinatesCalculating(x, y);
    const { width, height } = this.state.dimensions;
    const { natWidth, natHeight } = this.state.naturalSize;
    const { scaleX, scaleY } = this.state.scales;
    const { rectX, rectY } = this.state.rectCoords;
    const { isDrawing } = this.state;
    const { pos: rectPos, size: rectSize } = this.state.rectData;
    const { anyRects } = this.state;

    let area;

    if (isDrawing) {
      const { width: rectWidth, height: rectHeight } = this.rectSizeCalculating(
        x,
        y
      );
      area = <rect x={rectX} y={rectY} width={rectWidth} height={rectHeight} />;
    }

    if (!isDrawing && anyRects) {
      area = (
        <rect
          x={rectPos.rectX}
          y={rectPos.rectY}
          width={rectSize.width}
          height={rectSize.height}
        />
      );
    }

    return (
      <>
        <div className="main-box">
          <div className="draw-area">
            <img
              className="image"
              src={Image}
              onLoad={this.onImgLoad}
              draggable="false"
              alt=""
            />
            <svg
              className="svg-area"
              onMouseMove={this.onMouseMove}
              onMouseDown={this.onMouseClick}
              onMouseUp={this.onMouseClick}
              style={{
                backgroundImage: `url(${Image})`,
                backgroundSize: "contain",
              }}
              width={width}
              height={height}
              draggable="false"
            >
              {area}
            </svg>
          </div>

          <div className="text-box">
            <h4>Web image sizes:</h4>
            <p>
              Width: {width}, Height: {height}
            </p>
            <h4>Natural image sizes:</h4>
            <p>
              Width: {natWidth}, Height: {natHeight}
            </p>
            <h4>Web image coordinates:</h4>
            <p>
              ({x}; {y})
            </p>
            <h4>Natural image coordinates:</h4>
            <p>
              ({realX}; {realY})
            </p>
            <h4>Scales:</h4>
            <p>X: {scaleX}</p>
            <p>Y: {scaleY}</p>
            <div align="center">
              <button
                align="center"
                className="button-beauty"
                onClick={this.addArea}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default App;
