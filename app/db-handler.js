var crypto = require('crypto');

var mongodb = require('mongodb');
var mongo = mongodb.MongoClient

var mmm = require('mmmagic');
var Magic = mmm.Magic;
var magic = new Magic(mmm.MAGIC_MIME_TYPE);

var mongoHandler = {};

mongoHandler.getSingle = function (mongoUrl, desiredToken, callback) {
    mongo.connect(mongoUrl, function (err, db) {
        if (err) {
            console.log(err.message)
            throw err;
        }
        var files = db.collection('files');
        files.findOne({
                token: desiredToken
        }, {
            _id: 0
        }, function (err, doc) {
            if (err) {
                console.log(err.message);
                throw(err);
            }
            try {
                var objToReturn = {};
                var path = doc.path;
                magic.detectFile(path, function (err, result) {
                    if (err) {
                        console.log(err.message);
                        throw(err);
                    }
                    try {
                        if (result.indexOf('text') === 0)
                            result = 'text/plain';
                        objToReturn.contentType = result;
                        objToReturn.path = path;
                    } catch (err) {
                        console.log(err.message);
                        throw(err);
                    } finally {
                        db.close();
                    }
                    callback(null, objToReturn);
                });
            } catch (err) {
                console.log(err);
                callback(err, objToReturn);
            } finally {
                db.close();
            }
        });
    });
}

mongoHandler.insert = function (mongoUrl, req, callback) {
        mongo.connect(mongoUrl, function (err, db) {
        if (err) {
            console.log(err.message);
            throw err;
        }
        var files = db.collection('files');
        var insertObj = {
                filename: req.files[0].filename,
                path: req.files[0].path,
                name: req.files[0].originalname
        };
        crypto.randomBytes(10, function (err, buf) {
            if (err) {
                console.log(err.message);
                throw(err);
            }
            insertObj.token = buf.toString('hex');
            files.insert(insertObj, function (err, data) {
                token = data.ops[0].token.toString();
                if (err) {
                    console.log(err.message);
                    callback(err, token);
                } else {
                    callback(null, token);
                }
                db.close();
            });
        });
    });
}

mongoHandler.list = function (mongoUrl, callback) {
        mongo.connect(mongoUrl, function (err, db) {
        if (err) {
            console.log(err.message);
            throw(err);
        }
        var files = db.collection('files');
        files.find().toArray(function (err, data) {
            if (err) {
                callback(err, data);
            } else {
                callback(null, data);
            }
            db.close();
        });
    });
}

module.exports = mongoHandler;
