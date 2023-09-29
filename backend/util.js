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
    : 'https://roonberg.onrender.com';

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
  const authorization = req.headers.authorization;
  console.log(authorization);
  if (authorization) {
    const token = authorization.slice(7); // Remove 'Bearer ' prefix
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

export const isAdminOrSelf = (req, res, next) => {
  const currentUser = req.user; // Current user making the request
  const userId = req.params.id; // User ID in the route parameter

  if (
    currentUser.role === 'superadmin' ||
    currentUser.role === 'admin' ||
    currentUser._id === userId
  ) {
    next();
  } else {
    res.status(401).send({ message: 'Permission Denied' });
  }
};