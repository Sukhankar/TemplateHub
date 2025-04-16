import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db.js';

import adminAuthRoutes from './routes/AdminauthRoutes.js';
import userAuthRoutes from './routes/UserAuthRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/admin', adminAuthRoutes);
app.use('/api/user', userAuthRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reviews', reviewRoutes);

// Connect to MongoDB and start server
connectDB().then(() => {
  console.log('✅ MongoDB connected');
  app.listen(process.env.PORT, () => console.log(`🚀 Server running on ${process.env.PORT}`));
}).catch(err => console.error('❌ MongoDB connection error:', err));
