import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set");
}

// console.log("MongoDB Connection String:", MONGODB_URI); // ✅ Log the connection string

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };   //empty object
}

export async function connectToDatabase() {
  if (cached.conn) {
    console.log("Using cached database connection"); // ✅ Log if reusing connection
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    console.log("Connecting to MongoDB..."); // ✅ Log before making a new connection
    cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => {
      console.log("MongoDB connected successfully!"); // ✅ Log on successful connection
      return mongoose.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    console.error("MongoDB connection error:", error); // ✅ Log connection errors
    cached.promise = null;
  }

  return cached.conn;
}
