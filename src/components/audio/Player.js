import React from 'react';
import { CLOUD_FRONT_URL, DEFAULT_IMAGE } from "../../Constants";
import { addQueueRequest, openMenuRequest$, playbackRequest, playBegin$, playEnd$ } from "../../util/Events";
import { Analyser } from "./AudioAnalyser";
import ProgressLabel from "./ProgressLabel";
import './Player.css';
import EqLabel from './EqLabel';
import { SongPersistService } from './Persist';
import QueueDialog from '../modal/QueueModal';
import { compareTrackToLists, PLAYLIST_COLLECTION, dataStateChange, save } from '../../AmplifyData';
import PlaylistAddDialog from '../modal/PlaylistAddModal';
import { AppState } from '../../util/State';
import { TrackTooltip } from '../TrackToolTip';
import { ToolTipButton } from '../ToolTipButton';
import { LocalApi } from '../../data/LocalApi';


export default class AudioPlayer extends React.Component {
  subscriptions = [];

  constructor(props) {
    super(props);
    this.state = {
      url: '',
      eq_width: 400,
      progress: 0
    };
    this.prevTrack = this.prevTrack.bind(this);
    this.nextTrack = this.nextTrack.bind(this);
    this.close = this.close.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
    this.myInput = React.createRef();
  }
  splice(track) {
    const { index, items } = this.state;
    if (index > -1) {
      items.splice(index + 1, 0, track);
      this.setState({
        ...this.state,
        items,
        before: this.prev(),
        after: this.next()
      });
    }
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
    const { eq_width } = this.props;
    audioElement.addEventListener('ended', () => this.nextTrack());
    audioElement.addEventListener('loadeddata', () => this.loadTrack(audioElement));
    audioElement.addEventListener('timeupdate', () => this.setProgress(audioElement));
    this.setState({
      ...this.state,
      audioElement
    });
    Analyser.attach(audioElement, eq_width);
  }
  setTime() {
    const { audioElement, track } = this.state;
    if (!track.trackTime) {
      const trackTime = audioElement.duration * 1000;
      track.trackTime = trackTime;
      LocalApi.save(track).then(console.log);
      return;
    }
    console.log({ time: track.trackTime })
  }
  setArtist(artistFk) {
    if (!artistFk) return;
    // query('artist', artistFk)
    LocalApi.query('artist/' + artistFk)
      .then(res => {
        const { imageLg } = res.data || res;
        this.setState({ ...this.state, imageLg, imageLoaded: !!imageLg })
      })
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
    const { track, items } = this.state;
    const index = items?.indexOf(track);
    const first = index === 0;
    const last = (index + 1) === items?.length;
    const count = compareTrackToLists(track);
    this.setState({
      ...this.state,
      index,
      imageLoaded: null,
      length: items?.length,
      before: this.prev(),
      after: this.next(),
      first, last, count
    });
    AppState.TRACK = track;
    playBegin$.next(this.state);
    this.setTime();
    this.setArtist(track.artistFk);
    console.log(this.state);
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
    playEnd$.next(this.state);
  }

  prevTrack() {
    const track = this.prev();
    this.playTrack(track)
  }

  nextTrack() {
    const track = this.fwd();
    playEnd$.next(this.state);
    AppState.TRACK = {};
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
    console.log(opts.crumb)
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
  componentDidUpdate() {
    AppState.SOURCE = this.state.source;
  }

  componentWillUnmount() {
    this.subscriptions.map(sub => sub.unsubscribe());
  }

  handleImageClick() {
    if (this.state.audioElement?.paused) {
      this.state.audioElement.play();
      return;
    }
    this.state.audioElement.pause();
  }

  componentDidMount() {
    this.subscriptions.push(
      playbackRequest.subscribe(opts => {
        this.setQueue(opts);
      }),
      addQueueRequest.subscribe(track => {
        this.splice(track);
      }),
      dataStateChange.subscribe(ready => {
        if (ready && this.state.track) {
          const count = compareTrackToLists(this.state.track);
          this.setState({
            ...this.state,
            count
          })
        }
      })
    );
    const audio = document.querySelector('audio');
    const actual = document.querySelector('.audio-play-head').offsetWidth;
    this.attach(audio);
    this.setState({ ...this.state, actual })
  }
  render() {
    const {
      first,
      last,
      track,
      before,
      after,
      audioElement,
      progress,
      items,
      count,
      actual,
      crumb,
      imageLg,
      imageLoaded,
      url } = this.state;
    const { expand, expanded, mobile } = this.props;
    const datums = [track?.Title, track?.artistName, track?.albumName].filter(f => !!f).join(' - ');
    const image = track?.albumImage || DEFAULT_IMAGE;
    const player$ = audioElement;
    const seek = (e) => player$.currentTime = player$.duration * e;
    const css = `audio-player-visible-controls${expanded ? ' expanded' : ''}${imageLoaded ? ' present' : ' retract'}`;
    let eq_width = mobile ? 300 : 400;
    if (expanded) eq_width = actual;
    return (

      <div className="audio-play-head">

        <div className={css} style={{ backgroundImage: (expanded ? `url(${imageLg})` : '') }}>

          <div className="play-state-photo">
            {/* 12 */}
            <img onClick={this.handleImageClick} src={image} alt={datums}
              className={audioElement?.paused ? '' : 'spinning-cd'} />
          </div>

          {/* 8 */}
          <ToolTipButton css="btn-fast-rewind flex-centered player-standard-button" icon="fast_rewind" title={<TrackTooltip track={before} />} disabled={first} click={this.prevTrack} />
          {/* 10 */}
          <ToolTipButton css="btn-fast-forward flex-centered player-standard-button" icon="fast_forward" title={<TrackTooltip track={after} />} disabled={last} click={this.nextTrack} />

          <div className="player-progress flex-centered">
            {/* NOT_LISTED */}
            <ProgressLabel seek={seek} width={eq_width} value={progress} state={audioElement?.paused ? 1 : 2} text={datums} />
          </div>

          <div title={eq_width} className="player-equalizer" style={{ width: eq_width + 'px' }} onClick={() => expand()}>
            {/* 6 */}
            <EqLabel width={eq_width} />
          </div>

          {/* 4 */}
          {!!PLAYLIST_COLLECTION.length && <PlaylistAddDialog css="btn-playlist-modal flex-centered" count={count} track={track} />}
          {/* 5 */}
          {items?.length > 1 && <QueueDialog css="btn-queue-modal flex-centered" selected={[track?.ID]} items={items} />}
          {/* NOT_LISTED */}
          <ToolTipButton css="btn-player-close flex-centered player-standard-button" icon="close" title="close player" click={this.close} />
          {/* 3 */}
          <ToolTipButton css="btn-track-menu flex-centered player-standard-button" icon="more_vert" title="more options..." click={() => openMenuRequest$.next(track)} />

          {/* 1 */}
          <ToolTipButton css="btn-menu-toggle flex-centered player-standard-button" icon="expand_more" title="minimize" click={() => expand()} />
          {/* 9 */}
          <ToolTipButton css="btn-play-pause flex-centered player-standard-button" icon="pause_circle" title="pause" click={this.handleImageClick} />

          {/* 2 */}
          <PlayerTitle crumb={crumb} />
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

const PlayerTitle = ({ crumb }) => {
  return (
    <div className="player-track-title">
      <h2>{crumb?.data?.label}</h2>
      {crumb?.label}
    </div>
  );
}
PlayerTitle.defaultProps = {
  crumb: {
    data: {
      label: 'your library'
    },
    label: ''
  }
} 