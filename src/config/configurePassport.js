// config/passportConfig.js
import passport from 'passport';
import localStrategy from '../strategies/localStrategy.js';
import jwtStrategy from '../strategies/jwtStrategy.js';
import User from '../models/User.js';

const configurePassport = () => {
  passport.use(localStrategy);
  passport.use(jwtStrategy);

  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  passport.deserializeUser(async (email, done) => {
    const user = await User.findOne({email})
    
    if (user) {
      done(null, user);
    } else {
      done(new Error('User not found'));
    }
  });
};

export default configurePassport;
