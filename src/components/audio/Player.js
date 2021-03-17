import React from 'react';
import { CLOUD_FRONT_URL, DEFAULT_IMAGE } from "../../Constants";
import { listViewOnClick, playBegin$ } from "../../util/Events";
import { Analyser } from "./AudioAnalyser";
import ProgressLabel from "./ProgressLabel";
import './Player.css';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import EqLabel from './EqLabel';
import { SongPersistService } from './Persist';
import QueueDialog from '../modal/QueueModal';
import { compareTrackToLists, PLAYLIST_COLLECTION } from '../../AmplifyData';
import PlaylistAddDialog from '../modal/PlaylistAddModal';

export default class AudioPlayer extends React.Component {
  cacheType = '';

  constructor(props) {
    super(props);
    this.state = {
      url: '',
      progress: 0
    };
    this.prevTrack = this.prevTrack.bind(this);
    this.nextTrack = this.nextTrack.bind(this);
    this.close = this.close.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
  }

  next(i = 1) {
    const index = this.state.index + i;
    if (index < this.state.items?.length && index > -1) {
      return this.state.items[index];
    }
  }

  fwd() {
    const track = this.next();
    if (track?.Title) { return track }
  }

  prev() {
    const track = this.next(-1);
    if (track?.Title) { return track }
  }

  attach(audioElement) {
    audioElement.addEventListener('ended', () => this.nextTrack());
    audioElement.addEventListener('loadeddata', () => this.loadTrack(audioElement));
    audioElement.addEventListener('timeupdate', () => this.setProgress(audioElement));
    this.setState({
      ...this.state,
      audioElement
    });
    Analyser.attach(audioElement);
  }

  loadTrack(e) {

    if (Analyser.context.state !== 'running') {
      const k = window.confirm(`The equalizer needs permission to access your system. 
      Click here to grant permission.`);
      if (k) {
        Analyser.context.resume();
      }
      return;
    }

    const index = this.state.items?.indexOf(this.state.track);
    const first = index === 0;
    const last = (index + 1) === this.state.items?.length;
    const count = compareTrackToLists(this.state.track);
    this.setState({
      ...this.state,
      first, last, count
    });
  }

  playTrack(track) {
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
    this.close();
  }

  close() {
    const items = null;
    this.setState({
      ...this.state,
      items
    })
    this.state.audioElement.pause();
    this.props.notify(false);
  }

  prevTrack() {
    const track = this.prev();
    this.playTrack(track)
  }

  nextTrack() {
    const track = this.fwd();
    this.playTrack(track)
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
    SongPersistService.add(opts.track);
    playBegin$.next(this.state)
    setTimeout(() => this.updateList(), 999);
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
    // const nodes = document.querySelectorAll('.Mui-selected');
    const rows = document.querySelectorAll('.MuiDataGrid-row');
    const id = this.state.track?.ID;
    // 
    Array.from(rows).map(row => {
      const key = row.getAttribute('data-id');
      if (key.toString() === id.toString()) {
        row.classList.add('Mui-selected')
      } else {
        row.classList.remove('Mui-selected')
      }
      return false;
    });
    // Array.from(nodes).map(node => node.classList.remove('Mui-selected'));
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
    const {
      first,
      last,
      track,
      audioElement,
      progress,
      items,
      count,
      url } = this.state;
    const datums = [track?.Title, track?.artistName, track?.albumName].filter(f => !!f).join(' - ');
    const image = track?.albumImage || DEFAULT_IMAGE;
    const player$ = audioElement;
    const seek = (e) => player$.currentTime = player$.duration * e;
    return (

      <div className="audio-play-head">

        <div className="audio-player-visible-controls">
          <div className="play-state-photo">
            <img onClick={this.handleImageClick} src={image} alt={datums}
              className={audioElement?.paused ? '' : 'spinning-cd'} />
          </div>
          <div className="play-state-controls">
            {/* controls [{audioElement?.paused}] */}

            <IconButton onClick={this.prevTrack}
              edge="start"
              color="inherit"
              disabled={first}
              aria-label="open drawer" >
              <Icon>fast_rewind</Icon>
            </IconButton>

            <IconButton onClick={this.nextTrack}
              edge="start"
              color="inherit"
              disabled={last}
              aria-label="open drawer" >
              <Icon>fast_forward</Icon>
            </IconButton>

          </div>
          <div className="player-progress">
            <ProgressLabel seek={seek} value={progress} state={audioElement?.paused ? 1 : 2} text={datums} />
            {/* <LinearProgress variant="determinate" value={progress} /> */}
          </div>


          <div className="player-equalizer">
            <EqLabel />
          </div>

          <div className="player-track-menu">

            {/* <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer" >
              <Icon>playlist_add</Icon>
            </IconButton> */}


            {/* <Badge color="secondary" badgeContent={count}>
              <Icon>playlist_add</Icon>
            </Badge> */}

            {!!PLAYLIST_COLLECTION.length && <PlaylistAddDialog count={count} track={track} />}
            <QueueDialog items={items} />



            <IconButton onClick={this.close}
              edge="start"
              color="inherit"
              aria-label="open drawer" >
              <Icon>close</Icon>
            </IconButton>

            {/* <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer" >
              <Icon>queue_music</Icon>
            </IconButton> */}

          </div>

        </div>



        <audio id="page-audio-player" autoPlay={true} src={url} crossOrigin="anonymous">
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