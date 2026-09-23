import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
import { connectDatabase } from './config/database.js';

try {
  for (const name of ['MONGODB_URI', 'JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD']) {
    if (!process.env[name]) throw new Error(`Missing required environment variable: ${name}`);
  }
  if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters in production.');
  }
  await connectDatabase();
  const port = Number(process.env.PORT) || 5001;
  const server = app.listen(port, '0.0.0.0', () => console.log(`RaviXMobile backend running on port ${port}`));
  let stopping = false;
  const shutdown = () => {
    if (stopping) return;
    stopping = true;
    const timeout = setTimeout(() => process.exit(1), 10000);
    timeout.unref();
    server.close(async () => {
      await mongoose.disconnect();
      clearTimeout(timeout);
      process.exit(0);
    });
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
  server.on('error', error => {
    console.error(`HTTP server failed: ${error.code || error.name}`);
    shutdown();
  });
} catch (error) {
  // Connection errors can contain connection details. Do not print the URI or credentials.
  console.error(`Startup failed: ${error.name}${error.code ? ` (${error.code})` : ''}. Check database access and required environment variables.`);
  await mongoose.disconnect();
  process.exit(1);
}
