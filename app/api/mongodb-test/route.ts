import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://dhruvkhatri460:3s3tE2K79aoDDz68@website.c6o8r7w.mongodb.net/?retryWrites=true&w=majority";
const dbName = "website";

export async function GET() {
  let client: MongoClient | null = null;
  
  try {
    // Connect directly to MongoDB for this test
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db(dbName);
    
    // Get list of collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    // Check stats
    const stats = await db.stats();
    
    return NextResponse.json({
      success: true,
      message: 'Successfully connected to MongoDB',
      dbName: dbName,
      collections: collectionNames,
      stats: {
        collections: stats.collections,
        objects: stats.objects,
      },
      connected: true
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to connect to MongoDB',
        error: error instanceof Error ? error.message : String(error),
        connected: false
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
} 