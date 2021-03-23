
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { ArtistCarousel, RecentCarousel } from './dash/ArtistCarousel';
import ArtistVertical from './dash/ArtistVertical';
import { getGenreData, query } from '../AmplifyData';
import PlaylistBanners from './dash/PlaylistBanners';
import SongList from './dash/SongList';
import { Icon } from '@material-ui/core';
import { playScalar } from '../util/Events';
import LinkList from './dash/LinkList';
import Underline from './underline/Underline';
import { NavMenu } from './dash/NavMenu';
import { SongPersistService } from './audio/Persist';
import { Link } from 'react-router-dom';
import { DesktopOnly, DynamicGrid } from '../util/MediaQueries';

const SeeAllLink = (props) => {
  return <div style={{ float: 'right' }}><Link className='see-all-link' {...props}>See All <Icon>chevron_right</Icon></Link></div>
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

        getGenreData().then(genreData => {

          this.setState({
            ...this.state,
            genreData
          })

        });
      });
  }
  componentDidMount() {
    this.loadComponentList();
    this.props.setHome(true);
  }
  render() {
    const { objects, genreData } = this.state;
    const { open, mobile } = this.props;
    const memory = SongPersistService.get();
    const ft_artist = (a) => `${a.trackCount} tracks`;
    const ft_album = (a) => `${a.artistName}, ${a.trackCount} tracks`;
    let className = ['dash-page-grid'];
    if (open) className.push('open');
    className = className.join(' ');
    return (
      <div className={className}>
        <Grid container spacing={1}>


          <Grid item xs={12} sm={12}>
            <Paper className="dash-page-paper artist-carousel-body" >
              <ArtistCarousel objects={objects[0]} />
            </Paper>
          </Grid>

          <DesktopOnly content={
            <DynamicGrid size={8} content={
              <Paper className="dash-page-paper recent-carousel-body" >
                <div className="amplify-card-header"><Icon>schedule</Icon>Recently Added
              <SeeAllLink to="/show/Library.html" />
                </div>
                <RecentCarousel open={open} play={playScalar} objects={objects[2]} />
              </Paper>
            } />
          } />


          <DynamicGrid size={4} content={
            <div>
              <Paper className="dash-page-paper" >
                <div className="amplify-card-header"><Icon>home</Icon><Underline dark={true} innerText="Amplify!" /></div>
                {!genreData?.items ? <b>Please wait...</b> : <NavMenu items={genreData?.items} />}
              </Paper>
              <Paper className="dash-page-paper" >
                <div className="amplify-card-header"><Icon>link</Icon>Quick Links</div>
                <LinkList />
              </Paper>
            </div>
          } />

          <DynamicGrid size={8} content={
            <div>
              <Paper className="dash-page-paper" >
                <div className="amplify-card-header"><Icon>playlist_play</Icon>Playlists
              <SeeAllLink to="/list/Playlist.html" />
                </div>
                <PlaylistBanners mobile={mobile} />
              </Paper>
              {!!memory?.length && (<Paper className="dash-page-paper" >
                <div className="amplify-card-header"><Icon>music_note</Icon>Recently Played
              <SeeAllLink to="/recent/Recent.html" />
                </div>
                <SongList play={playScalar} objects={{ data: memory }} />
              </Paper>)}
            </div>
          } />

          <DynamicGrid size={4} content={
            <Paper className="dash-page-paper" >
              <ArtistVertical field="artistImage" type="artist" icon="people" footer={ft_artist} objects={objects[0]} />
            </Paper>
          } />

          <DynamicGrid size={8} content={genreData?.genres?.map((genre, index) => (
            <Paper className="dash-page-paper" key={index}>
              <div className="amplify-card-header"><Icon>local_offer</Icon>{genre} Songs
              <SeeAllLink to={'/show/Genre.html/' + genre} />
              </div>
              <SongList play={playScalar} objects={genreData?.data?.[index]} />
            </Paper>
          ))
          } />


          <DynamicGrid size={4} content={
            <Paper className="dash-page-paper" >
              <ArtistVertical field="albumImage" type="album" icon="album" footer={ft_album} objects={objects[1]} />
            </Paper>
          } />

        </Grid>
      </div>
    )
  }
}
