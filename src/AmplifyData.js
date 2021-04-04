
import axios from 'axios';
import { Subject } from 'rxjs';
import { ARTIST_API_ADDRESS } from './Constants';
import { organize, stripExt } from './util/Functions';
import { generateKey, randomize } from './util/State';

let PLAYLIST_COLLECTION = [];

const dataStateChange$ = new Subject();
const dataStateChange = dataStateChange$.asObservable();

const group = (type, keys) => {
  return new Promise(callback => {
    const files = Promise.all(keys.map(id => query(type, id)));
    const id = keys[0];
    const out = [];
    files.then(res => {
      res.map(datum => {
        const { data } = datum;
        out.push(...data.related)
        return data;
      });
      out.map(track => {
        track[`${type}Fk`] = id;
        track[`${type}Name`] = null;
        return track;
      })

      saveTracks(out).then(callback);
    });
  })
}

const commit = (track) => {
  return new Promise(callback => {
    const up = Object.assign({}, track);
    up.albumName = up.artistName = up.artist = null;
    save(up).then(callback);
  })
}

const endpoint = (type, id) => {
  const address = [`${ARTIST_API_ADDRESS}${type}`];
  if (id) address.push(`id=${id.toString().replace('&', '%26')}`);
  return address.join('?')
}

const apple = (title, artist) => {
  const qs = ['Title=' + title.replace(/\.[^.]{3}/, ''), 'info=yes'];
  if (artist?.length) {
    qs.push(`artist=${artist}`);
  }
  const address = `${ARTIST_API_ADDRESS}tune?${qs.join('&')}`;
  return eventPromise(axios.get(address));
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

const save = (track) => {
  return eventPromise(axios.post(endpoint('tune'), track));
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

const saveList = (list) => {
  return new Promise(o => {
    eventPromise(axios.post(ARTIST_API_ADDRESS + 'playlist', list))
      .then(data => {
        updatePlaylistCollection().then(() => o(data));
      })
  })
}
const getPlaylistByKey = (title, track) => {
  return PLAYLIST_COLLECTION.filter(c => c.Title === title || c.listKey === title)[0];
}
const addToPlaylistByKey = (title, track) => {
  const list = getPlaylistByKey(title, track);
  if (list) return addToPlaylist(list, track)
  return Promise.resolve()
}
const addToPlaylist = (list, track) => {
  const Key = track.Key;
  const existing = list.related.indexOf(Key) >= 0;
  if (!existing) {
    list.related.push(Key);
    list.related = list.related.filter((f) => f && f.split);
    return saveList(list);
  }
  return removeFromPlaylist(list, track);
}
const removeFromPlaylist = (list, track) => {
  const existing = list.related.indexOf(track.Key) >= 0;
  if (existing) {
    list.related = list.related.filter((f) => f !== track.Key);
  }
  return saveList(list);
}
const createList = (Title, track) => {
  return saveList({
    Title,
    related: [track.Key]
  });
}

const getTrackListByKeys = (playlist, Keys) => {
  return new Promise(callback => {

    send('tune', { Keys })
      .then(res => {

        const related = organize(playlist, res.data);

        callback(related);
      })
  })
}

const getPlaylist = (id) => {
  return new Promise(callback => {

    query('playlist')
      .then(res => {
        const playlist = (res.data || res).filter(d => generateKey(d.Title) === id)[0];

        if (playlist) {
          const Keys = playlist.related.filter(f => !!f);

          getTrackListByKeys(playlist, Keys)
            .then(response => {
              console.log({ response });
              callback(response)
            })
        }
      });
  })
}

const compareTrackToLists = (track) => {
  if (PLAYLIST_COLLECTION) {
    const playlists = PLAYLIST_COLLECTION
      .filter((list) => playListContainsTrack(track, list));
    return playlists.length;
  }

  return 0;
}

const playListContainsTrack = (audioTrack, list) => {
  if (audioTrack?.Key) {
    const count = list.related.filter((f) =>
      stripExt(f) === stripExt(audioTrack.Key)
    ).length
    return count > 0;
  }
  return false;
}
/**  ["Nina Simone/Little Girl Blue/Disc 1 - 04 - Little Girl Blue.ogg.mp3", "Nina Simone", 
 * "Little Girl Blue", 
 * "1",
 *  "04", "Little Girl Blue.ogg", index: 0, input: "Nina Simone/Little Girl Blue/Disc 1 - 04 - Little Girl Blue.ogg.mp3", groups: undefined]
 * 
*/
const ParsedInfo = (str) => {
  const regex = /([^/]+)\/([^/]+)\/Disc (\d+)[^0-9]+(\d+)\s-\s([^/]+)\.[^.]{3}/.exec(str);
  const field = ['value', 'artistName', 'albumName', 'discNumber', 'trackNumber', 'Title']
  const obj = {};
  if (regex) {
    field.map((name, i) => obj[name] = regex[i].replace(/\.[^.]{3}/, ''))
  }
  return obj;
}
const saveTracks = (tracks) => {
  return new Promise(callback => {
    const next = () => {
      if (!tracks.length) return callback();
      commit(tracks.pop()).then(next);
    }
    next();
  })
}
export {
  endpoint,
  query,
  search,
  commit,
  saveTracks,
  group,
  send,
  save,
  apple,
  ParsedInfo,
  getGenreData,
  getPlaylist,
  addToPlaylist,
  addToPlaylistByKey,
  compareTrackToLists,
  playListContainsTrack,
  createList,
  removeFromPlaylist,
  dataStateChange,
  PLAYLIST_COLLECTION
}

const updatePlaylistCollection = () => {
  return new Promise(cb => {
    query('playlist').then(res => cb(PLAYLIST_COLLECTION = res.data));
  })
}
updatePlaylistCollection().then(console.log);