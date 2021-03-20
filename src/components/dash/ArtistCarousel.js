import React, { Component } from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './owl.css';
import { playbackRequest$ } from '../../util/Events';
import { query } from '../../AmplifyData';
import { sortObjects } from '../../util/State';
import { LinearProgress, Typography } from '@material-ui/core';
import { HtmlTooltip } from '../HtmlTooltip';


const downloadCollection = (type, id) => () => {
  query(type, id).then(res => {
    const data = res.data;

    const items = sortObjects(data.related, type);
    const index = 0;
    const track = items[index];

    playbackRequest$.next({ items, track, index });
  })
}


class ArtistCarousel extends Component {

  render() {
    const { objects } = this.props;
    return !objects ? (<LinearProgress />) : (
      <OwlCarousel className='owl-theme'
        autoplay={true}
        dots={false}
        autoplaySpeed={2000}
        autoplayTimeout={9000}
        autoplayHoverPause={true}
        center={true}
        loop
        navSpeed={700}
        nav
        stagePadding={4}
        navText={['<span class="nav-text material-icons">chevron_left</span>', '<span class="nav-text material-icons">chevron_right</span>']}
        items={2}
        margin={2} >
        {objects?.result?.map(artist => <div onClick={downloadCollection('artist', artist.ID)} className="item carousel-cell" key={artist.ID}>
          <img alt={artist.Name} src={artist.imageLg} />
          <div className="carousel-cell-text">
            <div className="carousel-cell-title no-wrap">{artist.Name}</div>
            <div className="carousel-cell-artist">{artist.trackCount} tracks in your library</div>
          </div>
        </div>)}
      </OwlCarousel>
    )
  }
}



class RecentCarousel extends Component {

  render() {
    const { objects, play, open } = this.props;
    return !objects ? (<LinearProgress />) : (
      <OwlCarousel className='owl-theme'
        dots={false}
        center={false}
        navSpeed={200}
        nav
        slideBy={4}
        stagePadding={4}
        navText={['<span class="nav-text material-icons">chevron_left</span>', '<span class="nav-text material-icons">chevron_right</span>']}
        items={4}
        margin={2} >
        {objects?.result?.map(artist => <div className="item carousel-cell-recent" key={artist.ID}>
          <HtmlTooltip
            title={
              <React.Fragment>
                <Typography color="inherit">{artist.Title}</Typography>
                <em>artist</em> <b>{artist.artistName}</b>
              </React.Fragment>
            }
          >
            <img className={open ? 'open' : ''} onClick={play(artist)} alt={artist.Title} src={artist.albumImage} />
          </HtmlTooltip>


          <div className="carousel-cell-text">
            <div className="carousel-cell-title no-wrap">{artist.Title}</div>
            <div className="carousel-cell-artist">{artist.artistName}</div>
          </div>
        </div>)}
      </OwlCarousel>
    )
  }
}


export {
  ArtistCarousel,
  RecentCarousel
}