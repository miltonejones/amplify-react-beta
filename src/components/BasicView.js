
import React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { listViewOnClick$, listViewMenuClick$ } from "../util/Events";
import { AppState, sortObjects } from '../util/State';
import Icon from '@material-ui/core/Icon';
import { compareTrackToLists, getPlaylist, query } from '../AmplifyData';
import { ARTIST_API_ADDRESS } from '../Constants';
import { createCrumb, PageBreadcrumbs } from './Breadcrumb';
import PlaylistAddDialog from './modal/PlaylistAddModal';


const columns = [
  { field: 'trackNumber', headerName: '#', width: 24 },
  {
    field: 'Title', headerName: 'Title', width: 324,
    renderCell: (params) => {
      const heart = compareTrackToLists(params.row);
      return (
        <span>{heart ? <Icon style={{ color: 'red' }}>favorite</Icon> : <i />}{params.value}</span>
      );
    }
  },
  { field: 'artistName', headerName: 'Artist', width: 264 },
  { field: 'albumName', headerName: 'Album', width: 230 },
  { field: 'Genre', headerName: 'Genre', width: 124 },
  { field: 'trackTime', headerName: 'Time', disableColumnMenu: true, width: 100 },

  {
    field: 'menu', headerName: ' ', width: 56, disableColumnMenu: true,
    renderCell: (params) => {
      return (
        <div>
          <Icon>more_vert</Icon>
        </div>
      );
    }
  },

  {
    field: 'ID', headerName: ' ', width: 56, disableColumnMenu: true,
    renderCell: (params) => {
      return (
        <div>
          <PlaylistAddDialog count={0} track={params.row} />
        </div>
      );
    }
  }

];


const omit = {
  artist: 'artistName',
  album: 'albumName',
  genre: 'Genre'
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

  getPlaylist() {
    getPlaylist(this.props.id).then(data => {
      this.setObjects(data, this.props.id);
    });
  }

  setObjects(items, title) {
    const objects = sortObjects(items, this.getType());
    const crumb = createCrumb(this.props.type, this.props.id, title);
    this.setState({ objects, crumb });
  }

  getUriLocation() {
    const type = this.getType();
    return type === 'library'
      ? `${ARTIST_API_ADDRESS}tune`
      : `${ARTIST_API_ADDRESS}${type}?id=${this.props.id}`;
  }

  loadComponentList() {
    const type = this.getType();
    if (type === 'playlist') {
      return this.getPlaylist();
    }
    // const address = this.getUriLocation();
    const promise = type === 'library'
      ? query('tune')
      : query(type, this.props.id);
    // console.log(address)
    promise
      .then(res => {
        console.log(res.data)
        const datum = res.data;
        this.setObjects(datum.related || datum, datum.Name || datum.Title);
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
    if (params?.field === 'menu') {
      listViewMenuClick$.next(params.row);
      return;
    }
    if (params?.field === 'ID') {
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
    const { objects, crumb } = this.state;
    const skip = omit[this.getType()];
    const cols = !skip
      ? columns
      : columns.filter(col => col.field !== skip);
    const className = ['list-view'];
    if (this.props.open) className.push('open');
    if (AppState.PLAYING) className.push('collapsed');
    return (
      <div>
        <PageBreadcrumbs open={this.props.open} crumb={crumb} />
        <div className={className.join(' ')}>
          <DataGrid onCellClick={this.handleCellClick.bind(this)} rows={objects} columns={cols} pageSize={50} />
        </div>
      </div>
    )
  }
}