import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Make sure to install this package if not already

const templateSchema = new mongoose.Schema({
  tempId: {
    type: String,
    unique: true,
    default: () => uuidv4().split("-")[0], // Short UUID for readability
  },
  title: String,
  description: String,
  category: String,
  price: Number,
  image: String,
  zipfile: String,
  features: [String],
  featured: Boolean,
  languages: [String],
  supportedDevices: [String],
  techStack: [String],
  demoUrl: String,
  tags: [String],
  isFavorite: Boolean,
  lastUpdated: String,
  downloads: Number
});

export default mongoose.model("Template", templateSchema);
