import React, { Component } from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './owl.css';
import { listViewOnClick$ } from '../../util/Events';
import { query } from '../../AmplifyData';
import { sortObjects } from '../../util/State';

const downloadCollection = (type, id) => () => {
  query(type, id).then(res => {
    const data = res.data;
    console.log(data.related)
    const items = sortObjects(data.related, type);
    const index = 0;
    const track = items[index];
    console.log({ items, track, index });
    listViewOnClick$.next({ items, track, index });
  })
}


class ArtistCarousel extends Component {

  render() {
    const { objects } = this.props;
    return !objects ? (<b>loading...</b>) : (
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
            <div className="carousel-cell-title">{artist.Name}</div>
            <div className="carousel-cell-artist">{artist.trackCount} tracks in your library</div>
          </div>
        </div>)}
      </OwlCarousel>
    )
  }
}



class RecentCarousel extends Component {

  render() {
    const { objects, play } = this.props;
    return !objects ? (<b>loading...</b>) : (
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
          <img onClick={play(artist)} alt={artist.Title} src={artist.albumImage} />
          <div className="carousel-cell-text">
            <div className="carousel-cell-title">{artist.Title}</div>
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