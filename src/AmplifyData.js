import axios from 'axios';
import { ARTIST_API_ADDRESS } from './Constants';
import { randomize } from './util/State';

const endpoint = (type, id) => {
  const address = [`${ARTIST_API_ADDRESS}${type}`];
  if (id) address.push(`id=${id}`);
  return address.join('?')
}

const query = (type, id) => {
  return axios.get(endpoint(type, id));
}

const send = (type, data) => {
  return axios.post(endpoint(type), data);
}

const getGenreData = () => {
  return new Promise(callback => {
    query('genre').then(res => {
      const genres = randomize(res.data.filter(genre => {
        return genre.Count > 19 && !!genre.genreImage
      })).slice(0, 2).map(genre => genre.genreKey);
      console.log({ genres })
      Promise.all(genres.map(q => query('genre', q.replace('&', ''))))
        .then(data => callback({ genres, data }))
    });
  })
}


export {
  endpoint,
  query,
  send,
  getGenreData
}