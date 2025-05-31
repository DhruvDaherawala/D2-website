import * as fs from 'fs';
import * as path from 'path';
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://dhruvkhatri460:3s3tE2K79aoDDz68@website.c6o8r7w.mongodb.net/";
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_NAME = 'website';

// List of collections to migrate
const COLLECTIONS = [
  'navigation',
  'hero',
  'services', 
  'about',
  'projects',
  'contact',
  'footer',
  'site-config',
];

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Helper function to read JSON files
async function readJsonFile(filename: string): Promise<any> {
  try {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return null;
    }
    
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
}

// Main migration function
async function migrateToMongoDB(): Promise<void> {
  console.log('Starting migration to MongoDB...');
  
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    
    for (const collection of COLLECTIONS) {
      console.log(`Migrating ${collection}...`);
      
      // Read data from JSON file
      const data = await readJsonFile(`${collection}.json`);
      if (!data) {
        console.log(`Skipping ${collection} - No data found`);
        continue;
      }
      
      // Drop existing collection
      try {
        await db.collection(collection).drop();
        console.log(`Dropped existing ${collection} collection`);
      } catch (e) {
        // Collection might not exist yet, which is fine
      }
      
      // Insert data into MongoDB
      const items = Array.isArray(data) ? data : [data];
      
      if (items.length > 0) {
        // Remove any _id fields that might be present
        const cleanItems = items.map(item => {
          const newItem = { ...item };
          if (newItem._id) delete newItem._id;
          return newItem;
        });
        
        const result = await db.collection(collection).insertMany(cleanItems);
        console.log(`Inserted ${result.insertedCount} items into ${collection}`);
      } else {
        console.log(`No items to insert for ${collection}`);
      }
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
  }
}

// Run the migration
migrateToMongoDB()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  }); 