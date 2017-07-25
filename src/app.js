import _io from 'socket.io'
import _express from 'express'
import _http from 'http'
import _useIO from './io'
import { _join } from 'path'
// import _config from '../config'


// Express
const app = _express();

// Server
const _server = _http.createServer(app);

// IO
const socket = _io(_server);

_useIO(socket);


_server.listen(8000, () => {
    console.log('server is run');
})