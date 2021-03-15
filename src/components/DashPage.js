
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
import LinkList from './dash/LinkList';
import Underline from './underline/Underline';
import { NavMenu } from './dash/NavMenu';
import { SongPersistService } from './audio/Persist';

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
    this.props.setHome(true);
  }
  render() {
    const { objects, genreData } = this.state;
    const data = SongPersistService.get();
    const ft_artist = (a) => `${a.trackCount} tracks`;
    const ft_album = (a) => `${a.artistName}, ${a.trackCount} tracks`;
    console.log({ data });
    return (
      <div className="dash-page-grid">
        <Grid container spacing={1}>

          <Grid item xs={12}>
            <Paper className="dash-page-paper artist-carousel-body" >
              <ArtistCarousel objects={objects[0]} />
            </Paper>
          </Grid>

          <Grid item xs={9}>
            <Paper className="dash-page-paper recent-carousel-body" >
              <div className="amplify-card-header"><Icon>schedule</Icon>Recently Added</div>
              <RecentCarousel play={playScalar} objects={objects[2]} />
            </Paper>
          </Grid>

          <Grid item xs={3}>
            <Paper className="dash-page-paper" >
              <div className="amplify-card-header"><Icon>home</Icon><Underline dark={true} innerText="Amplify!" /></div>
              {!genreData?.items ? <b>loading</b> : <NavMenu items={genreData?.items} />}
            </Paper>
            <Paper className="dash-page-paper" >
              <div className="amplify-card-header"><Icon>link</Icon>Quick Links</div>
              <LinkList />
            </Paper>
          </Grid>

          <Grid item xs={9}>
            <Paper className="dash-page-paper" >
              <div className="amplify-card-header"><Icon>playlist_play</Icon>Playlists</div>
              <PlaylistBanners />
            </Paper>
            <Paper className="dash-page-paper" >
              <div className="amplify-card-header"><Icon>music_note</Icon>Recently Played</div>
              <SongList play={playScalar} objects={{ data }} />
            </Paper>
          </Grid>

          <Grid item xs={3}>
            <Paper className="dash-page-paper" >
              <ArtistVertical field="artistImage" type="artist" icon="people" footer={ft_artist} objects={objects[0]} />
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
              <ArtistVertical field="albumImage" type="album" icon="album" footer={ft_album} objects={objects[1]} />
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}
