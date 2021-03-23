
import React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { playbackRequest$, openMenuRequest$, playBegin, playEnd } from "../util/Events";
import { AppState, mmss, randomize, sortObjects } from '../util/State';
import Icon from '@material-ui/core/Icon';
import { compareTrackToLists, dataStateChange, getPlaylist, query, search } from '../AmplifyData';
import { ARTIST_API_ADDRESS, DEFAULT_HREF } from '../Constants';
import { createCrumb, PageBreadcrumbs } from './Breadcrumb';
import PlaylistAddDialog from './modal/PlaylistAddModal';
import { IconButton, useMediaQuery } from '@material-ui/core';
import BatchEditDialog from './modal/BatchEditModal';
import { SongPersistService } from './audio/Persist';
import { TextOrLink } from './TextOrLink';
import { HtmlTooltip } from './HtmlTooltip';
import DownloadDialog from './modal/ImportModal';
import ModalTrackList from './modal/ModalTrackList';
import { DesktopOnly } from '../util/MediaQueries';
import { TrackTooltip } from './TrackToolTip';
import { ResponsiveDataGrid } from './ResponsiveDataGrid';


export default class TrackListView extends React.Component {
  cacheType = '';
  findType = '';
  subscriptions = [];
  constructor(props) {
    super(props);
    this.state = {
      objects: [],
      checkboxes: false,
      ready: true,
      activate: AppState.PLAYING
    };
    this.sendPlayRequest = this.sendPlayRequest.bind(this);
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
    const selectionModel = AppState.TRACK.ID ? [AppState.TRACK.ID] : [];
    this.clearSelectedTracks();
    this.setState({ objects, crumb, open: false, selectionModel });

    // this.selectTrack(AppState.TRACK);
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
      objects.map(o => o.id = o.ID);
      this.setState({
        crumb: {
          label: res.data.label
        }, objects
      });
    });
  }
  recentComponentList() {
    const objects = SongPersistService.get();
    objects.map(o => o.id = o.ID);
    this.setState({
      crumb: {
        label: 'Recently Played'
      }, objects
    });
  }
  loadComponentList() {
    const { param, recent, id } = this.props;
    if (recent) {
      this.recentComponentList();
      return;
    }
    if (param) {
      this.searchComponentList();
      return;
    }
    const type = this.getType();
    if (type === 'playlist') {
      return this.getPlaylist();
    }
    const promise = type === 'library'
      ? query('tune')
      : query(type, id);
    promise
      .then(res => {
        const datum = res.data;

        this.setObjects(datum.related || datum, datum.Name || datum.Title || id);
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
    this.props.setHome(false);
    this.subscriptions.push(
      dataStateChange.subscribe(ready => this.setState({ ...this.state, ready })),
      playBegin.subscribe(opts => {
        const { track } = opts;
        this.selectTrack(track);
      }),
      playEnd.subscribe(() => {
        this.selectTrack();
      })
    );
  }
  componentWillUnmount() {
    this.subscriptions.map(s => s.unsubscribe());
  }
  getType() {
    return this.props.type.replace('.html', '').toLowerCase();
  }
  shuffle() {
    const { objects, crumb } = this.state;
    const items = randomize(objects);
    const track = items[0];
    const index = items.indexOf(track);
    const source = this.props.type + '/' + this.props.id + '/shuffle';
    playbackRequest$.next({ items, track, index, source, crumb });
    this.activate();
  }
  handleCellClick(params) {
    if (params?.field === 'menu') {
      openMenuRequest$.next(params.row);
      return;
    }
    if (params?.field === 'Title') {
      this.sendPlayRequest(params?.row);
    }
  }
  sendPlayRequest(track) {
    const { objects, crumb } = this.state;
    const items = objects;
    const index = items.indexOf(track);
    const source = this.props.type + '/' + this.props.id;
    playbackRequest$.next({ items, track, index, source, crumb });
    this.activate();
  }
  activate() {
    const activated = true;
    this.setState({
      ...this.state,
      activated
    })
  }
  setSelectedTracks(e) {
    const { objects } = this.state;
    const { selectionModel } = e;
    const selectedTracks = selectionModel.map(f => objects.filter(o => f && o.ID.toString() === f.toString())[0])
      .filter(i => !!i);
    this.setState({ ...this.state, selectedTracks });
  }
  selectTrack(track) {
    this.setState({ ...this.state, selectionModel: [track?.ID] });
  }
  clearSelectedTracks() {
    this.setState({
      ...this.state,
      open: false,
      selectedTracks: null,
      selectionModel: [],
      checkboxes: false
    });
  }

  render() {
    const { objects, crumb, checkboxes, open, selectedTracks, selectionModel, ready } = this.state;
    const { type, id } = this.props;
    const skip = OMITTED_COLUMNS[this.getType()];
    const cols = !skip
      ? columns
      : columns.filter(col => col.field !== skip);
    const className = ['list-view'];
    if (this.props.open) className.push('open');
    if (AppState.PLAYING) className.push('collapsed');
    return (
      <div>
        <div className="upper-menu">
          <div className="upper-menu-left">
            <PageBreadcrumbs open={this.props.open} crumb={crumb} />
          </div>
          <div className="upper-menu-right">
            <ShuffleButton type={type} id={id} shuffle={() => this.shuffle()} />
            <IconButton classes={{ root: ['icon-button-no-padding', !ready ? 'spinning-icon' : ''].join(' ') }} onClick={() => this.loadComponentList()}>
              <Icon>refresh</Icon>
            </IconButton>
            <DesktopOnly content={
              <IconButton classes={{ root: 'icon-button-no-padding' }} onClick={() => this.setState({ ...this.state, checkboxes: !checkboxes })}>
                <Icon>{checkboxes ? 'check_circle' : 'check_circle_outline'}</Icon>
              </IconButton>
            } />
            {checkboxes && !!selectedTracks?.length && (<IconButton classes={{ root: 'icon-button-no-padding' }} onClick={() => this.setState({ ...this.state, open: !0 })}>
              <Icon>edit</Icon>
            </IconButton>)}
          </div>
        </div>
        <BatchEditDialog refresh={() => this.loadComponentList()} close={() => this.clearSelectedTracks()} tracks={selectedTracks} isOpen={open} />
        <div className={className.join(' ')}>
          <ResponsiveDataGrid
            click={this.handleCellClick}
            selectionModel={selectionModel}
            change={(e) => this.setSelectedTracks(e)}
            objects={objects}
            select={(t) => this.sendPlayRequest(t)}
            checkboxes={checkboxes}
            cols={cols}
            pageSize={100}
          />
        </div>
        <DownloadDialog refresh={() => this.loadComponentList()} />
      </div>
    )
  }
}

const ShuffleButton = ({ type, id, shuffle }) => {
  const source = type + '/' + id + '/shuffle';
  const icon = source === AppState.SOURCE ? 'shuffle_on' : 'shuffle'
  return (
    <IconButton classes={{ root: 'icon-button-no-padding' }} onClick={() => shuffle()}>
      <Icon>{icon}</Icon>
    </IconButton>)
}

const TitleCell = ({ track }) => {
  const heart = compareTrackToLists(track);
  const value = track.Title?.replace(/\.[^.]{3}$/, '');
  return (
    <HtmlTooltip
      title={<TrackTooltip track={track} />}>
      <a href={DEFAULT_HREF}>{heart ? <Icon style={{ color: 'red' }}>favorite</Icon> : <i />}{value}</a>
    </HtmlTooltip>
  );
}

const columns = [
  { field: 'trackNumber', headerName: '#', width: 24 },
  {
    field: 'Title', headerName: 'Title', width: 324,
    renderCell: (params) => {
      return <TitleCell track={params.row} />
    }
  },
  {
    field: 'artistName', headerName: 'Artist', width: 264,
    renderCell: params => {
      return <TextOrLink path="/show/Artist.html/" id={params.row.artistFk} text={params.value} />
    }
  },
  {
    field: 'albumName', headerName: 'Album', width: 230,
    renderCell: params => {
      return <TextOrLink path="/show/Album.html/" id={params.row.albumFk} text={params.value} />
    }
  },
  {
    field: 'Genre', headerName: 'Genre', width: 124,
    renderCell: params => {
      return <TextOrLink path="/show/Genre.html/" id={params.row.genreKey} text={params.value} />
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


const OMITTED_COLUMNS = {
  artist: 'artistName',
  album: 'albumName',
  genre: 'Genre'
}

