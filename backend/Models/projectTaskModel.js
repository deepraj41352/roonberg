import mongoose from 'mongoose';

const projectTaskSchema = new mongoose.Schema(
  {
    projectName: { type: String },
  },
  {
    timestamps: true,
  }
);

const projectTask = mongoose.model('ProjectTask', projectTaskSchema);
export default projectTask;
