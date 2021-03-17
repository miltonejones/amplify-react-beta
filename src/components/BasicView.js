
import React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { listViewOnClick$, listViewMenuClick$ } from "../util/Events";
import { AppState, mmss, sortObjects } from '../util/State';
import Icon from '@material-ui/core/Icon';
import { compareTrackToLists, getPlaylist, query, search } from '../AmplifyData';
import { ARTIST_API_ADDRESS } from '../Constants';
import { createCrumb, PageBreadcrumbs } from './Breadcrumb';
import PlaylistAddDialog from './modal/PlaylistAddModal';
import { Link } from 'react-router-dom';


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
  {
    field: 'artistName', headerName: 'Artist', width: 264,
    renderCell: params => {
      return <Link to={'/show/Artist.html/' + params.row.artistFk}>{params.value}</Link>
    }
  },
  {
    field: 'albumName', headerName: 'Album', width: 230,
    renderCell: params => {
      return <Link to={'/show/Album.html/' + params.row.albumFk}>{params.value}</Link>
    }
  },
  {
    field: 'Genre', headerName: 'Genre', width: 124,
    renderCell: params => {
      return <Link to={'/show/Genre.html/' + params.row.genreKey}>{params.value}</Link>
    }
  },
  {
    field: 'computedTime', headerName: 'Time', disableColumnMenu: true, width: 100,
    valueGetter: (params) => mmss(params.getValue('trackTime'), 1000)
  },

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
  findType = '';
  constructor(props) {
    super(props);
    this.state = {
      objects: [],
      activate: AppState.PLAYING
    };
    this.handleCellClick = this.handleCellClick.bind(this);
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
  searchComponentList() {
    search(this.props.param, this.props.type).then(res => {

      const objects = res.data.items.map(item => item.data);
      objects.map(o => o.id = o.ID)

      this.setState({
        crumb: {
          label: res.data.label
        }, objects
      });
    });
  }
  loadComponentList() {
    if (this.props.param) {
      this.searchComponentList();
      return;
    }
    const type = this.getType();
    if (type === 'playlist') {
      return this.getPlaylist();
    }
    // const address = this.getUriLocation();
    const promise = type === 'library'
      ? query('tune')
      : query(type, this.props.id);
    promise
      .then(res => {
        // 
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
    if (this.props.type && this.findType !== this.props.type) {
      this.findType = this.props.type;
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
    if (params?.field !== 'Title') {
      return;
    }
    const items = this.state.objects;
    const track = params?.row;
    const index = items.indexOf(track);
    const source = this.props.type + '/' + this.props.id;

    listViewOnClick$.next({ items, track, index, source });
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
          <DataGrid onCellClick={this.handleCellClick} rows={objects} columns={cols} pageSize={50} />
        </div>
      </div>
    )
  }
}