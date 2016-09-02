import express from 'express';
import user from './user';

let app = express();

app.use('/user', user);

module.exports = app;