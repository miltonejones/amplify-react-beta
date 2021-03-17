
import axios from 'axios';
import { Subject } from 'rxjs';
import { ARTIST_API_ADDRESS } from './Constants';
import { generateKey, randomize } from './util/State';

let PLAYLIST_COLLECTION = [];

const dataStateChange$ = new Subject();
const dataStateChange = dataStateChange$.asObservable();


const endpoint = (type, id) => {
  const address = [`${ARTIST_API_ADDRESS}${type}`];
  if (id) address.push(`id=${id.toString().replace('&', '%26')}`);
  return address.join('?')
}

const search = (param, type) => {
  const address = [`${ARTIST_API_ADDRESS}search?param=${param}`];
  if (type) address.push(`type=${type}`);
  return eventPromise(axios.get(address.join('&')));
}

const eventPromise = (promise) => {
  return new Promise(callback => {
    dataStateChange$.next(false);
    promise.then(res => {
      dataStateChange$.next(true);
      callback(res);
    });
  })
}

const query = (type, id) => {
  return eventPromise(axios.get(endpoint(type, id)));
}

const send = (type, data) => {
  return eventPromise(axios.post(endpoint(type), data));
}

const getGenreData = () => {
  return new Promise(callback => {
    query('genre').then(res => {
      const items = res.data;
      const genres = randomize(items.filter(genre => {
        return genre.Count > 19 && !!genre.genreImage
      })).slice(0, 2).map(genre => genre.genreKey);

      Promise.all(genres.map(q => query('genre', q.replace('&', '%26'))))
        .then(data => {

          data.map(d => {
            return d.data = d.data?.slice(0, 6);
          })
          callback({ genres, data, items })
        })
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
        // playListsUpdated.emit();
        updatePlaylistCollection()
        o(data);
      })
  })
}
function getPlaylistByKey(title, track) {
  return PLAYLIST_COLLECTION.filter(c => c.Title === title || c.listKey === title)[0];
}
function addToPlaylistByKey(title, track) {
  const list = getPlaylistByKey(title, track);
  if (list) return addToPlaylist(list, track)
  return Promise.resolve()
}
function addToPlaylist(list, track) {
  const Key = track.Key;
  const existing = list.related.indexOf(Key) >= 0;
  if (!existing) {
    list.related.push(Key);
    list.related = list.related.filter((f) => f && f.split);
    return saveList(list);
  }
  return removeFromPlaylist(list, track);
}
function removeFromPlaylist(list, track) {
  const existing = list.related.indexOf(track.Key) >= 0;
  if (existing) {
    list.related = list.related.filter((f) => f !== track.Key);
  }
  // speaker.say(`Removing ${track.Title} from ${list.Title}`);
  return saveList(list);
}
function createList(Title, track) {
  return saveList({
    Title,
    related: [track.Key]
  });
}

function getTrackListByKeys(playlist, Keys) {
  return new Promise(callback => {
    send('tune', { Keys })
      .then(res => {

        const related = organize(playlist, res.data);

        callback(related);
      })
  })
}

function getPlaylist(id) {
  return new Promise(callback => {
    query('playlist')
      .then(res => {
        const playlist = res.data?.filter(d => generateKey(d.Title) === id)[0];
        // 
        if (playlist) {
          const Keys = playlist.related.filter(f => !!f);
          // 
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
  search,
  send,
  dataStateChange,
  getGenreData,
  getPlaylist,
  addToPlaylist,
  addToPlaylistByKey,
  compareTrackToLists,
  playListContainsTrack,
  createList,
  removeFromPlaylist,
  PLAYLIST_COLLECTION
}

const updatePlaylistCollection = () => query('playlist').then(res => PLAYLIST_COLLECTION = res.data);
updatePlaylistCollection();