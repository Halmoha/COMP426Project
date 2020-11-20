const express = require('express');

const app = express();
const User = require('./user.js');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//Gets all users
app.get('/user', (req, res) => {
    res.json(User.getAllIDs());
    return;
});

//Gets specific user
app.get('/user/:id', (req, res) => {
    let user = User.findByID(req.params.id);
    if (user == null){
        res.status(404).send("User not found");
        return;
    }
    res.json(user);
});

//Creates new user
app.post('/user', (req, res) => {
    let {name, password, playlist} = req.body;
    let u = User.create(name, password, playlist);
    if (u == null){
        res.status(400).send("Bad Request");
        return;
    }
    return res.json(u);
});

//Updates info
app.put('/user/:id', (req, res) =>{
    let user = User.findByID(req.params.id);
    if (user == null){
        res.status(404).send("User not found");
        return;
    }
    let {name, password, playlist} = req.body;
    user.name = name;
    user.password = password;
    user.playlist = playlist;

    user.update();
    res.json(user);
});

app.delete('/user/:id', (req, res) =>{
    let user = User.findByID(req.params.id);
    if (user == null){
        res.status(404).send("User not found");
        return;
    }
    user.delete();
    res.json(true);
});

const port = 3030;
app.listen(port, () =>{
    console.log("backend up and running");
});

