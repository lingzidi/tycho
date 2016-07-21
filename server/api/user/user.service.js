import User from '../../api/user/user.model';

export class UserService {

  /**
   * renders an object from a GitHub response containing
   * propertiess specified in User model
   * 
   * @param  {Object} userData
   * @return {Object} User obj
   */
  renderProfile(userData) {
    const profile = userData.profile;

    return {
      accessToken: userData.accessToken,
      username: profile.username,
      name: profile.name,
      githubId: profile.id,
      displayName: profile.displayName
    };
  }

  /**
   * finds an existing user using given GitHub specs
   * or creates a new User
   * 
   * @param  {[Object}  userData  GitHub auth response
   * @param  {Function} done      callback fn
   * @return {User}
   */
  findOrCreate(userData, done) {
    User.findOne({
      githubId: userData.profile.id
    }, (err, user) => {
      if(err) {
        done(err);
      }
      if(user) {
        done(err, user);
      }
      if(!user) {
        User.create(this.renderProfile(userData), (err, user) => {
          done(err, user);
        });
      }
    });
  }
}