import express from 'express';
import session from 'express-session';
import passport from 'passport';
import authRouter from './routes/authRouter.js';
import usersRouter from './routes/usersRouter.js';
import todosRouter from './routes/todosRouter.js';
import todosTmpRouter from './routes/todosTmpRouter.js';

import configurePassport from './config/configurePassport.js';
import cookieParser from 'cookie-parser';
import authHandler from './middleware/authHandler.js'
import connectDB from './config/db.js';
import cors from 'cors';

const app = express();
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser())
app.use(session({
  secret: 'secret key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: 'http://localhost:5173' // 요청을 허용할 도메인
}));

app.use('/api/auth', authRouter);
app.use('/api/users', authHandler.checkAuthentication, usersRouter);
app.use('/api/todos', passport.authenticate('jwt', { session : false }), todosRouter);
app.use('/api/todosTmp', todosTmpRouter);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

export default app;
