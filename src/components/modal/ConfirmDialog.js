import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

export default function ConfirmDialog({ send, open, head, text, prompt }) {
  const [back, setBack] = useState(false);
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => send(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{head}</DialogTitle>

        <DialogContent>

          <DialogContentText id="alert-dialog-description">
            {text}
          </DialogContentText>

          {!!prompt && (<DialogContentText id="alert-dialog-description">
            <TextField defaultValue={prompt} onChange={(e) => {
              setBack(e.target.value)
            }} id="standard-basic" label="Standard" />
          </DialogContentText>)}

        </DialogContent>

        <DialogActions>
          <Button onClick={() => send(false)} color="primary">
            Disagree
          </Button>
          <Button onClick={() => send(back || true)} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

ConfirmDialog.defaultProps = {
  head: 'Confirm this action!'
};
/**
 * returns confirm function to caller
 * @param {*} make 
 */
const DialogConfig = make => (text, head, prompt) => new Promise(callback => {
  make({
    text,
    head,
    open: true,
    send: what => {
      callback(what);
      make({});
    },
    prompt
  });
});

export {
  DialogConfig
}