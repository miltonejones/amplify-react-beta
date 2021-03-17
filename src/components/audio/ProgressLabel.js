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
    const percent = this.props.value / 100;
    const width = 320 * percent;
    this.cacheSize = `${width}px 22px`;

    if (this.cacheText !== this.props.text || this.oldStatus !== this.props.state) {
      this.animate();
    }

    this.oldStatus = this.props.state;
    this.cacheText = this.props.text;
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
    if (this.Animation) {
      this.Animation.cancel();
    }
    this.Animation = element.animate(keyframes, {
      duration: duration,
      iterations: iterations
    });
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
    return (
      <div className="progress-outer-label" onMouseDown={this.handleEvent} style={{ backgroundImage: generateProgress(), backgroundSize: this.cacheSize }}>
        <div className="progress-inner-label">
          {this.props.text}
        </div>
      </div>
    )
  }

}


export function generateProgress(color = '#3f51b5') {
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


