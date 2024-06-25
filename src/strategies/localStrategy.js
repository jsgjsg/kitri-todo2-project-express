import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User.js';

const localStrategy = new LocalStrategy({ usernameField: 'email' },
  async (email, password, done) => {
    // const user = users.find(user => user.email === email);
    const user = await User.findOne({email});
    console.log(user);
    if (!user) {
      return done(null, false, { message: 'Incorrect email.' });
    }

    const isMatch = user.password == password;
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  }
);

export default localStrategy;
