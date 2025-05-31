const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = "mongodb+srv://dhruvkhatri460:3s3tE2K79aoDDz68@website.c6o8r7w.mongodb.net/?retryWrites=true&w=majority";

// Database Name
const DB_NAME = "website";

// Data directory
const DATA_DIR = path.join(process.cwd(), 'data');

// Collections to migrate
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

// Helper to read JSON file
async function readJsonFile(filename) {
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
async function migrateToMongo() {
  let client;
  
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    for (const collection of COLLECTIONS) {
      console.log(`Migrating ${collection}...`);
      
      // Read data from JSON
      const data = await readJsonFile(`${collection}.json`);
      if (!data) {
        console.log(`Skipping ${collection} - no data found`);
        continue;
      }
      
      // Prepare items for MongoDB (ensure they have proper ID format)
      const items = Array.isArray(data) ? data : [data];
      
      if (items.length === 0) {
        console.log(`No items to migrate for ${collection}`);
        continue;
      }
      
      // Clean items
      const cleanItems = items.map(item => {
        const newItem = {...item};
        if (newItem._id) delete newItem._id; // Remove any _id fields
        return newItem;
      });
      
      // Drop existing collection if it exists
      try {
        await db.collection(collection).drop();
        console.log(`Dropped existing ${collection} collection`);
      } catch (error) {
        // Collection might not exist, which is fine
        console.log(`Creating new ${collection} collection`);
      }
      
      // Insert data
      const result = await db.collection(collection).insertMany(cleanItems);
      console.log(`Inserted ${result.insertedCount} items into ${collection}`);
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the migration
migrateToMongo()
  .then(() => {
    console.log('Migration script completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Migration script failed:', error);
    process.exit(1);
  }); 