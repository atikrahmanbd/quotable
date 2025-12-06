import mongoose from 'mongoose';
import app from '../src/app.js';

const { MONGODB_URI } = process.env;

let conn = null;

export default async function handler(req, res) {
  // Cache the database connection
  if (conn == null) {
    conn = mongoose.connect(MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      connectTimeoutMS: 5000,
    }).then(() => mongoose);

    // `await`ing connection after assigning to the `conn` variable
    // to avoid multiple function calls creating new connections
    await conn;
  }

  return app(req, res);
}
