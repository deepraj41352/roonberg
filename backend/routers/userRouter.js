import express from 'express';
import User from '../Models/userModel.js';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import {
  generateToken,
  nodeMailer,
  isAuth,
  isAdminOrSelf,
  baseUrl,
} from '../util.js';
import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
const userRouter = express.Router();
const upload = multer();
/**
 * @swagger
 * /user/{role}:
 *   get:
 *     summary: Get users by role.
 *     description: Retrieve a list of users with a specific role.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: role
 *         in: path
 *         description: The role to filter users by.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users with the specified role.
 *       500:
 *         description: Server error.
 */

userRouter.post(
  '/',
  expressAsyncHandler(async (req, res) => {
    const role = req.body.role;
    try {
      const users = await User.find({ role });
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  })
);

userRouter.put(
  '/update/:id',
  isAuth,
  isAdminOrSelf,
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (user._id == req.params.id) {
        await user.updateOne({ $set: req.body });
        res.status(200).json('update successfully');
      } else {
        res.status(403).json('you can not update');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  })
);

/**
 * @swagger
 * paths:
 *   /user/{id}:
 *     delete:
 *       summary: Delete a user account.
 *       tags:
 *         - User
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the user to delete.
 *       security:
 *         - BearerAuth: []
 *       responses:
 *         '200':
 *           description: User account successfully deleted.
 *           content:
 *             application/json:
 *               schema:
 *                 type: string
 *                 example: Account has been deleted
 *         '401':
 *           description: Unauthorized. User is not authenticated.
 *         '403':
 *           description: Forbidden. User does not have permission to delete this account.
 *         '404':
 *           description: User not found.
 *         '500':
 *           description: Internal Server Error.
 */
userRouter.delete(
  '/:id',
  isAuth,
  isAdminOrSelf,
  expressAsyncHandler(async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json('Account has been deleted');
    } catch (err) {
      return res.status(500).json(err);
    }
  })
);

/**
 * @swagger
 * /user/forget-password:
 *   post:
 *     summary: Send a link  password-reset on email.
 *     description: Send a password reset email to the user's registered email address.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's registered email address.
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Password reset email sent successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: Password reset email sent successfully.
 *       404:
 *         description: User not found. Email sending failed.
 *         content:
 *           application/json:
 *             example:
 *               message: User not found
 *       500:
 *         description: Internal server error. Email sending failed.
 *         content:
 *           application/json:
 *             example:
 *               message: Email sending failed
 */

userRouter.post(
  '/forget-password',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      user.passresetToken = token;
      await user.save();

      const resetLink = `${baseUrl()}/reset-password/${token}`;
      console.log(`${token}`);
      const mailInfo = {
        from: '"RoonBerg" <deepraj932000@gmail.com>',
        to: `<${user.email}>`,
        subject: 'Reset Password ✔',
        html: `<p>Please Click the following link to reset your password:</p>
                <a href="${resetLink}">Reset Password</a>`,
      };

      // Send the email
      const checkMail = await nodeMailer(mailInfo);

      if (checkMail) {
        res.send({
          message: `We sent a reset password link to your email.`,
        });
      } else {
        res.status(404).send({ message: 'Email sending failed' });
      }
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

/**
 * @swagger
 * /user/reset-password:
 *   post:
 *     summary: Reset user password.
 *     description: Reset a user's password using a valid reset token.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Reset token received via email.
 *               password:
 *                 type: string
 *                 description: New password to set.
 *             required:
 *               - token
 *               - password
 *     responses:
 *       200:
 *         description: Password reset successful.
 *         content:
 *           application/json:
 *             example:
 *               message: Password reset successfully.
 *       401:
 *         description: Invalid token. Password reset failed.
 *         content:
 *           application/json:
 *             example:
 *               message: Invalid Token
 *       404:
 *         description: User not found. Password reset failed.
 *         content:
 *           application/json:
 *             example:
 *               message: User not found
 */

userRouter.post(
  '/reset-password',
  expressAsyncHandler(async (req, res) => {
    jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        const user = await User.findOne({ passresetToken: req.body.token });
        if (user) {
          if (req.body.password) {
            user.password = bcrypt.hashSync(req.body.password, 8);
            await user.save();
            res.send({
              message: 'Password reseted successfully',
            });
          }
        } else {
          res.status(404).send({ message: 'User not found' });
        }
      }
    });
  })
);

/**
 * @swagger
 * /user/signin:
 *   post:
 *     summary: Authenticate and log in a user.
 *     description: Authenticate a user using their email and password and generate an access token.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 description: User's password.
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User authenticated successfully.
 *         content:
 *           application/json:
 *             example:
 *               _id: 1
 *               first_name: abhay
 *               email: abhay@example.com
 *               role: superadmin
 *               token: <access_token>
 *       401:
 *         description: Authentication failed. Incorrect email or password.
 *         content:
 *           application/json:
 *             example:
 *               message: Incorrect email or password
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             example:
 *               message: User not found
 */

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
          token: generateToken(user),
        });
        return;
      } else {
        res.status(401).send({ message: 'Incorrect password' });
        return;
      }
    }
    res.status(401).send({ message: 'User not found' });
  })
);

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Register a new user.
 *     description: Register a new user with the provided information.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: User's first name.
 *               email:
 *                 type: string
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 description: User's password.
 *               role:
 *                 type: string
 *                 description: User's role (e.g., 'superadmin', 'admin', 'agent', 'contractor').
 *             required:
 *               - first_name
 *               - email
 *               - password
 *               - role
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: User registered successfully.
 *               user:
 *                 _id: 1
 *                 first_name: abhay
 *                 email: abhay@example.com
 *                 role: superadmin
 *       400:
 *         description: Bad request. Registration data invalid.
 *         content:
 *           application/json:
 *             example:
 *               message: Email is already registered.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               message: Registration failed. Please try again later.
 */

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    try {
      const { first_name, email, password, role } = req.body;
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res
          .status(400)
          .send({ message: 'Email is already registered.' });
      }
      const hashedPassword = await bcrypt.hash(password, 8);
      const newUser = new User({
        first_name,
        email,
        password: hashedPassword,
        role,
      });
      const user = await newUser.save();
      res
        .status(201)
        .send({ message: 'User registered successfully. please Login', user });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: 'Registration failed. Please try again later.' });
    }
  })
);

userRouter.put(
  '/profile',
  isAuth,
  upload.single('file'),
  expressAsyncHandler(async (req, res) => {
    // console.log('req ', req);
    const userdata = await User.findById(req.user._id);
    if (userdata) {
      if (req.file) {
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const streamUpload = (req) => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
        };
        const profile_picture = await streamUpload(req);

        userdata.profile_picture = profile_picture || userdata.profile_picture;
      }

      userdata.first_name = req.body.first_name || userdata.first_name;
      userdata.last_name = req.body.last_name || userdata.last_name;
      userdata.email = req.body.email || userdata.email;
      userdata.gender = req.body.gender || userdata.gender;
      userdata.address = req.body.address || userdata.address;
      userdata.phone_number = req.body.phone_number || userdata.phone_number;

      userdata.dob = req.body.dob || userdata.dob;
      userdata.country = req.body.country || userdata.country;
      if (req.body.password) {
        userdata.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await userdata.save();
      console.log('updatedUser ', updatedUser);
      const { password, passresetToken, ...other } = updatedUser._doc;
      const userData = { ...other, token: generateToken(updatedUser) };
      res.send({
        userData,
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

const uploadDoc = async (req) => {
  try {
    console.log('REQ ', req.file);
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            console.log('result ', result);
            resolve(result);
          } else {
            console.log('error ', error);
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const profileUri = await streamUpload(req);
    console.log('profileUri ', profileUri);
    return profileUri;
  } catch (error) {
    console.log('Cloudinary Error ', error);
  }
};
export default userRouter;
