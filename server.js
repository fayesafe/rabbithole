var express = require('express');
var app = express();
var routes = require('./routes/router');

app.use('/', routes);

app.use(function (err, req, res, next) {
    console.log(err.message);
    res.status(err.status || 500)
        .send('you went down the wrong rabbit hole.');
});

app.listen(8000);
