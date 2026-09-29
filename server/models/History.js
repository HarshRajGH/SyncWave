import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    waveName: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    duration: { type: Number, required: true },
    goalsCompleted: { type: Number, default: 0 },
    goalsTotal: { type: Number, default: 0 },
    participants: { type: Number, default: 1 },
    completedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.model('History', historySchema);
