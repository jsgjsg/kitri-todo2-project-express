// config/passportConfig.js
import passport from 'passport';
import localStrategy from '../strategies/localStrategy.js';
// import { users } from '../users.js';
import User from '../models/User.js';

const configurePassport = () => {
  passport.use(localStrategy);

  passport.serializeUser((user, done) => {
    done(null, user.username);
  });

  passport.deserializeUser((username, done) => {
    // const user = users.find(user => user.username === username);
    const user = User.findOne({username})
    
    if (user) {
      done(null, user);
    } else {
      done(new Error('User not found'));
    }
  });
};

export default configurePassport;
