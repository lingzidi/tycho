import User from './user.model';
import {UserService} from './user.service';
import handleModel from '../../helpers/handleModel';

const service = new UserService();

export class UserController {
  /**
   * show user by _id
   */
  show(req, res) {
    return User
      .findById(req.params.id, handleModel(res));
  }

  /**
   * update user by _id
   */
  update(req, res) {
    return User
      .update({
        _id: req.params.id
      }, req.body, handleModel(res));
  }
}