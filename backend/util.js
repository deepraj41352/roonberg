import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS_KEY,
  },
});
transporter.verify().then(console.log).catch(console.error);

export const nodeMailer = (mail) => {
  try {
    const info = transporter.sendMail(mail);
    console.log('info ', info);
    return info;
  } catch (err) {
    console.log('Error sdfd', err);
    return err;
  }
};

export const baseUrl = () =>
  process.env.BASE_URL
    ? process.env.BASE_URL
    : process.env.NODE_ENV !== 'production'
    ? 'http://localhost:3000'
    : 'https://sweepmeet.com';

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      first_name: user.first_name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

export const isAuth = (req, res, next) => {
  console.log(authorization);
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.lenght);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No token' });
  }
};

export const isAdmin = (req, res, next) => {
  console.log(req.user);
  if (
    (req.user && req.user.role === 'superadmin') ||
    req.user.role === 'admin'
  ) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};
