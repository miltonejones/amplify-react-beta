import axios from 'axios';
import { ARTIST_API_ADDRESS } from './Constants';
import { generateKey, randomize } from './util/State';

let PLAYLIST_COLLECTION = [];

const endpoint = (type, id) => {
  const address = [`${ARTIST_API_ADDRESS}${type}`];
  if (id) address.push(`id=${id.toString().replace('&', '%26')}`);
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
      const items = res.data;
      const genres = randomize(items.filter(genre => {
        return genre.Count > 19 && !!genre.genreImage
      })).slice(0, 2).map(genre => genre.genreKey);
      console.log({ items })
      Promise.all(genres.map(q => query('genre', q.replace('&', '%26'))))
        .then(data => callback({ genres, data, items }))
    });
  })
}


function organize(list, tracks) {
  const output = [];
  list.related?.map((track, i) => {
    const found = tracks.filter(f => stripExt(f.FileKey) === stripExt(track))[0];
    if (found) {
      const exist = output.filter(o => o.FileKey === found.FileKey)[0];
      if (exist) {
        return null;
      }
      found.trackNumber = i + 1;
      output.push(found);
    }
    return found;
  });
  return output;
}

function stripExt(value) {
  if (!(value && value.replace)) {
    return '';
  }
  const stripped = value.replace(/(\.mp3|\.opus|\.ogg)/g, '');
  if (stripped) {
    return stripped;
  }
  return value;
}

function saveList(list) {
  return new Promise(o => {
    axios.post(ARTIST_API_ADDRESS + 'playlist', list)
      .then(data => {
        // this.playListsUpdated.emit();
        updatePlaylistCollection()
        o(data);
      })
  })
}
function addToPlaylistByKey(title, track) {
  const list = PLAYLIST_COLLECTION.filter(c => c.Title === title)[0];
  if (list) addToPlaylist(list, track)
}
function addToPlaylist(list, track) {
  const Key = track.Key;
  const existing = list.related.indexOf(Key) >= 0;
  if (!existing) {
    list.related.push(Key);
    list.related = list.related.filter((f) => f && f.split);
  }
  return saveList(list);
}


function getTrackListByKeys(playlist, Keys) {
  return new Promise(callback => {
    send('tune', { Keys })
      .then(res => {
        console.log({ res })
        const related = organize(playlist, res.data);
        console.log({ related })
        callback(related);
      })
  })
}

function getPlaylist(id) {
  return new Promise(callback => {
    query('playlist')
      .then(res => {
        const playlist = res.data?.filter(d => generateKey(d.Title) === id)[0];
        // console.log({ playlist })
        if (playlist) {
          const Keys = playlist.related.filter(f => !!f);
          // console.log({ Keys })
          getTrackListByKeys(playlist, Keys)
            .then(callback)
        }
      });
  })
}

function compareTrackToLists(track) {
  if (PLAYLIST_COLLECTION) {
    const playlists = PLAYLIST_COLLECTION
      .filter((list) => playListContainsTrack(track, list));
    return playlists.length;
  }
  console.log('NO LISTS')
  return 0;
}

function playListContainsTrack(audioTrack, list) {
  if (audioTrack?.Key) {
    const count = list.related.filter((f) =>
      stripExt(f) === stripExt(audioTrack.Key)
    ).length
    return count > 0;
  }
  return false;
}

export {
  endpoint,
  query,
  send,
  getGenreData,
  getPlaylist,
  addToPlaylist,
  addToPlaylistByKey,
  compareTrackToLists,
  playListContainsTrack,
  PLAYLIST_COLLECTION
}

const updatePlaylistCollection = () => query('playlist').then(res => PLAYLIST_COLLECTION = res.data);
updatePlaylistCollection()