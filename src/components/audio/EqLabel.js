import React from 'react';
import { Analyser } from "./AudioAnalyser";


export default class EqLabel extends React.Component {

  sub = null;
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentWillUnmount() {
    this.sub.unsubscribe();
  }

  componentDidMount() {
    this.sub = Analyser.eqOutput$.subscribe(data => {
      this.setState({
        ...this.state,
        data
      });
    });
    Analyser.start();
  }

  render() {
    const { width } = this.props;
    return (
      <div className="eq-outer-label" style={{ width }}>
        <div style={{
          backgroundImage: fullGrid(),
          backgroundSize: `${width}px 40px`,
          backgroundRepeat: 'no-repeat'
        }} className="grid-mask"></div>
        {this.state.data.map((coord, i) => {
          return (
            <div style={{
              height: coord.actualHeight + 'px',
              width: coord.barWidth + 'px',
              minWidth: coord.barWidth + 'px',
              marginTop: 'auto',
              backgroundColor: coord.fillStyle,
            }} key={i}>

            </div>
          )
        })}
      </div>
    )
  }

}


export const fullGrid = (color = '#ffffff', width = 400) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = 40;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    for (let y = 1; y < canvas.height; y += 4) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    ctx.font = "12px 'Shadows Into Light'";
    ctx.fillStyle = '#3f51b5';
    ctx.fillText('Amplify!', canvas.width - 48, canvas.height - 4);
  }
  return `url(${canvas.toDataURL()})`;
};

// "Shadows Into Light", "Dancing Script", "Yusei Magic"