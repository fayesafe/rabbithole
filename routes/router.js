var express = require('express');
var multer = require('multer');
var path = require('path');

var router = express.Router();
var upload = multer({dest: './uploads/'});
var mongoHandler = require('../app/db-handler');

var mongoUrl = 'mongodb://localhost:27017/rabbithole';

router.get('/rbbt/:id', function (req, res, next) {
    var desiredToken = req.params.id;
    mongoHandler.getSingle(mongoUrl, desiredToken, function (err, data) {
        if (err) {
            console.log(err.message);
            next(err);
        }
        res.set('Content-Type', data.contentType);
        res.sendFile(path.normalize(__dirname + '/../' + data.path));
    });
});

router.post('/', upload.any(), function (req, res, next) {
    mongoHandler.insert(mongoUrl, req,function (err, data){
        if (err) {
            console.log(err.message);
            return next(err);
        }
        res.send(req.protocol +
            '://' +
            req.get('host') +
            '/rbbt/' +
            data
        );
    });
});

router.get('/', function (req, res, next) {
    res.set('Content-Type', 'text/plain');
    mongoHandler.list(mongoUrl, function (err, data){
        if (err) {
            console.log(err.message);
            next(err);
        }
        data.forEach(function (el) {
            res.write(el.name.toString() +
                    ': \n\t' +
                    req.protocol +
                    '://' +
                    req.get('host') +
                    '/rbbt/' +
                    el.token.toString() +
                    '\n'
                 );
    });
    res.end('=====================');});
});

router.get('*', function(req, res) {
    res.redirect('/');
});

module.exports = router;
