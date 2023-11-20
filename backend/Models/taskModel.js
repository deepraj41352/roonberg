import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    projectID: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectTask' },
    taskName: { type: String },
    taskDescription: { type: String },
    taskCategory: { type: Array },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);
export default Task;
