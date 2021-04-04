function curateDisc(trackList, ascending) {
  console.log({ trackList, ascending })
  const action = trackNumberSort(ascending);
  uniqueList(trackList);
  const result = collateMultiDisc(trackList.sort(action));
  console.log(result)
  return result;
}

const trackNumberSort = (ascending) => (a, b) => {
  const ltValue = a.trackNumber;
  const rtValue = b.trackNumber;
  const ldValue = a.discNumber || 1;
  const rdValue = b.discNumber || 1;
  const ret = (ldValue - rdValue || ltValue - rtValue) * -ascending;
  return ret;
};

function uniqueList(trackList) {
  if (trackList) {
    trackList.map((track) => {
      const dupes = trackList.filter((dupe) => {
        return (dupe.trackNumber === track.trackNumber &&
          (!dupe.discNumber || (dupe.discNumber === track.discNumber))) && dupe.ID > track.ID;
      });
      dupes.map((track) => track.duplicate = !!track.discNumber);
    });
    return trackList;
  }
  return [];
}

function collateMultiDisc(resultList) {
  if (resultList && resultList.filter((m) => m.discNumber !== undefined && m.discNumber > 1).length) {
    let disc = 0;
    const tracks = [];
    resultList.filter((f) => !f.label).map((track, i) => {
      if (track.discNumber !== disc) {
        disc = track.discNumber;
        tracks.push({
          ID: -i,
          Title: `Disc ${disc}`,
          label: true,
          discNumber: disc,
          active: !1,
          artistName: '',
          albumName: '',
          Genre: ''
        });
      }
      tracks.push(track);
    });
    tracks.map((f) => {
      if (f.label) {
        f.missing = tracks.filter((i) => i.discNumber == f.discNumber && !i.label && !i.missing).length == 0;
      }
    });
    return tracks;
  }
  return resultList;
}

function generateSortFunction(fieldName, isStr = !1) {
  return (ascending) => (a, b) => {
    try {
      const ltValue = !isStr ? a[fieldName] : a[fieldName].toLowerCase();
      const rtValue = !isStr ? b[fieldName] : b[fieldName].toLowerCase();
      return ltValue < rtValue ? ascending : -ascending;
    } catch (e) {
      return 1;
    }

  };
}

function generateKey(Title) {
  if (!(Title && Title.replace)) {
    return '';
  }
  return Title.replace(/[\.\s-\/]/g, '').toLowerCase().trim().replace('the', '');
}

export {
  curateDisc
}