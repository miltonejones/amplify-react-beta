import { Icon, IconButton } from '@material-ui/core';
import React from 'react';
import { dataStateChange } from "../AmplifyData";
import { playBegin, playEnd } from '../util/Events';

class WaitIcon extends React.Component {

  sub = null;
  constructor(props) {
    super(props);
    this.state = {
      ready: true
    };
  }

  componentDidMount() {
    this.sub = dataStateChange.subscribe(ready => this.setState({ ready }));
  }
  componentWillUnmount() {
    if (this.sub) this.sub.unsubscribe();
  }

  render() {
    const { ready } = this.state;
    return !ready && (
      <IconButton classes={{ root: 'spinning-icon' }} edge="end" aria-label="show 4 new mails" color="inherit">
        <Icon>hourglass_empty</Icon>
      </IconButton>
    )
  }
}


class PlayIcon extends React.Component {

  beginSub = null;
  endSub = null;
  constructor(props) {
    super(props);
    this.state = {
      playing: false
    };
  }

  componentDidMount() {
    this.beginSub = playBegin.subscribe(state => {
      const playing = state.source?.indexOf(this.props.path) > -1 && !this.props.immutable;
      this.setState({ playing })
    });
    this.endSub = playEnd.subscribe(ready => {
      this.setState({ playing: false })
    });
  }
  componentWillUnmount() {
    if (this.beginSub) this.beginSub.unsubscribe();
    if (this.endSub) this.endSub.unsubscribe();
  }

  render() {
    const { playing } = this.state;
    const { icon } = this.props;
    return <Icon>{playing ? 'volume_up' : icon}</Icon>
  }
}

export {
  WaitIcon,
  PlayIcon
}