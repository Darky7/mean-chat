var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var db = require('../database');
var Chat = db.chat;

server.listen(4000);

// socket io
io.on('connection', function(socket) {
    console.log('User connected');
    socket.on('disconnect', function() {
        console.log('User disconnected');
    });
    socket.on('save-message', function(data) {
        console.log(data);
        io.emit('new-message', { message: data });
    });
});

/* GET ALL CHATS */
router.get('/:room', function(req, res, next) {
    console.log('/:room get');
    console.log('room = ' + req.params.room);
    Chat.find({ room: req.params.room }, function(err, chats) {
        console.log('Chat find');
        if (err) return next(err);
        res.json(chats);
    });
});

/* CHAT ACTION */
router.get('/:action/:room/:newname', function(req, res, next) {
    /* UPDATE CHATROOM NAME */
    if (req.params.action === 'rename') {
        console.log('/:room get');
        console.log('room = ' + req.params.room);
        console.log('newname = ' + req.params.newname);
        Chat.updateMany({ room: req.params.room }, { $set: { room: req.params.newname } }, function(err, chats) {
            console.log('Chat find and update');
            if (err) return next(err);
            res.json(chats)
        });
    } else {
        if (req.params.action === 'delete') {
            console.log('/:room get');
            Chat.deleteMany({ room: req.params.room }, function(err, chats) {
                console.log('Chat find and delete');
                if (err) return next(err);
                res.json(chats)
            });
        } else {
            if (req.params.action === 'get') {
                var query = Chat.find({}).select('room');
                query.exec(function(err, chats) {
                    if (err) return next(err);
                    res.send(chats);
                });
            }
        }
    }
});


/* SAVE CHAT */
router.post('/', function(req, res, next) {
    console.log('/  post');
    Chat.create(req.body, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;