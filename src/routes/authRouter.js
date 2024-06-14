import { Router } from 'express';
import passport from 'passport';
import { users } from '../users.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) {
        return next(err);
      }
      const accessToken = jwt.sign(
        { id: user._id, username: user.username },
        'kitri_secret',
        { expiresIn: '10m'}
      );

      return res.status(200).json({ accessToken });
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

router.post('/join', async (req, res) => {
  const { username, age, password } = req.body;
  // const userExists = users.some(user => user.username === username);

  try{
    const user = await User.findOne({username});
    if (user) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = new User({ username, age, password });
    const savedUser = await newUser.save();

    if(!savedUser) throw new Error("User save operation failed");

    res.status(201).json({ message: 'User joined successfully' });

  }
  catch(err) {
    res.status(500).send("Internal server error");
  }
});

router.put('/change-password', async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    // const user = users.find(user => user.id === req.session.passport.user);
    const user = await User.findOne({ username : req.user.username});
    console.log(user);
    if (!user || oldPassword != user.password) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: 'Password changed successfully' });
  }
  catch(err) {
    res.status(500).send("Internal server error");
  }

});

router.delete('/delete-account', async (req, res) => {
  // const index = users.findIndex(user => user.id === req.session.passport.user);
  try {
    const user = await User.findOne({ username : req.user.username});

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    await user.deleteOne({user});
    req.logout((err) => {
      if(err) {
        console.error('Error logging out:', err);
        return res.status(500).json({ message: 'Error logging out' });
      }
    }); // passport의 세션 제거 메소드
    res.status(200).json({ message: 'Password changed successfully' });
  }
  catch(err) {
    res.status(500).send("Internal server error");
  }
});

export default router;
