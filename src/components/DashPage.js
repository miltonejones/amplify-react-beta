
import React from 'react';
import axios from 'axios';
import { APP_NAME, ARTIST_API_ADDRESS } from '../Constants';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { ArtistCarousel } from './dash/ArtistCarousel';
import ArtistVertical from './dash/ArtistVertical';


export default class DashPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objects: []
    };
  }
  loadComponentList() {
    const address = `${ARTIST_API_ADDRESS}search/dashSearch`;
    console.log(address)
    axios.get(address)
      .then(res => {
        const objects = res.data;
        this.setState({ objects })
        console.log({ ...this.state })
      });
  }
  componentDidMount() {
    this.loadComponentList();
  }
  render() {
    const ft_artist = (a) => `${a.trackCount} tracks`;
    const ft_album = (a) => `${a.artistName}, ${a.trackCount} tracks`;
    return (
      <div className="dash-page-grid">
        <Grid container spacing={1}>

          <Grid item xs={12}>
            <Paper className="dash-page-paper" >
              <ArtistCarousel objects={this.state.objects[0]} />
            </Paper>
          </Grid>

          <Grid item xs={9}>
            <Paper className="dash-page-paper" >
              recent carousel
            </Paper>
          </Grid>

          <Grid item xs={3}>
            <Paper className="dash-page-paper" >
              menu + links
            </Paper>
          </Grid>

          <Grid item xs={9}>
            <Paper className="dash-page-paper" >
              playlists + played - HomePlayList.js + HomeSongList.js
            </Paper>
          </Grid>

          <Grid item xs={3}>
            <Paper className="dash-page-paper" >
              <ArtistVertical footer={ft_artist} objects={this.state.objects[0]} />
            </Paper>
          </Grid>


          <Grid item xs={9}>
            <Paper className="dash-page-paper" >
              genres - HomeSongList.js x 2
            </Paper>
          </Grid>

          <Grid item xs={3}>
            <Paper className="dash-page-paper" >
              <ArtistVertical footer={ft_album} objects={this.state.objects[1]} />
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}
