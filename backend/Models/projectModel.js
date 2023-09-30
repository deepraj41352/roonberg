import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    projectDescription: { type: String },
    projectManager: { type: String },
    createdDate: {
      type: Date,
      default: Date.now,
    },
    endDate: { type: Date },
    projectStatus: { type: String },
    projectOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
