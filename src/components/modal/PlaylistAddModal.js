import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Badge, FormControlLabel, Icon, makeStyles, Switch } from '@material-ui/core';
import Underline from '../underline/Underline';
import { PLAYLIST_COLLECTION, playListContainsTrack, addToPlaylistByKey } from '../../AmplifyData';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
  outer: {
    height: '320px',
    width: '680px',
    padding: '8px'
  },
  root: {
    height: '300px',
    width: '660px',
  }
}));
const emptyList = () => <h4>No playlists found</h4>

export default function PlaylistAddDialog(props) {
  const classes = useStyles();
  const { count, track, component, css } = props;
  const [open, setOpen] = React.useState(false);
  const [group, setGroup] = React.useState(PLAYLIST_COLLECTION);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCheck = (event) => {
    const listKey = event.target.value;
    addToPlaylistByKey(listKey, track).then(() => {
      setGroup(PLAYLIST_COLLECTION);
    });
  }
  return (
    <div className={css}>
      <span onClick={handleClickOpen}>
        {
          component || <Badge max={9999} color="secondary" badgeContent={count}>
            <Icon>playlist_add</Icon>
          </Badge>
        }
      </span>
      <Dialog
        open={open}
        maxWidth="xl"
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Add <Underline innerText={track?.Title} dark={true} /> to Playlist(s)</DialogTitle>
        <DialogContent classes={{ root: classes.outer }}>
          <div className="playlist-add-grid">
            {
              (group && group.map && group.map((c, i) => (
                <div className="playlist-add-item no-wrap" key={i}><FormControlLabel
                  control={
                    <Switch
                      name="checkedB"
                      onChange={handleCheck}
                      color="primary"
                      value={c.Title}
                      checked={playListContainsTrack(track, c)}
                    />
                  }
                  label={c.Title}
                /></div>))) || emptyList
            }
          </div>
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
