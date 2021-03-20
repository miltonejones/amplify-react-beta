import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Underline from '../underline/Underline';
import TrackEditCard from '../TrackEditCard';
import ModalTrackList from './ModalTrackList';
import { ParsedInfo, search, save, send, apple } from '../../AmplifyData';
import { AppleConvert } from '../../util/AppleConvert';

const attachData = (suggested, field, type, key) => {
  return new Promise(callback => {
    const value = suggested?.[field];
    console.log({ field, value })
    if (value) {
      search(value, type)
        .then(({ data }) => {
          const { items } = data;
          if (items?.length) {
            const found = items.filter(f => f.Title?.toLowerCase() === value?.toLowerCase())[0]
            if (found) {
              console.log({ found })
              suggested[key] = found.Key;
            } else {
              console.log('could not find "%s" in', value, items);
            }
          }
          callback(suggested);
        });
      return;
    }
    callback(suggested)
  })
}

const commit = (track) => {
  return new Promise(callback => {
    const up = Object.assign({}, track);
    up.albumName = up.artistName = up.artist = null;
    save(up).then(callback);
  })
}

export default class BatchEditDialog extends React.Component {
  cacheParam = ''
  constructor(props) {
    super(props);
    this.state = {
      artists: []
    };
    this.assignTrack = this.assignTrack.bind(this);
    this.saveTrack = this.saveTrack.bind(this);
    this.applyProp = this.applyProp.bind(this);
    this.createPlus = this.createPlus.bind(this);
    this.cloneTracks = this.cloneTracks.bind(this);
    this.iTune = this.iTune.bind(this);
    this.setTitle = this.setTitle.bind(this);
  }
  iTune() {
    const { track } = this.state;
    apple(track.Title, track.artistFk ? track.artistName : null)
      .then(res => {
        const { results } = res.data;
        const itunes = results.map(result => AppleConvert(result));
        console.log({ itunes });
        this.setState({ ...this.state, itunes });
      })
  }
  createPlus(type, title, image, id, name) {
    const { track } = this.state;
    const messages = {
      artist: { Name: title, image: image },
      album: { Name: title, image: image, artistFk: track.artistFk }
    };
    send(type, messages[type])
      .then(res => {
        console.log(res)
        const answer = res.data;
        let ID = answer.success?.insertId || answer?.ID;
        Object.assign(track, {
          [id]: ID,
          [name]: title
        })
        this.setState({ ...this.state, track });
        console.log(ID, answer)
      })
  }
  assignTrackEx(assignment) {
    let { track } = this.state;
    track = Object.assign(track, assignment);
    this.setState({ ...this.state, track, itunes: [] })
  }
  assignTrack(track) {
    this.assignTrackEx(track || this.state.suggested)
  }
  componentDidUpdate() {
    const { track } = this.state;
    if (track?.Key !== this.cacheParam) {
      this.loadComponentList();
      this.cacheParam = track?.Key;
    }
  }
  applyProp(type, value) {
    const { tracks } = this.props;
    if (value.ID) {
      tracks.map(track => {
        track[`${type}Fk`] = value.ID;
        track[`${type}Name`] = value.Text;
        return track;
      });
    }
    this.setState({ ...this.state, tracks });
  }
  setTitle(e) {
    const { value } = e.target;
    const { track } = this.state;
    track.Title = value;
    this.setState({ ...this.state, track });
  }
  cloneTracks() {
    const { tracks } = this.props;
    const { track } = this.state;
    tracks.map(t => {
      return Object.assign(t, {
        artistFk: track.artistFk,
        artistName: track.artistName,
        albumFk: track.albumFk,
        albumName: track.albumName,
        Genre: track.Genre,
        genreKey: track.genreKey,
      })
    });
    this.setState({ ...this.state, tracks })
  }
  saveTracks() {
    const { tracks } = this.props;
    return new Promise(callback => {
      const next = () => {
        if (!tracks.length) return callback();
        commit(tracks.pop()).then(next);
      }
      next();
    })
  }
  saveTrack(track, all) {
    if (all) return this.saveTracks().then(() => this.props.refresh());
    const up = Object.assign({}, track);
    up.albumName = up.artistName = null;
    save(up).then(() => this.props.refresh());
  }
  loadComponentList() {
    const { track } = this.state;
    const { tracks } = this.props;
    const suggested = ParsedInfo(track?.Key);
    const artistProm = Promise.all(['album', 'artist']
      .map(type => attachData(suggested, `${type}Name`, `${type}s`, `${type}Fk`)));
    artistProm.then(() => this.setState({ ...this.state, suggested, track: track || tracks?.[0] }))
  }
  componentDidMount() {
  }
  handleClose() {
    this.props.close();
  }
  render() {
    const { isOpen, tracks } = this.props;
    const { track, suggested, itunes } = this.state;
    return (

      <Dialog
        open={isOpen}
        maxWidth="xl"
        onClose={this.handleClose.bind(this)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"><Underline innerText="Edit Tracks" dark={true} /></DialogTitle>
        <DialogContent classes={{ root: 'classes-batch-outer' }}>

          <div style={{ float: 'left' }}>
            <ModalTrackList select={(track) => this.setState({ ...this.state, track, suggested: {} })} tracks={tracks} />
          </div>

          <div style={{ float: 'left' }}>
            {!!track && (
              <TrackEditCard
                apply={this.applyProp}
                clone={this.cloneTracks}
                create={this.createPlus}
                save={this.saveTrack}
                setTitle={this.setTitle}
                suggested={suggested}
                track={track}
                itune={this.iTune}
                assign={this.assignTrack} />)}
          </div>

          {!!itunes?.length && (
            <div style={{ float: 'right' }}>
              <ModalTrackList select={(track) => this.assignTrack(track)} tracks={itunes} />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose.bind(this)} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>

    )
  }
}
