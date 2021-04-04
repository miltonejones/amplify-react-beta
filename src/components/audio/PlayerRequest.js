import { playbackRequest$ } from "../../util/Events";
import { Analyser } from "./AudioAnalyser";

const CONFIRM_MESSAGE = `The equalizer needs permission to access your system. 
                          Click here to grant permission.`;

const sendRequestToPlayer = (request) => {
  if (Analyser.context.state !== 'running') {
    const kool = window.confirm(CONFIRM_MESSAGE);
    if (kool) {
      Analyser.context.resume();
    }
  }
  playbackRequest$.next(request);
}

export {
  sendRequestToPlayer
}