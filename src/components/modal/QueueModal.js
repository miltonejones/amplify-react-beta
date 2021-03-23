import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Badge, Icon, makeStyles } from '@material-ui/core';
import Underline from '../underline/Underline';
import { DataGrid } from '@material-ui/data-grid';
import { playbackRequest$, playBegin, playEnd } from '../../util/Events';
import { ResponsiveDataGrid } from '../ResponsiveDataGrid';

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
    // border: 'solid 2px orange',
    height: '320px',
    width: '620px',
    padding: '8px'
  },
  root: {
    // border: 'dotted 2px orange',
    height: '300px',
    width: '600px',
  }
}));

const columns = [
  { field: 'Title', headerName: 'Title', width: 224 },
  { field: 'artistName', headerName: 'Artist', width: 164 },
  { field: 'albumName', headerName: 'Album', width: 180 }
];


export default function QueueDialog(props) {
  const classes = useStyles();
  const { items, css, selected } = props;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCellClick = (params) => {

    const track = params?.row || params;
    const index = items.indexOf(track);

    playbackRequest$.next({ items, track, index });
  }



  return (
    <div className={css}>

      <Badge onClick={handleClickOpen} color="secondary" badgeContent={items?.length}>
        <Icon>queue_music</Icon>
      </Badge>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"><Underline innerText="Play Queue" dark={true} /></DialogTitle>
        <DialogContent classes={{ root: classes.outer }}>
          {/* <DataGrid onCellClick={handleCellClick} rows={items} columns={columns} pageSize={5} /> */}

          <ResponsiveDataGrid
            select={handleCellClick}
            click={handleCellClick}
            selectionModel={selected}
            objects={items}
            cols={columns}
            pageSize={15}


          />


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
