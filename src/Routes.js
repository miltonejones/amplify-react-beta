export const appRoutes = [

  /**HOME PAGE */
  {
    path: 'Home.html',
    data: {
      label: 'Home',
      icon: 'home',
      prefix: '/main/',
      cover: ['Home.html', 'cover']
    }
  },
  {
    path: 'Home.html/:cover',

  },

  /**LIBRARY PAGE */
  {
    path: 'Library.html',
    data: {
      label: 'Library',
      icon: 'music_note',
      prefix: '/show/',
      home: true,
      cover: ['Library.html', 'cover']
    }
  },
  {
    path: 'Library.html/:cover',

  },
  {
    path: 'Songs.html/:searchParam',

  },
  {
    path: 'Songs.html/:searchParam/:cover',

  },

  /**ARTIST PAGE */
  {
    path: 'Artist.html',
    data: {
      label: 'Artists',
      icon: 'people',
      prefix: '/list/',
      home: true,
      cover: ['Artist_cover.html', 'cover']
    }
  },
  {
    path: 'Artist_cover.html/:cover',

  },
  {
    path: 'Artist.html/:detailId',

  },
  {
    path: 'Artists.html/:searchParam',

  },
  {
    path: 'Artist.html/:detailId/:cover',

  },
  {
    path: 'Artists.html/:searchParam/:cover',

  },

  /**ALBUM PAGE */
  {
    path: 'Album.html',
    data: {
      label: 'Albums',
      icon: 'album',
      prefix: '/list/',
      home: true,
      cover: ['Album_cover.html', 'cover']
    }
  },
  {
    path: 'Album_cover.html/:cover',

  },
  {
    path: 'Album.html/:detailId',

  },
  {
    path: 'Albums.html/:searchParam',

  },
  {
    path: 'Album.html/:detailId/:cover',

  },
  {
    path: 'Albums.html/:searchParam/:cover',

  },

  /**GENRE PAGE */
  {
    path: 'Genre.html',
    data: {
      label: 'Genres',
      icon: 'local_offer',
      prefix: '/list/',
      cover: ['Genre_cover.html', 'cover']
    }
  },
  {
    path: 'Genre_cover.html/:cover',

  },
  {
    path: 'Genre.html/:detailId',

  },
  {
    path: 'Genre.html/:detailId/:cover',

  },

  /**PLAYLIST PAGE */
  {
    path: 'Playlist.html',

    data: {
      label: 'Playlists',
      icon: 'playlist_add_check',
      prefix: '/list/',
      home: true,
      cover: ['Playlist_cover.html', 'cover']
    }
  },
];


export default appRoutes;