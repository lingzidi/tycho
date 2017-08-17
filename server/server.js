import express from 'express';
import modRewrite from 'connect-modrewrite';
import path from 'path';
import fs from 'fs';
import passport from 'passport';
import expressSession from 'express-session';

import ensureAuthenticated from './helpers/auth';
import auth from './auth';
import api from './api';

let app = express();

// TODO: figure all this out
app.use(expressSession({
	secret: 'overclocked pizza cat',
	resave: true,
	saveUninitialized: true
}));

// passport initialization
app.use(passport.initialize());
app.use(passport.session());

// mod rewrite any url that doesn't start with 'api' and doesn't have an extension
app.use(modRewrite(['^/(?!api|auth)([^\\.]+)$ /#$1 [L]']));

app.use('/auth', auth);

app.use('/api', ensureAuthenticated, api);

app.get('/', function(req, res) {
  fs.readFile(
    path.join(__dirname, '../client/app/index.html'),
    (err, info) => {
      res.type('html');
      res.end(info);
    });
});

module.exports = app;