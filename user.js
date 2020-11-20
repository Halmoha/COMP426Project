const user_data = require('data-store')({ path: process.cwd() + '/data/user.json' });

class User {

    constructor(id, name, password, playlist){
        this.id = id;
        this.name = name;
        this.password = password;
        this.playlist = playlist;
    }

    update(){
        user_data.set(this.id.toString(), this);
    }

    delete(){
        user_data.del(this.id.toString());
    }
}

User.getAllIDs = () =>{
    //Returns array of all users
    return Object.keys(user_data.data).map((id => {return parseInt(id);}));
}

User.findByID = (id) => {
    let udata = user_data.get(id);
    if (udata == null){
        return null;
    }
    return new User(udata.id, udata.name, udata.password, udata.playlist);
}

User.create = (name, password, playlist) =>{
    let id = User.getAllIDs().reduce((max, next_id) => {
        if (max < next_id){
            return next_id;
        }
        return max;
    }, -1) + 1;
    let u = new User(id, name, password, playlist);
    user_data.set(u.id.toString(), u);
    return u;
}

module.exports = User;