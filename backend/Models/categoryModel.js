import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    categoryName: { type: String, required: true },
    categoryDescription: { type: String },
    categoryImage: { type: String },
    categoryStatus: { type: Boolean },
    createdDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', categorySchema);
export default Category;
