class SongPersistService$ {
  limit = 1000000;
  session = [];
  add(track) {
    const setting = this.get().filter((old) => old.ID !== track.ID);
    setting.push(track);
    this.set(setting);
    console.warn(`Added ${track.Title} to cache:`);
  }
  trim(setting) {
    let size = JSON.stringify(setting).length;
    while (size > this.limit) {
      setting.shift();
      size = JSON.stringify(setting).length;
    }
    return setting;
  }
  set(setting) {
    try {
      localStorage["recentPlayed"] = JSON.stringify(setting);
    } catch (e) {
      console.log("Unable to save", { setting });
    }
  }
  clear() {
    localStorage["recentPlayed"] = [];
  }
  get() {
    try {
      return JSON.parse(localStorage["recentPlayed"] || "[]");
    } catch (e) {
      return [];
    }
  }
}
const SongPersistService = new SongPersistService$();
export { SongPersistService };
