import React from 'react';
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
import { listViewMenuClick } from "./util/Events";
import { AppState } from "./util/State";
import { TrackMenu } from './components/TrackMenu';
import DashPage from './components/DashPage';
import { APP_NAME } from './Constants';
import NavPlayList from './components/NavPlayList';
import SearchDialog from './components/modal/SearchModal';
import WaitIcon from './components/WaitIcon';

function DisplayFindView(props) {
  let { type, param } = useParams();
  if (type === 'songs') {
    return (<TrackListView type={type} param={param} open={props.open} />);
  }
  return (<ArtistList type={type} param={param} open={props.open} />);
}


function DisplayThumbView(props) {
  let { type } = useParams();
  return (<ArtistList type={type} open={props.open} />);
}

function DisplayListView(props) {
  let { type, id } = useParams();
  return (<TrackListView type={type} open={props.open} id={id} />);
}


function App() {
  const [open, setOpen] = React.useState(false);
  const [home, setHome] = React.useState(false);
  const [find, setFind] = React.useState({ open: false });
  const [playing, setPlaying] = React.useState(AppState.PLAYING);
  const [snackMenuOpen, setMenu] = React.useState(false);
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

  listViewMenuClick.subscribe(track => {
    setMenu(true);
    setEditedTrack(track);
  });

  AppState.LOADED = true;
  return (
    <div className={['App', home ? 'home' : ''].join(' ')}>
      <Router>

        {/* toolbar element */}
        <AppBar
          position="fixed"
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
        <div class="amplify-main-workspace">
          <Switch>
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
