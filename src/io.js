import { without } from 'lodash'
import Resources from './resources'
const _resources = new Resources()


//资源情况
const peer_res = {};
const res_peer = {};
const peer_online = {};
const resType = {
    cdn: 0,
    p2p: 0
}

export default io => {
    io.on('connection', socket => {

        socket.on('join', room => {
            //加入房间  用来区分不同资源
            socket.join(room, () => {

                io.to(room).clients((err, clients) => {
                    // let othersInroom = _without(clients, socket.id);
                    //返回已加入房间通知
                    console.log(clients);
                    socket.emit('ready', {
                        success: true
                    });
                    //告诉其他人有个新boy加入了
                    // socket.broadcast.emit('addSeed', {
                    //     id: socket.id,
                    //     parts: parts[socket.id] || []
                    // });
                });

                //提交资源
                socket.on('addPart', resource, type => {
                    if(type === 1){
                        resType.p2p++;
                    }else{
                        resType.cdn++;
                    }


                    peer_res[socket.id] = peer_res[socket.id] || [];

                    res_peer[resource] = res_peer[resource] || [];

                    if (peer_res[socket.id] && peer_res[socket.id].indexOf(resource) >= 0) return;

                    if (res_peer[resource] && res_peer[resource].indexOf(socket.id) >= 0) return;

                    peer_res[socket.id].push(resource);

  
                    // 优先调用新资源，所以从头部插入
                    res_peer[resource] = [].concat(socket.id, res_peer[resource]);


                    // console.log(res_peer);
                    // console.log(peer_res);
                    // socket.broadcast.emit('updatePart', socket.id, part);
                });

                //失联
                socket.on('disconnect', () => {
                    if(peer_res[socket.id] && peer_res[socket.id].length > 0)
                        peer_res[socket.id].forEach(function(res) {
                            res_peer[res].splice(res_peer[res].indexOf(res), 1);
                        }, this);
                    delete peer_res[socket.id];
                    // socket.broadcast.emit('removeSeed', socket.id);
                });


                socket.on('getPeer', part => {
                    let peer = {
                        part: part,
                        resources: without(_resources.getResource(part, peer_res, res_peer), socket.id)
                    };
                    // console.log(socket);
                    console.log(peer);
                    socket.emit('returnPeer', peer);
                });
            });
        });


        //signaling 一部分
        socket.on('sendCandidate', (id, candidate) => {
            socket.to(id).emit('receiveCandidate', socket.id, candidate);
        });
        //signaling 一部分
        socket.on('sendOffer', (id, offer) => {
            socket.to(id).emit('receiveOffer', socket.id, offer);
        })
        //signaling 一部分
        socket.on('sendAnswer', (id, answer) => {
            socket.to(id).emit('receiveAnswer', socket.id, answer);
        })
    })
}