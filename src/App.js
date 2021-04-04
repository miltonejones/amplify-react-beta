import React, { useEffect } from 'react';
import clsx from 'clsx';
import './App.css';
import './App.mobile.css';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import InputBase from '@material-ui/core/InputBase';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import useStyles from './styles/core-styles'
import NavList from './components/NavList';
import {
  BrowserRouter as Router,
  Switch as Choice,
  Route,
  useParams,
  Link
} from "react-router-dom";
import ArtistList from './components/BasicList';
import TrackListView from "./components/BasicView";
import AudioPlayer from './components/audio/Player';
import Underline from './components/underline/Underline';
import { ToolTipButton } from './components/ToolTipButton';
import { openMenuRequest } from "./util/Events";
import { AppState } from "./util/State";
import { TrackMenu } from './components/TrackMenu';
import DashPage from './components/DashPage';
import { APP_NAME } from './Constants';
import NavPlayList from './components/NavPlayList';
import SearchDialog from './components/modal/SearchModal';
import { WaitIcon } from './components/WaitIcon';
import Notifier from './components/Notifier';
import { useMediaQuery, Switch, FormControlLabel } from '@material-ui/core';
import { BuildLocalDb } from './data/BuildLocalDb';
import DualProgressIndicator from './components/DualProgressIndicator';
import TitleBar from './components/TitleBar';
import { LocalApi, READ_MODE } from './data/LocalApi';
import ConfirmDialog, { DialogConfig } from './components/modal/ConfirmDialog';

function DisplayFindView(props) {
  const params = useParams();
  if (params.type === 'songs') {
    return (<TrackListView {...params} {...props} />);
  }
  return (<ArtistList {...params} {...props} />);
}

function DisplayThumbView(props) {
  const params = useParams();
  return (<ArtistList {...params} {...props} />);
}

function DisplayListView(props) {
  const params = useParams();
  return (<TrackListView {...params} {...props} />);
}

function OfflineSwitch({ change, label, checked }) {
  return (
    <FormControlLabel
      control={
        <Switch
          name="checkedB"
          onChange={change}
          color="secondary"
          value={label}
          checked={checked}
        />
      }
      label={<span class="material-icons">
        signal_cellular_nodata
      </span>}
    />
  )
}
OfflineSwitch.defaultProps = {
  title: 'Offline mode',
  change: a => console.log(a)
}

function App() {
  const [open, setOpen] = React.useState(false);
  const [home, setHome] = React.useState(true);
  const [find, setFind] = React.useState({ open: false });
  const [mode, setMode] = React.useState(READ_MODE.REMOTE);
  const [expanded, setExpanded] = React.useState(false);
  const [ready, setReady] = React.useState(0);
  const [playing, setPlaying] = React.useState(AppState.PLAYING);
  const [snackMenuOpen, setMenu] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [light, setLight] = React.useState(false);
  const [editedTrack, setEditedTrack] = React.useState({});
  const [dialogProps, setDialogProps] = React.useState({});
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)');
  const eq_width = matches ? 300 : 400;
  const dialog = DialogConfig(setDialogProps);


  const handleSearchClick = () => {
    setSearchOpen(!searchOpen);
  }

  const doSwap = () => {
    LocalApi.swap()
    setMode(LocalApi.Mode);
    setReady(LocalApi.Mode === READ_MODE.REMOTE)
  }

  const swap = async () => {
    const count = await LocalApi.count();
    const message = count > 0
      ? 'You are turning offline mode ON. Your local database may not be up to date with online data. Do you want to continue?'
      : 'You are turning offline mode ON. It will take a few minutes to build your music library. Do you want to continue?';
    if (mode === READ_MODE.REMOTE) {
      dialog(message, 'Enable offline mode?').then(yes => yes && doSwap());
      return;
    }
    doSwap();
  }

  const handleDrawerOpen = () => {
    if (open) {
      return handleDrawerClose();
    }
    setOpen(true);
  };

  const handleSearchClose = () => {
    setFind({ open: false });
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleLightClick = () => {
    setLight(!light);
  };
  const handleOops = () => {
    setMenu(false);
  };

  const handleInputChange = (arg) => {
    const keyCode = arg.keyCode;
    const param = arg.target?.value;
    if (keyCode === 13) {
      setFind({ open: true, param });
      setSearchOpen(!1);
    }
  }

  const handleSetHome = (arg) => {
    setHome(arg)
    setOpen(false);
  }

  const setExpandState = () => {
    setExpanded(!expanded);
  }

  const setPlayState = (playingNow) => {
    AppState.PLAYING = playingNow;
    setPlaying(playingNow);
  }


  useEffect(() => {
    const sub = openMenuRequest.subscribe(track => {
      setMenu(true);
      setEditedTrack(track);
    });
    setMode(LocalApi.Mode);
    return () => {
      sub.unsubscribe();
    }
  });

  AppState.LOADED = true;
  const InlineSearchElement = () => {
    const { open, param } = find;
    return (<div className={classes.search}>
      <SearchDialog close={handleSearchClose} isOpen={open} param={param} />

      <div className={classes.searchIcon}>
        <Icon>search</Icon>
      </div>
      <InputBase
        placeholder="Search…"
        onKeyUp={handleInputChange}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ 'aria-label': 'search' }}
      />

    </div>)
  };

  const enabled = mode === READ_MODE.LOCAL;
  const message = `${enabled ? 'signal_wifi_4_bar_lock' : 'signal_wifi_off'}`
  if (!ready) {
    return (
      <BuildLocalDb complete={() => setReady(true)} />
    )
  }

  return (
    <div className={['App', light ? 'light' : '', home ? 'home' : ''].join(' ')}>
      <ConfirmDialog {...dialogProps} />
      <Router>

        {/* toolbar element */}
        <AppBar
          position="fixed"
          classes={{ root: 'toolbar-root' }}
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}>
          <Toolbar >
            {/* hamburger menu */}
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              onClick={handleDrawerOpen}
              aria-label="open drawer" >
              <Icon>menu</Icon>
            </IconButton>
            {/* logo */}
            {!(matches && open) && (<Link to="/">
              <img className="toolbar-logo" alt={APP_NAME} src="http://ullify.com/assets/notify.png" />
              <Underline innerText={APP_NAME} />
            </Link>)}
            {/* search */}
            {!matches && <InlineSearchElement />}
            {matches && <div className={classes.grow} ></div>}

            {matches ? (<div className="flex-centered">
              <ToolTipButton title='Offline Mode' icon={message} click={() => swap()} />
              {/* <OfflineSwitch checked={mode === READ_MODE.LOCAL} label={message} change={() => swap()} /> */}
              <IconButton
                onClick={handleSearchClick}
                edge="end"
                color="inherit">
                <Icon>search</Icon>
              </IconButton>
            </div>) : ''}

            <div className={classes.grow} ></div>
            <div className={classes.sectionDesktop}>
              {/* <OfflineSwitch checked={mode === READ_MODE.LOCAL} label={message} change={() => swap()} /> */}
              {/* <ToolTipButton title='Offline Mode' icon={message} click={() => swap()} /> */}
              <WaitIcon />

              <IconButton
                onClick={() => swap()}
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                color="inherit"
              >
                <Icon>{message}</Icon>
              </IconButton>

              {/* <IconButton
                onClick={handleLightClick}
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                color="inherit"
              >
                <Icon>light_mode</Icon>
              </IconButton> */}
            </div>
          </Toolbar>
        </AppBar>

        {/* sidebar element */}
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }} >
          {/* primary nav */}
          <NavList />
          {/* secondary nav */}
          <NavPlayList />
        </Drawer>

        {/* primary workspace */}
        <div className="amplify-main-workspace">
          {!home && (<div className={[classes.search, "mobile-search-element", searchOpen ? 'open' : ''].join(' ')}>
            <InlineSearchElement />
          </div>)}
          <Choice>
            <Route path="/demo" children={<DualProgressIndicator />} />
            <Route path="/recent/:type" children={<DisplayListView setHome={handleSetHome} recent open={open} />} />
            <Route path="/find/:type/:param" children={<DisplayFindView setHome={handleSetHome} open={open} />} />
            <Route path="/list/:type" children={<DisplayThumbView setHome={handleSetHome} open={open} />} />
            <Route path="/show/:type/:id" children={<DisplayListView setHome={handleSetHome} open={open} />} />
            <Route path="/show/:type" children={<DisplayListView setHome={handleSetHome} open={open} />} />
            <Route path="/main/:type" children={<DashPage mobile={matches} setHome={handleSetHome} open={open} />} />
            <Route path="/" children={<DashPage mobile={matches} setHome={handleSetHome} open={open} />} />
          </Choice>
        </div>

        {/* bottom sheet */}
        <Drawer variant="temporary" onClick={handleOops} anchor="bottom" open={snackMenuOpen}>
          <TrackMenu track={editedTrack} />
        </Drawer>
      </Router>

      <Notifier />

      {/* audio player */}
      <Drawer
        className={clsx({ [classes.player]: playing && !expanded, [classes.expanded]: expanded })}
        variant="persistent"
        anchor="bottom"
        open={playing}
        classes={{
          paper: clsx({ [classes.player]: playing && !expanded, [classes.expanded]: expanded }),
        }}  >
        <AudioPlayer mobile={matches} expanded={expanded} expand={setExpandState} eq_width={eq_width} notify={setPlayState} />
      </Drawer>
      <TitleBar />
    </div >
  );
}

export default App;
