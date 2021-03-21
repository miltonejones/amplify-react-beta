import { Icon } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import React, { Component } from 'react';
import { playBegin, addQueueRequest } from '../util/Events';
export default class Notifier extends Component {
  subscriptions = [];
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      icon: 'add'
    };
    this.handleClose = this.handleClose.bind(this)
  }
  componentWillUnmount() {
    this.subscriptions.map(sub => sub.unsubscribe());
  }
  componentDidMount() {
    this.subscriptions.push(
      playBegin.subscribe(state => {
        const { track, index, length } = state;
        if (!track?.ID) return;
        this.setState({ message: `Playing ${track?.Title} [${index + 1} of ${length}]`, open: true, icon: 'music_note' })
      }),
      addQueueRequest.subscribe(track => {
        this.setState({ message: `${track?.Title} added to queue`, open: true, icon: 'add' })
      })
    )
  }
  handleClose() {
    this.setState({ open: false })
  }
  render() {
    const { open, message, icon } = this.state;
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={open}
          autoHideDuration={6000}
          onClose={this.handleClose}
          message={message}
          action={
            <React.Fragment>
              {/* <Button color="secondary" size="small" onClick={this.handleClose}>
                UNDO
            </Button> */}
              <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleClose}>
                <Icon>{icon}</Icon>
              </IconButton>
            </React.Fragment>
          }
        />
      </div>

    )
  }
}