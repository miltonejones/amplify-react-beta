// import logo from './logo.svg';
import React from 'react';
import clsx from 'clsx';
import './App.css';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import InputBase from '@material-ui/core/InputBase';
// import { fade, makeStyles } from '@material-ui/core/styles';
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
// import { Subject } from 'rxjs';
import AudioPlayer from './components/audio/Player';
import Underline from './components/underline/Underline';
import { listViewMenuClick } from "./util/Events";
import { AppState } from "./util/State";
import { TrackMenu } from './components/TrackMenu';
import DashPage from './components/DashPage';
import { APP_NAME } from './Constants';
import PageBreadcrumbs from './components/Breadcrumb';

// const drawerWidth = 240;



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
  const [playing, setPlaying] = React.useState(AppState.PLAYING);
  const [menu, setMenu] = React.useState({});

  const classes = useStyles();

  const handleDrawerOpen = () => {
    if (open) {
      return handleDrawerClose();
    }
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleOops = () => {
    setMenu({});
  };

  const handleSetHome = (arg) => {
    console.log({ arg })
    setHome(arg)
  }

  const setPlayState = (playingNow) => {
    console.log({ playingNow })
    AppState.PLAYING = playingNow;
    setPlaying(playingNow);
  }

  listViewMenuClick.subscribe(setMenu);
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
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              onClick={handleDrawerOpen}
              aria-label="open drawer"
            >
              <Icon>menu</Icon>
            </IconButton>
            <Link to="/">
              <img className="toolbar-logo" alt={APP_NAME} src="http://ullify.com/assets/notify.png" />
              <Underline innerText="Amplify!" />
            </Link>


            <div className={classes.search}>

              <div className={classes.searchIcon}>
                <Icon>search</Icon>
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
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
          }}
        >

          {/* primary nav */}
          <NavList />

        </Drawer>

        <div class="amplify-main-workspace">
          {/* workspace */}
          <Switch>
            <Route path="/list/:type" children={<DisplayThumbView open={open} />} />
            <Route path="/show/:type/:id" children={<DisplayListView open={open} />} />
            <Route path="/show/:type" children={<DisplayListView open={open} />} />
            <Route path="/main/:type" children={<DashPage setHome={handleSetHome} open={open} />} />
            <Route path="/" children={<DashPage setHome={handleSetHome} open={open} />} />
          </Switch>
        </div>



        <Drawer variant="temporary" onClick={handleOops} anchor="bottom" open={!!menu.ID}>
          <TrackMenu track={menu} />
        </Drawer>


      </Router>

      <Drawer
        className={clsx({ [classes.player]: playing })}
        variant="persistent"
        anchor="bottom"
        open={playing}
        classes={{
          paper: clsx({ [classes.player]: playing }),
        }}
      >

        <AudioPlayer notify={setPlayState} />

      </Drawer>


      {/* */}
    </div >
  );
}

export default App;
