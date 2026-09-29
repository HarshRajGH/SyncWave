import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    done: { type: Boolean, default: false },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

const participantSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = (ret.user || ret._id).toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

const waveSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Wave name is required'], trim: true },
    subject: { type: String, required: [true, 'Subject is required'], trim: true },
    duration: { type: Number, required: true, default: 30 },
    max: { type: Number, required: true, default: 5, min: 2, max: 12 },
    description: { type: String, default: '', trim: true },
    goals: [goalSchema],
    participants: [participantSchema],
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hostName: { type: String, required: true },
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
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

export default mongoose.model('Wave', waveSchema);
