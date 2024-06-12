import { Strategy as LocalStrategy } from 'passport-local';
// import { users } from '../users.js';
import User from '../models/User.js';

const localStrategy = new LocalStrategy({ usernameField: 'username' },
  async (username, password, done) => {
    // const user = users.find(user => user.username === username);
    const user = await User.findOne({username});
    console.log(user);
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }

    const isMatch = user.password == password;
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  }
);

export default localStrategy;
