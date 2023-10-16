import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    image: { type: String },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', MessageSchema);
export default Message;
