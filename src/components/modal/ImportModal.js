import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Icon, IconButton, InputBase, makeStyles, Paper } from '@material-ui/core';
import Underline from '../underline/Underline';
import Fab from '@material-ui/core/Fab';
import {
  download,
  status,
  socketResponse,
  connect
} from '../../Socket'
import ModalTrackList from './ModalTrackList';
const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  fab: {
    position: 'absolute',
    bottom: '120px',
    right: '40px',
    zIndex: 1000
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
  outer: {
    // border: 'solid 2px orange',
    height: '320px',
    width: '620px',
    padding: '8px'
  },
  root: {
    // border: 'dotted 2px orange',
    height: '300px',
    width: '600px',
  },
  inputroot: {
    minWidth: 275,
    maxWidth: 320,
    width: '320px',
    margin: 4
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
}));


export default function DownloadDialog(props) {
  const classes = useStyles();
  const { refresh } = props;
  const [progress, setProgress] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [tracks, setTracks] = React.useState([]);
  const [titles, setTitles] = React.useState([]);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const downloadNext = () => {
    if (!titles.length) {
      refresh();
      setOpen(false);
      return;
    }
    const title = titles.pop();
    setTitles(titles);
    download(title);
  }

  const commitTitle = (value) => {
    let title;
    let regex = /v=([^&]{11})/.exec(value);
    if (regex) {
      title = regex[1];
    }
    else {
      regex = /list=([^&]{34})/.exec(value);
      if (regex) {
        title = regex[1];
      }
    }
    if (title) {
      titles.push(title);
      setTitles(titles);
      setProgress(titles.length);
    } else console.log('could not parse', value)
  }

  // const addTitle = (e) => {
  //   console.log({ e })
  //   const { target, keyCode } = e;
  //   const { value } = target;
  //   if (value) {
  //     commitTitle(value)
  //   } else {
  //     console.log('no value in', e)
  //   }
  // }

  const addTrack = (track) => {
    Object.assign(track, {
      ID: Math.random() * 1000,
      artistName: '',
      albumName: '',
      trackNumber: 1
    })
    tracks.push(track);
    console.log({ track, tracks })
    setTracks(tracks);
    setProgress(100);
  }

  useEffect(() => {
    console.log('import modal subscribing', status);
    const sub = socketResponse.subscribe(res => {
      if (res?.state && res.state === 'COMPLETE') {
        console.log({ body: res.body });
        try {
          const t = JSON.parse(res.body);
          addTrack(t)
          downloadNext();
        } catch (e) {
          alert('Error parsing body')
        }
      }
      if (res?.response) {
        const regex = /(\d+.\d+)% of ([\s\S]*?) at/.exec(res.response);
        if (regex) {
          setProgress(regex[1])
        } else {
          console.log(res)
        }
      }
    })
    if (!status) {
      connect();
    }
    return () => {
      sub.unsubscribe();
      console.log('import modal unsubscribing', status);
    }
  });
  return (
    <div>

      <Fab classes={{ root: classes.fab }} onClick={handleClickOpen} color="primary" aria-label="add">
        <Icon>add</Icon>
      </Fab>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"><Underline innerText="Import Audio" dark={true} /></DialogTitle>
        <DialogContent classes={{ root: classes.outer }}>

          <YoutubeInput add={a => commitTitle(a)} />

          {!!tracks.length && <ModalTrackList tracks={tracks} />}

          <IconButton size="small" onClick={() => downloadNext()}>
            <Icon>download</Icon>
          </IconButton>
          {progress}

          <ul>
            {titles.map((title, k) => <li key={k}>{title}</li>)}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}




function YoutubeInput({ value, add }) {
  const classes = useStyles();
  const [param, setParam] = useState('');


  const handleKeyup = (arg) => {
    const keyCode = arg.keyCode;
    const value = arg.target?.value;
    if (keyCode === 13) {
      add(value);
    }
    setParam(value);
  }
  return (
    <div className="modal-data-input">
      <Paper component="div" className={classes.inputroot}>
        <InputBase
          defaultValue={value}
          className={classes.input}
          onKeyUp={handleKeyup}
          placeholder="Enter URL"
        />
        <IconButton onClick={() => add(param)} color="primary" className={classes.iconButton} aria-label="directions">
          <Icon>add</Icon>
        </IconButton>
      </Paper>
      {param}
    </div>
  );
}
