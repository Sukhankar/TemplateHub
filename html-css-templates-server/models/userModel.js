import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  likedTemplates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template'
  }]
});

export default mongoose.model("User", userSchema);
