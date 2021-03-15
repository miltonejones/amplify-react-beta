import React, { Component } from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './owl.css';


class ArtistCarousel extends Component {

  render() {
    const artists = this.props.objects;
    console.log({ artists })
    return !artists ? (<b>loading...</b>) : (
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
        {artists?.result?.map(artist => <div className="item carousel-cell" key={artist.ID}>
          <img alt={artist.Name} src={artist.imageLg} />
          <div class="carousel-cell-text">
            <div class="carousel-cell-title">{artist.Name}</div>
            <div class="carousel-cell-artist">{artist.trackCount} tracks in your library</div>
          </div>
        </div>)}
      </OwlCarousel>
    )
  }
}


export {
  ArtistCarousel
}