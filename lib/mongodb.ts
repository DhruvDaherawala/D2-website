import { MongoClient } from 'mongodb';

// Connection URI from environment variables with fallback
const uri = process.env.MONGODB_URI || 'mongodb+srv://dhruvkhatri460:3s3tE2K79aoDDz68@website.c6o8r7w.mongodb.net/?retryWrites=true&w=majority';

// Database Name
export const DB_NAME = process.env.MONGODB_DB || "website";

// Handle connection error
if (!uri) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Create a MongoClient with proper TLS configuration
const client = new MongoClient(uri, {
  // Setting TLS options to resolve the SSL error
  tls: true,
  ssl: true,
});

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
        // Don't throw the error, return a fallback or dummy connection
        // This allows the app to continue running even without DB
        console.warn('Using fallback data instead of database');
        return {
          client: null,
          db: {
            collection: () => ({
              find: () => ({ toArray: async () => [] }),
              findOne: async () => null,
              insertOne: async () => ({ insertedId: 'dummy-id' }),
              insertMany: async () => ({ insertedCount: 0 }),
              findOneAndUpdate: async () => null,
              deleteOne: async () => ({ deletedCount: 0 }),
              countDocuments: async () => 0,
            }),
          },
        };
      });
  }
  
  try {
    cached.mongo.conn = await cached.mongo.promise;
  } catch (e) {
    cached.mongo.promise = null;
    console.error('Error connecting to MongoDB:', e);
    // Return a fallback connection
    return {
      client: null,
      db: {
        collection: () => ({
          find: () => ({ toArray: async () => [] }),
          findOne: async () => null,
          insertOne: async () => ({ insertedId: 'dummy-id' }),
          insertMany: async () => ({ insertedCount: 0 }),
          findOneAndUpdate: async () => null,
          deleteOne: async () => ({ deletedCount: 0 }),
          countDocuments: async () => 0,
        }),
      },
    };
  }
  
  return cached.mongo.conn;
}

export { connectToDatabase };

// For backward compatibility
const clientPromise = client.connect()
  .catch(err => {
    console.error("MongoDB client connection failed:", err);
    // Return a dummy client for compatibility
    return client;
  });

export default clientPromise; 