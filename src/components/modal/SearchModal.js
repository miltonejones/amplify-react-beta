import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Underline from '../underline/Underline';
import { query, search } from '../../AmplifyData';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { AccordionActions, Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import { playbackRequest$ } from '../../util/Events';
import { sendRequestToPlayer } from '../audio/PlayerRequest';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));


export default class SearchDialog extends React.Component {
  cacheParam = ''
  constructor(props) {
    super(props);
    this.state = {
      artists: []
    };
  }
  find() {
    search(this.props.param)
      .then(res => {
        this.setState({
          ...res.data
        });

      })
  }
  check() {
    if (this.props.param && this.cacheParam !== this.props.param) {
      console.info('param change --> ' + this.props.param);
      this.find();
    }

    this.cacheParam = this.props.param;

  }
  componentDidUpdate() {
    this.check();
  }
  loadComponentList() {

  }
  componentDidMount() {

    this.check();
    this.loadComponentList();
  }
  handleClose() {
    this.props.close();
  }
  render() {
    const { isOpen, param } = this.props;

    return (

      <Dialog
        classes={{ root: 'flex-centered' }}
        open={isOpen}
        onClose={this.handleClose.bind(this)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"><Underline innerText="Search" dark={true} /></DialogTitle>
        <DialogContent classes={{ root: 'classes.outer' }}>
          {Object.keys(this.state).length < 2 ? <b>Finding "{param}"...</b> : <SimpleAccordion param={param} items={this.state} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose.bind(this)} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>

    )
  }
}


function SimpleAccordion(props) {
  const classes = useStyles();
  const { items, param } = props;
  const keys = Object.keys(items).filter(f => ['youtube', 'itunes'].indexOf(f) < 0)
  let history = useHistory();

  const handleFindClick = (type) => () => {
    const loc = `/find/${type}/${param}`
    history.push(loc);
  }

  const handleListClick = (type, item) => () => {
    const map = {
      artists: 'Artist.html',
      albums: 'Album.html'
    }
    if (map[type]) {
      const href = `/show/${map[type]}/${item.Key}`

      history.push(href);
      return;
    }

    query('tune', item.Key).then(res => {
      const track = res.data;
      sendRequestToPlayer({ items: [track], track, index: 0 });
    });
  }

  return (
    <div className={classes.root}>

      {
        keys.map((key, i) => (
          <Accordion key={i}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>
                {items[key].label}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>

              <List dense component="nav" aria-label="main mailbox folders">

                {items[key].items?.map(item => <ListItem key={key} onClick={handleListClick(key, item)} button>
                  <ListItemAvatar>
                    <Avatar alt={item.Title} src={item.image} />
                  </ListItemAvatar>
                  <ListItemText primary={item.Title} secondary={item.Artist || `${item.count} tracks`} />
                </ListItem>)}



              </List>


            </AccordionDetails>
            <Divider />


            {items[key].length > 2 && <AccordionActions>
              <Button size="small" color="primary" onClick={handleFindClick(key)}>
                View all {items[key].length} {key}
              </Button>
            </AccordionActions>}

          </Accordion>
        ))
      }
    </div>
  );
}
