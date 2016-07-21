import express from 'express';
import {UserController} from './user.controller';

let app = express();

const controller = new UserController();

app.put('/', controller.update.bind(this));
app.get('/:id', controller.show.bind(this));

module.exports = app;