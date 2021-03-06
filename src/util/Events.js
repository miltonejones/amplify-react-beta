import { Subject } from 'rxjs';
import { sendRequestToPlayer } from '../components/audio/PlayerRequest';

const playbackRequest$ = new Subject();
const openMenuRequest$ = new Subject();
const addQueueRequest$ = new Subject();
const playBegin$ = new Subject();
const playEnd$ = new Subject();

const playbackRequest = playbackRequest$.asObservable();
const openMenuRequest = openMenuRequest$.asObservable();
const addQueueRequest = addQueueRequest$.asObservable();
const playBegin = playBegin$.asObservable();
const playEnd = playEnd$.asObservable();


const playScalar = (track) => () => {
  sendRequestToPlayer({ items: [track], track, index: 0 });
}

export {
  playbackRequest$,
  openMenuRequest$,
  addQueueRequest$,
  addQueueRequest,
  playbackRequest,
  openMenuRequest,
  playBegin$,
  playBegin,
  playEnd,
  playEnd$,
  playScalar
}