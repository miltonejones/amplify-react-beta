import { generateKey, randomize } from "../util/State";
import { LocalDb } from "./LocalDb";
import { getGenreData, getPlaylist, query, save } from "../AmplifyData";
import {
  ALBUM_TABLE_DEF,
  ARTIST_TABLE_DEF,
  DASH_DATA_CONFIG,
  GENRE_TABLE_DEF,
  MUSIC_TABLE_DEF,
  PLAYLIST_TABLE_DEF,
  TABLE_MAP,
  DB_VERSION,
  INDEX_NAME,
} from "./ObjectConf";
import { download, organize, play } from "../util/Functions";

const COOKIE_NAME = "js-local-api-read-mode";
const READ_MODE = {
  LOCAL: "LOCAL",
  REMOTE: "REMOTE",
};
class LocalApi$ {
  Mode = READ_MODE.REMOTE;
  constructor() {
    LocalDb.init(
      [
        ALBUM_TABLE_DEF,
        ARTIST_TABLE_DEF,
        MUSIC_TABLE_DEF,
        GENRE_TABLE_DEF,
        PLAYLIST_TABLE_DEF,
      ],
      INDEX_NAME,
      DB_VERSION
    );
    !!localStorage[COOKIE_NAME] && (this.Mode = localStorage[COOKIE_NAME]);
    console.log({ Mode: this.Mode, local: localStorage[COOKIE_NAME] });
  }
  on() {
    return this.Mode === READ_MODE.LOCAL;
  }
  swap() {
    const mode =
      this.Mode === READ_MODE.REMOTE ? READ_MODE.LOCAL : READ_MODE.REMOTE;
    this.Mode = mode;
    localStorage[COOKIE_NAME] = mode;
    console.log({ Mode: localStorage[COOKIE_NAME] });
  }
  query(path) {
    const request = parsePath(path);
    if (request) {
      return this.Mode === READ_MODE.REMOTE
        ? query(request.type, request.id)
        : this.getObjectfromLocalDb(request.type, request.id);
    }
    return Promise.reject("Could not parse path!");
  }

  get(type) {
    if (this.Mode === READ_MODE.REMOTE) {
      return query(type);
    }
    const config = TABLE_MAP[type];
    const indexName = config?.definition?.name;
    return LocalDb.select(indexName);
  }

  validateIdentifier(type, id) {
    return new Promise((callback) => {
      if (type === "genre" && isNaN(id)) {
        return LocalDb.select(
          TABLE_MAP.genre.definition.name,
          (row) => row.genreKey === id,
          ["ID"]
        ).then((row) => callback(row[0].ID));
      }
      callback(id);
    });
  }

  async cache(track) {
    const text = track.FileKey;
    const url = play(text);
    track.cache = await download(url);
    return LocalDb.update(
      TABLE_MAP.tune.definition.name,
      (row) => row.ID === track.ID,
      track
    );
  }

  save(track) {
    return LocalDb.update(
      TABLE_MAP.tune.definition.name,
      (row) => row.ID === track.ID,
      track
    ).then(() => save(track));
  }

  getObjectfromLocalDb(type, id) {
    return this.validateIdentifier(type, id).then((ID) => {
      return this.getObjectfromLocalDbAfterValidation(type, ID);
    });
  }

  async count() {
    return LocalDb.tally(TABLE_MAP.genre.definition.name);
  }

  async getPlaylist(id) {
    if (this.Mode === READ_MODE.REMOTE) {
      return getPlaylist(id);
    }
    const res = await this.get("playlist");
    const playlist = (res.data || res).filter(
      (d) => generateKey(d.Title) === id
    )[0];
    if (playlist) {
      const Keys = playlist.related.filter((f) => !!f);
      const response = await this.getTrackListByKeys(Keys);
      const related = organize(playlist, response);
      return related;
    }
    return;
  }

  getObjectfromLocalDbAfterValidation(type, id) {
    return new Promise((callback) => {
      const config = TABLE_MAP[type];
      const indexName = config?.definition?.name;
      return LocalDb.scalar(indexName, id).then((data) => {
        LocalDb.select(TABLE_MAP.tune.definition.name, (song) => {
          return song[config.field.destination] === data[config.field.source];
        }).then((related) => {
          data.related = related;
          callback({ data });
        });
      });
    });
  }

  // application specific methods (MOVE TO API CLASS)
  getTrackListByKeys(Keys) {
    return new Promise((callback) => {
      return this.get("tune").then((songs) => {
        const out = Keys.map((key) => {
          return songs.filter((song) => song.Key === key)[0];
        }).filter((f) => !!f);
        callback(out);
      });
    });
  }

  getDashData() {
    if (this.Mode === READ_MODE.REMOTE) {
      return query("search/dashSearch");
    }
    const config = DASH_DATA_CONFIG.slice(0);
    return new Promise((callback) => {
      const out = [];
      const run = () => {
        if (!config.length) {
          return callback(out);
        }
        const cfg = config.shift();
        return LocalDb.select(cfg.table)
          .then((data) => {
            data.map((d, i) => (d.ID = d.ID || i));

            out.push(Object.assign(cfg, { result: cfg.parse(data) }));
            return run();
          })
          .catch(console.log);
      };
      run();
    });
  }

  getGenreData() {
    if (this.Mode === READ_MODE.REMOTE) {
      return getGenreData();
    }
    return new Promise((callback) => {
      return LocalDb.select(TABLE_MAP.genre.definition.name).then((items) => {
        const genres = randomize(
          items.filter((genre) => {
            return genre.Count > 19 && !!genre.genreImage;
          })
        )
          .slice(0, 2)
          .map((genre) => genre.genreKey);
        // callback({ genres })
        const data = [];
        LocalDb.select(TABLE_MAP.tune.definition.name).then((tunes) => {
          genres.map((genre) => {
            data[data.length] = {
              data: randomize(tunes.filter((f) => f.genreKey === genre)).slice(
                0,
                6
              ),
            };
          });
          callback({ data, genres, items });
        });
      });
    });
  }
}

const LocalApi = new LocalApi$();

export { LocalApi, READ_MODE };

const parsePath = (path) => {
  const regex = /(\w+)\/(\w+)/.exec(path);
  if (regex) {
    return {
      type: regex[1],
      id: regex[2],
    };
  }
};
