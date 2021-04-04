import { randomize } from "../util/State"

const ALBUM_TABLE_DEF = {
  name: 'localDbAlbums',
  key: 'ID',
  fields: ['Name', 'artistFk', 'albumImage', 'image', 'artistName', 'trackCount', 'collectionId']
}
const GENRE_TABLE_DEF = {
  name: 'localDbGenres',
  key: 'ID',
  fields: ['Name', 'Count', 'genreImage', 'percent', 'genreKey']
}
const ARTIST_TABLE_DEF = {
  name: 'localDbArtists',
  key: 'ID',
  fields: ['Name', 'albumCount', 'artistImage', 'image', 'imageLg', 'trackCount']
}
const MUSIC_TABLE_DEF = {
  name: 'localDbMusic',
  key: 'ID',
  fields: ['FileKey', 'FileSize', 'Genre', 'Key', 'Size', 'Title', 'albumArtistFk', 'albumArtistName', 'albumFk', 'albumImage',
    'albumName', 'artist', 'artistFk', 'artistName', 'discNumber', 'explicit', 'genreKey', 'trackId', 'trackNumber', 'trackTime']
}

const PLAYLIST_TABLE_DEF = {
  name: 'localDbPlaylist',
  key: 'ID',
  fields: ['Title', 'image', 'listKey', 'related', 'trackCount']
}

const DATA_CONFIG = [
  {
    table: 'localDbMusic',
    type: 'tune',
    text: 'Building music library'
  },
  {
    table: 'localDbAlbums',
    type: 'album',
    text: 'Getting album information'
  },
  {
    table: 'localDbArtists',
    type: 'artist',
    text: 'Getting artist information'
  },
  {
    table: 'localDbGenres',
    type: 'genre',
    text: 'Downloading music categories'
  },
  {
    table: 'localDbPlaylist',
    type: 'playlist',
    text: 'Personalizing your collection'
  },
]


const TABLE_MAP = {
  artist: {
    definition: ARTIST_TABLE_DEF,
    field: {
      source: 'ID',
      destination: 'artistFk'
    }
  },
  album: {
    definition: ALBUM_TABLE_DEF,
    field: {
      source: 'ID',
      destination: 'albumFk'
    }
  },
  genre: {
    definition: GENRE_TABLE_DEF,
    field: {
      source: 'genreKey',
      destination: 'genreKey'
    }
  },
  tune: {
    definition: MUSIC_TABLE_DEF,
    field: {
      source: 'ID',
      destination: 'ID'
    }
  },
  playlist: {
    definition: PLAYLIST_TABLE_DEF,
    field: {
      source: 'ID',
      destination: 'ID'
    }
  }
}

const DASH_DATA_CONFIG = [
  {
    label: 'Top Artists',
    table: 'localDbArtists',
    parse: data => randomize(data.filter(f => f.trackCount > 25)).slice(0, 10)
  },

  {
    label: 'Top Albums',
    table: 'localDbAlbums',
    parse: data => randomize(data.filter(f => f.trackCount > 9)).slice(0, 10)
  },
  {
    label: 'Recently Added',
    table: 'localDbMusic',
    parse: data => randomize(data.filter(f => f.albumImage?.length && !!f.artistFk)).slice(0, 99)
  }
]
const INDEX_NAME = 'react_amplify_local_indexed_psuedo_db';
const DB_VERSION = 1;

export {
  ALBUM_TABLE_DEF,
  GENRE_TABLE_DEF,
  ARTIST_TABLE_DEF,
  MUSIC_TABLE_DEF,
  PLAYLIST_TABLE_DEF,
  TABLE_MAP,
  DATA_CONFIG,
  DASH_DATA_CONFIG,
  DB_VERSION,
  INDEX_NAME
}
