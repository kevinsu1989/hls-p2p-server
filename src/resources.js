
export default class Resources {

    getResource(resource, peer_res, res_peer){
        // console.log(1);
        if(res_peer[resource])
            return res_peer[resource].slice(0, 3);
        else
            return [];
    }

}