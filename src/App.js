import React, { useEffect } from 'react';
import clsx from 'clsx';
import './App.css';
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
  Switch,
  Route,
  useParams,
  Link
} from "react-router-dom";
import ArtistList from './components/BasicList';
import TrackListView from "./components/BasicView";
import AudioPlayer from './components/audio/Player';
import Underline from './components/underline/Underline';
import { openMenuRequest } from "./util/Events";
import { AppState } from "./util/State";
import { TrackMenu } from './components/TrackMenu';
import DashPage from './components/DashPage';
import { APP_NAME } from './Constants';
import NavPlayList from './components/NavPlayList';
import SearchDialog from './components/modal/SearchModal';
import { WaitIcon } from './components/WaitIcon';
import Notifier from './components/Notifier';

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


function App() {
  const [open, setOpen] = React.useState(false);
  const [home, setHome] = React.useState(false);
  const [find, setFind] = React.useState({ open: false });
  const [playing, setPlaying] = React.useState(AppState.PLAYING);
  const [snackMenuOpen, setMenu] = React.useState(false);
  const [light, setLight] = React.useState(false);
  const [editedTrack, setEditedTrack] = React.useState({});
  const classes = useStyles();

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
    }
  }

  const handleSetHome = (arg) => {
    setHome(arg)
  }

  const setPlayState = (playingNow) => {
    AppState.PLAYING = playingNow;
    setPlaying(playingNow);
  }

  useEffect(() => {
    console.log('subscribing')
    const sub = openMenuRequest.subscribe(track => {
      setMenu(true);
      setEditedTrack(track);
    });
    return () => {
      console.log('unsubscribing')
      sub.unsubscribe();
    }
  });

  AppState.LOADED = true;
  return (
    <div className={['App', light ? 'light' : '', home ? 'home' : ''].join(' ')}>
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
            <Link to="/">
              <img className="toolbar-logo" alt={APP_NAME} src="http://ullify.com/assets/notify.png" />
              <Underline innerText="Amplify!" />
            </Link>
            {/* search */}
            <div className={classes.search}>
              <SearchDialog close={handleSearchClose} isOpen={find.open} param={find.param} />
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
            </div>
            <div className={classes.sectionDesktop}>
              <WaitIcon />
              <IconButton
                onClick={handleLightClick}
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                color="inherit"
              >
                <Icon>light_mode</Icon>
              </IconButton>
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
          <Switch>
            <Route path="/recent/:type" children={<DisplayListView recent open={open} />} />
            <Route path="/find/:type/:param" children={<DisplayFindView open={open} />} />
            <Route path="/list/:type" children={<DisplayThumbView open={open} />} />
            <Route path="/show/:type/:id" children={<DisplayListView open={open} />} />
            <Route path="/show/:type" children={<DisplayListView open={open} />} />
            <Route path="/main/:type" children={<DashPage setHome={handleSetHome} open={open} />} />
            <Route path="/" children={<DashPage setHome={handleSetHome} open={open} />} />
          </Switch>
        </div>

        {/* bottom sheet */}
        <Drawer variant="temporary" onClick={handleOops} anchor="bottom" open={snackMenuOpen}>
          <TrackMenu track={editedTrack} />
        </Drawer>
      </Router>

      <Notifier />

      {/* audio player */}
      <Drawer
        className={clsx({ [classes.player]: playing })}
        variant="persistent"
        anchor="bottom"
        open={playing}
        classes={{
          paper: clsx({ [classes.player]: playing }),
        }}  >
        <AudioPlayer notify={setPlayState} />
      </Drawer>
    </div >
  );
}

export default App;
