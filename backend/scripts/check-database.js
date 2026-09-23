import 'dotenv/config';
import mongoose from 'mongoose';
try {
  if (!process.env.MONGODB_URI) throw new Error('Missing database configuration');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  await mongoose.connection.db.command({ ping: 1 });
  console.log(`MongoDB connection verified: ${mongoose.connection.name}`);
} catch (error) {
  console.error(`MongoDB check failed: ${error.name} (${error.code || 'no code'}). Check the URI, Atlas network access and database user permissions.`);
  process.exitCode = 1;
} finally { await mongoose.disconnect(); }
