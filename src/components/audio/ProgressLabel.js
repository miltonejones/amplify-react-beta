import React from 'react';


export default class ProgressLabel extends React.Component {

  cacheSize = ''
  cacheText = ''
  oldStatus = -1;
  Animation = null;
  constructor(props) {
    super(props);
    this.state = {
      size: ''
    };
  }

  handleEvent = (event) => {
    const el = document.querySelector('.progress-outer-label');
    const left = el.offsetLeft;
    const size = el.offsetWidth;
    const data = { x: event.clientX - left, left, size };

    this.props.seek(data.x / data.size);
  }
  componentDidMount() {
    this.animate();
  }

  componentDidUpdate() {
    const { width, value, state, text } = this.props;
    const percent = value / 100;
    const widthPx = width * percent;
    this.cacheSize = `${widthPx}px 22px`;

    if (this.cacheText !== text || this.oldStatus !== state) {
      this.animate();
    }

    this.oldStatus = state;
    this.cacheText = text;
    // 
  }

  reset() {
    // const scroller = document.querySelector('.progress-inner-label')
    if (this.Animation) {
      this.Animation.pause();
    }
    //   scroller.style.transform = 'translateX(0px)';
  }

  animate$(element, keyframes, iterations, duration) {
    try {
      if (this.Animation) {
        this.Animation.cancel();
      }
      this.Animation = element.animate(keyframes, {
        duration: duration,
        iterations: iterations
      });
    } catch (e) {
      console.log(e)
    }
  }

  animate() {
    const scroller = document.querySelector('.progress-inner-label')
    const el = document.querySelector('.progress-outer-label');
    const scroller_width = scroller.offsetWidth;
    const element_width = el.offsetWidth;
    const keyframes = [
      { transform: 'translateX(-' + scroller_width + 'px)' },
      { transform: 'translateX(' + element_width + 'px)' }
    ];
    const rwdframes = [
      { transform: 'translateX(-' + scroller_width + 'px)' },
      { transform: 'translateX(6px)' }
    ];
    scroller.classList.remove('ellipsed');
    if (scroller_width > element_width && this.props.state === 2) {
      this.animate$(scroller, keyframes, Infinity, 20000);
      return;
    }
    // scroller.classList.add('ellipsed');
    this.animate$(scroller, rwdframes, 1, 200);
  }

  render() {
    const { width } = this.props;
    let size = width - 20;
    return (
      <div className="progress-outer-label" onMouseDown={this.handleEvent}
        style={{ backgroundColor: 'white', backgroundImage: generateProgress(), backgroundSize: this.cacheSize, width: size }}>
        <div className="progress-inner-label">
          {this.props.text}
        </div>
      </div>
    )
  }

}


export function generateProgress(color = 'rebeccapurple') {
  const output = document.createElement('canvas');
  ((canvas) => {
    canvas.width = 10;
    canvas.height = 10;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.rect(0, 0, 10, 10);
      ctx.fillStyle = color;
      ctx.fill();
    }
  })(output);
  return `url(${output.toDataURL()})`;
}


