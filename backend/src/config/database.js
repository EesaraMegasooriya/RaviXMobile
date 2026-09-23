import mongoose from 'mongoose';

export async function connectDatabase() {
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 15000,
    maxPoolSize: 10,
  });
  await mongoose.connection.db.command({ ping: 1 });
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}
