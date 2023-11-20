import mongoose from 'mongoose';

const projectTaskSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const projectTask = mongoose.model('ProjectTask', projectTaskSchema);
export default projectTask;
