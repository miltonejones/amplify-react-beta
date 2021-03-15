
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { ArtistCarousel, RecentCarousel } from './dash/ArtistCarousel';
import ArtistVertical from './dash/ArtistVertical';
import { getGenreData, query } from '../AmplifyData';
import PlaylistBanners from './dash/PlaylistBanners';
import SongList from './dash/SongList';
import { Icon } from '@material-ui/core';
import { listViewOnClick$ } from '../util/Events';

const playScalar = (track) => () => {
  console.log({ track })
  listViewOnClick$.next({ items: [track], track, index: 0 });
}


export default class DashPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objects: []
    };
  }

  loadComponentList() {
    query('search/dashSearch')
      .then(res => {
        const objects = res.data;
        this.setState({ objects })
        console.log({ ...this.state })
        getGenreData().then(genreData => {
          console.log({ genreData });
          this.setState({
            ...this.state,
            genreData
          })
          console.log(this.state);
        });
      });
  }
  componentDidMount() {
    this.loadComponentList();
  }
  render() {
    const { objects, genreData } = this.state;
    const ft_artist = (a) => `${a.trackCount} tracks`;
    const ft_album = (a) => `${a.artistName}, ${a.trackCount} tracks`;
    return (
      <div className="dash-page-grid">
        <Grid container spacing={1}>

          <Grid item xs={12}>
            <Paper className="dash-page-paper" >
              <ArtistCarousel objects={objects[0]} />
            </Paper>
          </Grid>

          <Grid item xs={9}>
            <Paper className="dash-page-paper" >
              <RecentCarousel objects={objects[2]} />
            </Paper>
          </Grid>

          <Grid item xs={3}>
            <Paper className="dash-page-paper" >
              menu + links
            </Paper>
          </Grid>

          <Grid item xs={9}>
            <Paper className="dash-page-paper" >
              <PlaylistBanners />

            </Paper>
          </Grid>

          <Grid item xs={3}>
            <Paper className="dash-page-paper" >
              <ArtistVertical field="artistImage" icon="people" footer={ft_artist} objects={objects[0]} />
            </Paper>
          </Grid>


          <Grid item xs={9}>
            <Paper className="dash-page-paper" >
              <div className="amplify-card-header"><Icon>local_offer</Icon>{genreData?.genres?.[0]} Songs</div>
              <SongList play={playScalar} objects={genreData?.data?.[0]} />
            </Paper>
            <Paper className="dash-page-paper" >
              <div className="amplify-card-header"><Icon>local_offer</Icon>{genreData?.genres?.[1]} Songs</div>
              <SongList play={playScalar} objects={genreData?.data?.[1]} />
            </Paper>
          </Grid>

          <Grid item xs={3}>
            <Paper className="dash-page-paper" >
              <ArtistVertical field="albumImage" icon="album" footer={ft_album} objects={objects[1]} />
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}
