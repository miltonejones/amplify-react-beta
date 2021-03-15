import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom';


class NavMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  handleClick(event) {
    this.setState({
      ...this.state,
      open: !this.state.open,
      anchorEl: event.currentTarget
    });
  }

  handleClose() {
    this.setState({
      ...this.state,
      open: false,
      anchorEl: null
    });
  }

  componentDidMount() {
    console.log(this.props)
    this.setState({
      items: this.props.items?.filter(item => item.Count > 400)
    })
  }
  render() {
    const { open, anchorEl, items } = this.state;
    console.log(items)
    return !items ? (<b>loading...</b>) : (
      <div>
        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick.bind(this)}>
          Browse Music by Genre...
      </Button>
        <Menu
          id="simple-menu"
          open={open}
          anchorEl={anchorEl}
          keepMounted
          onClose={this.handleClose.bind(this)}
        >
          {items.map(item => <MenuItem key={item.Name} onClick={this.handleClose.bind(this)}><Link to={`/show/Genre.html/${item.genreKey}`}>{item.Name} ({item.Count}</Link>)</MenuItem>)}
          <MenuItem onClick={this.handleClose.bind(this)}><Link to="/list/Genre.html">View all genres...</Link></MenuItem>
        </Menu>
      </div>
    );
  }
}

export {
  NavMenu
}


