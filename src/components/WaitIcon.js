import { Icon, IconButton } from '@material-ui/core';
import React from 'react';
import { dataStateChange } from "../AmplifyData";

export default class WaitIcon extends React.Component {

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