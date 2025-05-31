import { MongoClient } from 'mongodb';

// Connection URI from environment variables with fallback
const uri = process.env.MONGODB_URI || "mongodb+srv://dhruvkhatri460:3s3tE2K79aoDDz68@website.c6o8r7w.mongodb.net/?retryWrites=true&w=majority";

// Database Name
export const DB_NAME = process.env.MONGODB_DB || "website";

// Handle connection error
if (!uri) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Create a MongoClient
const client = new MongoClient(uri);

// Global is used here to maintain a cached connection across hot reloads
// in development. This prevents connections growing exponentially
// during API Route usage.
let cached = global as any;

if (!cached.mongo) {
  cached.mongo = { conn: null, promise: null }
}

async function connectToDatabase() {
  if (cached.mongo.conn) {
    return cached.mongo.conn;
  }

  if (!cached.mongo.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.mongo.promise = client.connect()
      .then(client => {
        console.log('Connected to MongoDB');
        return {
          client,
          db: client.db(DB_NAME),
        }
      })
      .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        throw err;
      });
  }
  
  try {
    cached.mongo.conn = await cached.mongo.promise;
  } catch (e) {
    cached.mongo.promise = null;
    throw e;
  }
  
  return cached.mongo.conn;
}

export { connectToDatabase };

// For backward compatibility
const clientPromise = client.connect()
  .catch(err => {
    console.error("MongoDB client connection failed:", err);
    throw err;
  });

export default clientPromise; 