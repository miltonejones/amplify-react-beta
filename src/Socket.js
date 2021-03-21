import { Subject } from "rxjs";
import socketIOClient from "socket.io-client";
import { SOCKET_HOST } from './Constants';

let ping, download, status;

const socketResponse$ = new Subject();
const socketResponse = socketResponse$.asObservable();
const connect = () => {
  console.warn('CONNECT WAS CALLED')
  const socket = socketIOClient(SOCKET_HOST);
  socket.on("connect", data => {
    status = !0;
    console.log({ data });
    socketResponse$.next(data);
  });
  socket.on('response', a => socketResponse$.next(a));
  ping = message => socket.emit('ping', { message });
  download = id => socket.emit('download', { id });
}

export {
  ping,
  download,
  status,
  socketResponse,
  connect
}