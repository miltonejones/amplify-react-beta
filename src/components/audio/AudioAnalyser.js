import { Subject } from 'rxjs';

const AudioContext = window.AudioContext // Default
  || window.webkitAudioContext;// Safari a 

class AudioAnalyser {
  eqOutput$ = new Subject();
  context = new AudioContext();
  running = true;
  started = false;

  constructor() {
    this.eqOutput = this.eqOutput$.asObservable();
  }

  configure(audio, hue, width) {
    audio.addEventListener("error", e => {
      console.warn("An error occured", { e });
    });
    this.audio = audio;
    this.width = width;
    this.color = hue;
  }

  attach(audio, width) {
    const hue = '';
    this.configure(audio, hue, width);
    this.analyser = this.context.createAnalyser();
    const source = this.context.createMediaElementSource(audio);
    source.connect(this.analyser);
    this.analyser.connect(this.context.destination);
    console.log("attached!", hue, this.context.state);
  }

  start() {
    if (this.started) return;
    const exec = () => {
      this.eqOutput$.next(currentBarGraph(this.analyser, this.width));
      if (this.running) {
        window.requestAnimationFrame(exec);
        this.started = true;
        return;
      }
      console.log('animation stopped');
      this.started = false;
    }
    this.running = true;
    this.started = false;
    window.requestAnimationFrame(exec);
    console.log('animation started', this.width);
  }

}

const Analyser = new AudioAnalyser();

export {
  Analyser
}

function currentBarGraph(
  analyser,
  width = 400,
  fftSize = 64,
  factor = 8) {
  analyser.fftSize = fftSize;
  const bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);
  return frequencyCoords(dataArray, bufferLength, width / bufferLength, factor);
}

function frequencyCoords(dataArray, bufferLength, barWidth, factor) {
  const coords = [];
  let barHeight;
  let x = 0;
  for (var index = 0; index < bufferLength; index++) {
    barHeight = dataArray[index];
    const actualHeight = barHeight / factor;
    const fillStyle = "rgb(" + (barHeight + 100) + ", " + (255 - barHeight) + ", 50)";
    coords.push({
      index,
      fillStyle,
      x,
      actualHeight,
      barWidth
    });
    x += barWidth + 1;
  }
  return coords;
}