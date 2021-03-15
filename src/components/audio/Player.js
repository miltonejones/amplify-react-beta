import React from 'react';
import { CLOUD_FRONT_URL, DEFAULT_IMAGE } from "../../Constants";
import clsx from 'clsx';
import { listViewOnClick } from "../../util/Events";
import { Analyser } from "./AudioAnalyser";
import ProgressLabel from "./ProgressLabel";
import './Player.css';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import EqLabel from './EqLabel';
import Badge from '@material-ui/core/Badge';

export default class AudioPlayer extends React.Component {
  cacheType = '';
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      progress: 0
    };
  }

  next() {
    const index = this.state.index + 1;
    if (index < this.state.items?.length) {
      return this.state.items[index];
    }
  }

  fwd() {
    const track = this.next();
    if (track?.Title) { return track }
  }

  attach(audioElement) {
    audioElement.addEventListener('ended', () => this.stopTrack());
    audioElement.addEventListener('loadeddata', () => this.loadTrack(audioElement));
    audioElement.addEventListener('timeupdate', () => this.setProgress(audioElement));
    this.setState({
      ...this.state,
      audioElement
    });
    Analyser.attach(audioElement);
    // Analyser.eqOutput.subscribe(console.log);
    //  Analyser.start()
  }

  loadTrack(e) {

  }

  stopTrack() {
    const track = this.fwd();
    if (track) {
      const text = track.FileKey;
      const url = play(text);
      const index = this.state.items.indexOf(track);
      this.setState({
        ...this.state,
        url,
        index,
        track
      });
      setTimeout(() => this.updateList(), 999);
      return;
    }
  }

  setProgress(player) {
    const duration = player.duration;
    const currentTime = player.currentTime;
    const progress = Math.floor((currentTime / duration) * 100);
    this.setState({
      ...this.state,
      duration, currentTime, progress
    });
  }

  updateList() { // HACK
    const nodes = document.querySelectorAll('.Mui-selected');
    const rows = document.querySelectorAll('.MuiDataGrid-row');
    const id = this.state.track?.ID;
    console.log({ rows, id });
    Array.from(rows).map(row => {
      const key = row.getAttribute('data-id');
      if (key == id) {
        row.classList.add('Mui-selected')
      } else {
        row.classList.remove('Mui-selected')
      }
    });
    // Array.from(nodes).map(node => node.classList.remove('Mui-selected'));
  }

  setQueue(opts) {
    const text = opts.track?.FileKey;
    const url = play(text);
    this.setState({
      ...this.state,
      ...opts,
      url
    });
    this.props.notify(true);
    setTimeout(() => this.updateList(), 999);
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  handleImageClick() {
    if (this.state.audioElement?.paused) {
      this.state.audioElement.play();
      return;
    }
    this.state.audioElement.pause();
  }

  componentDidMount() {
    this.subscription = listViewOnClick.subscribe(opts => {
      // const url = play(text);
      // this.setState({ url });
      this.setQueue(opts);
    });
    const audio = document.querySelector('audio');
    this.attach(audio);
  }
  render() {
    const datums = [this.state.track?.Title, this.state.track?.artistName, this.state.track?.albumName].filter(f => !!f).join(' - ');
    const image = this.state.track?.albumImage || DEFAULT_IMAGE;
    const player$ = this.state.audioElement;
    const seek = (e) => player$.currentTime = player$.duration * e;
    return (

      <div className="audio-play-head">

        <div className="audio-player-visible-controls">
          <div className="play-state-photo">
            <img onClick={this.handleImageClick.bind(this)} src={image} alt={datums}
              className={clsx({
                ['spinning-cd']: !this.state.audioElement?.paused,
              })} />
          </div>
          <div className="play-state-controls">
            {/* controls [{this.state.audioElement?.paused}] */}

            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer" >
              <Icon>fast_rewind</Icon>
            </IconButton>

            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer" >
              <Icon>fast_forward</Icon>
            </IconButton>

          </div>
          <div className="player-progress">
            <ProgressLabel seek={seek} value={this.state.progress} state={this.state.audioElement?.paused ? 1 : 2} text={datums} />
            {/* <LinearProgress variant="determinate" value={this.state.progress} /> */}
          </div>


          <div className="player-equalizer">
            <EqLabel />
          </div>

          <div className="player-track-menu">

            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer" >
              <Icon>playlist_add</Icon>
            </IconButton>

            <Badge color="secondary" badgeContent={this.state.items?.length}>
              <Icon>queue_music</Icon>
            </Badge>

            {/* <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer" >
              <Icon>queue_music</Icon>
            </IconButton> */}

          </div>

        </div>



        <audio id="page-audio-player" autoPlay={true} src={this.state.url} crossOrigin="anonymous">
          <source type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      </div>
    )
  }
}


function play(FileKey) {
  const audioURL = `${CLOUD_FRONT_URL}${FileKey}`
    .replace('#', '%23').replace(/\+/g, '%2B');
  return audioURL;
}