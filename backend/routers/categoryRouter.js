import express from 'express';
import Category from '../Models/categoryModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdminOrSelf } from '../util.js';
import multer from 'multer';
import { uploadDoc } from './userRouter.js';
const upload = multer();
const categoryRouter = express.Router();

categoryRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    try {
      const category = await Category.find();
      res.json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  })
);

categoryRouter.post(
  '/',
  isAuth,
  isAdminOrSelf,
  upload.single('file'),
  expressAsyncHandler(async (req, res) => {
    try {
      if (req.file) {
        const profile_picture = await uploadDoc(req);
        req.body.categoryImage = profile_picture;
      }
      //const user = await User.find();
      const newcategory = new Category({
        categoryName: req.body.categoryName,
        categoryDescription: req.body.categoryDescription,
        categoryImage: req.body.categoryImage,
        categoryStatus: req.body.categoryStatus,
        createdDate: req.body.createdDate,
      });

      const category = await newcategory.save();
      const { ...other } = category._doc;
      res
        .status(201)
        .send({ message: 'Category Created successfully.', other });
    } catch (error) {
      res.status(500).json({ message: 'Error creating category', error });
    }
  })
);

categoryRouter.delete(
  '/:id',
  isAuth,
  isAdminOrSelf,
  expressAsyncHandler(async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id);
      res.status(200).json('category has been deleted');
    } catch (err) {
      return res.status(500).json(err);
    }
  })
);

categoryRouter.put(
  '/update/:id',
  isAuth,
  isAdminOrSelf,
  expressAsyncHandler(async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      console.log(category);
      await category.updateOne({ $set: req.body });
      res.status(200).json('Category update successfully');
    } catch (err) {
      res.status(500).json({
        message: 'Something went wrong, please try again',
        error: err,
      });
    }
  })
);

export default categoryRouter;