
import React from 'react';
import axios from 'axios';
import { ARTIST_API_ADDRESS } from '../Constants';
import { DataGrid } from '@material-ui/data-grid';
import { listViewOnClick$, listViewMenuClick$ } from "../util/Events";
import clsx from 'clsx';
import { AppState, generateKey } from '../util/State';
import Icon from '@material-ui/core/Icon';

const columns = [
  { field: 'trackNumber', headerName: '#', width: 24 },
  { field: 'Title', headerName: 'Title', width: 324 },
  { field: 'artistName', headerName: 'Artist', width: 264 },
  { field: 'albumName', headerName: 'Album', width: 230 },
  { field: 'Genre', headerName: 'Genre', width: 124 },
  {
    field: 'ID', headerName: '#', width: 100,
    renderCell: (params) => {
      return (
        <Icon>more_vert</Icon>
      );
    }
  }
];


const omit = {
  artist: 'artistName',
  album: 'albumName',
  genre: 'Genre'
}

const sorts = {
  artist: 'albumName',
  album: 'trackNumber',
  genre: 'artistName',
  library: 'ID^'
}


export default class TrackListView extends React.Component {
  cacheType = '';
  constructor(props) {
    super(props);
    this.state = {
      objects: [],
      activate: AppState.PLAYING
    };
  }

  organize(list, tracks) {
    const output = [];
    list.related.map((track, i) => {
      const found = tracks.filter(f => this.stripExt(f.FileKey) == this.stripExt(track))[0];
      if (found) {
        const exist = output.filter(o => o.FileKey === found.FileKey)[0];
        if (exist) {
          return;
        }
        found.trackNumber = i + 1;
        output.push(found);
      }
    });
    return output;
  }
  stripExt(value) {
    if (!(value && value.replace)) {
      return '';
    }
    const stripped = value.replace(/(\.mp3|\.opus|\.ogg)/g, '');
    if (stripped) {
      return stripped;
    }
    return value;
  }


  getTrackListByKeys(playlist, Keys) {
    const address = ARTIST_API_ADDRESS + 'tune';
    axios.post(address, { Keys })
      .then(res => {
        console.log({ res })
        const related = this.organize(playlist, res.data);
        console.log({ related })
        this.setObjects(related);
      })
  }

  getPlaylist() {
    const address = ARTIST_API_ADDRESS + this.getType();
    axios.get(address)
      .then(res => {
        // console.log(res, this.props)
        const playlist = res.data?.filter(d => generateKey(d.Title) === this.props.id)[0];
        // console.log({ playlist })
        if (playlist) {
          const Keys = playlist.related.filter(f => !!f);
          // console.log({ Keys })
          this.getTrackListByKeys(playlist, Keys)
        }
      });
  }

  setObjects(items) {
    const sorter = sorts[this.getType()];
    const field = !sorter ? 'trackNumber' : sorter.replace('^', '');
    const objects = items.sort((a, b) => sorter?.indexOf('^') > 0 ? (b[field] - a[field]) : (a[field] - b[field]));
    objects.map(obj => obj.id = obj.ID);
    this.setState({ objects });
  }

  getUriLocation() {
    const type = this.getType();
    return type === 'library'
      ? `${ARTIST_API_ADDRESS}tune`
      : `${ARTIST_API_ADDRESS}${type}?id=${this.props.id}`;
  }

  loadComponentList() {
    if (this.getType() === 'playlist') {
      return this.getPlaylist();
    }
    const address = this.getUriLocation();
    console.log(address)
    axios.get(address)
      .then(res => {
        this.setObjects(res.data.related || res.data);
      });
  }


  componentDidUpdate() {
    const address = this.getUriLocation();
    if (this.cacheType !== address) {
      this.cacheType = address;
      this.loadComponentList();
    }
  }
  componentDidMount() {
    this.loadComponentList();
  }
  getType() {
    return this.props.type.replace('.html', '').toLowerCase();
  }
  handleCellClick(params) {
    if (params?.field === 'ID') {
      // alert(params.field);
      listViewMenuClick$.next(params.row);
      return;
    }
    const items = this.state.objects;
    const track = params?.row;
    const index = items.indexOf(track);
    console.log({ items, track, index });
    listViewOnClick$.next({ items, track, index });
    this.activate();
  }
  activate() {
    const activated = true;
    this.setState({
      ...this.state,
      activated
    })
  }
  render() {
    const skip = omit[this.getType()];
    const cols = !skip
      ? columns
      : columns.filter(col => col.field !== skip);
    return (
      <div className={clsx("list-view", {
        ['collapsed']: AppState.PLAYING,
        ['open']: this.props.open
      })}>
        <DataGrid onCellClick={this.handleCellClick.bind(this)} rows={this.state.objects} columns={cols} pageSize={50} />
      </div>
    )
  }
}