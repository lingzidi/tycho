import mongoose from 'mongoose';
import env from '../../env/local.env';

mongoose.connect(env.MONGODB_URL);

export default mongoose.model('User', { 
  username: String,
  accessToken: String,
  githubId: Number,
  displayName: String
});