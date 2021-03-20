function AppleConvert(itunes) {
  return {
    Title: itunes.trackName,
    ID: itunes.trackId,
    trackId: itunes.trackId,
    albumName: itunes.collectionName,
    FileKey: itunes.previewUrl,
    Key: itunes.previewUrl,
    albumImage: itunes.artworkUrl100,
    Genre: itunes.primaryGenreName,
    genreKey: itunes.primaryGenreName,
    discNumber: itunes.discNumber,
    trackTime: itunes.trackTimeMillis,
    trackNumber: itunes.trackNumber,
    artist: itunes.artistName,
    albumArtistName: itunes.artistName,
    artistName: itunes.artistName,

    Size: 0,
    albumFk: 0,
    albumArtistFk: 0,
    artistFk: 0,
    FileSize: 0,
    explicit: false,
  };
}

export {
  AppleConvert
}
