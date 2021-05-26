import { CLOUD_FRONT_URL } from "../Constants";

const stripExt = (value) => {
  if (!(value && value.replace)) {
    return "";
  }
  const stripped = value.replace(/(\.mp3|\.opus|\.ogg)/g, "");
  if (stripped) {
    return stripped;
  }
  return value;
};

const organize = (list, tracks) => {
  const output = [];
  list.related?.map((track, i) => {
    const found = tracks.filter(
      (f) => stripExt(f.FileKey) === stripExt(track)
    )[0];
    if (found) {
      const exist = output.filter((o) => o.FileKey === found.FileKey)[0];
      if (exist) {
        return null;
      }
      found.trackNumber = i + 1;
      output.push(found);
    }
    return found;
  });
  return output;
};

const download = (i) => {
  console.log({ i });
  return new Promise((f) => {
    var c = new XMLHttpRequest();
    c.open("GET", i);
    c.responseType = "arraybuffer";
    //c.onprogress=function(e){var perc=Math.round((e.loaded/e.total)*100)+' of 100'};
    c.onload = function (e) {
      var u8 = new Uint8Array(this.response),
        ic = u8.length,
        bs = [];
      while (ic--) {
        bs[ic] = String.fromCharCode(u8[ic]);
      }
      f("data:audio/mpeg;base64," + btoa(bs.join("")));
    };
    c.send();
  });
};

function play(FileKey) {
  const audioURL = `${CLOUD_FRONT_URL}${FileKey}`
    .replace("#", "%23")
    .replace(/\+/g, "%2B");
  return audioURL;
}

export { organize, stripExt, download, play };
