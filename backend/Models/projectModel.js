import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    projectDescription: { type: String },
    projectManager: { type: String },
    projectCategory: { type: Array },
    createdDate: {
      type: Date,
      default: Date.now,
    },
    endDate: { type: Date },
    projectStatus: { type: String,default:"active" },
    projectOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
