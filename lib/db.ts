import { v4 as uuidv4 } from "uuid";
import { connectToDatabase, DB_NAME } from "./mongodb";
import { ObjectId } from "mongodb";

// Helper function to convert MongoDB _id to standard id
const convertId = (item: any) => {
  if (item && item._id) {
    item.id = item._id.toString();
    delete item._id;
  }
  return item;
};

// Helper function to prepare item for MongoDB
const prepareForMongo = (item: any) => {
  const result = { ...item };
  if (result.id) {
    delete result.id;
  }
  return result;
};

// Generic CRUD operations
export async function getAll<T>(collection: string): Promise<T[]> {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection(collection).find({}).toArray();
    return result.map(convertId) as T[];
  } catch (error) {
    console.error(`Error getting all items from ${collection}:`, error);
    return [];
  }
}

export async function getById<T extends { id: string }>(collection: string, id: string): Promise<T | null> {
  try {
    const { db } = await connectToDatabase();
    let query = {};
    
    try {
      // Try to use ObjectId if it looks like a MongoDB ObjectId
      if (/^[0-9a-fA-F]{24}$/.test(id)) {
        query = { _id: new ObjectId(id) };
      } else {
        query = { id: id };
      }
    } catch (e) {
      query = { id: id };
    }
    
    const result = await db.collection(collection).findOne(query);
    return result ? convertId(result) as T : null;
  } catch (error) {
    console.error(`Error getting item by ID from ${collection}:`, error);
    return null;
  }
}

export async function create<T extends { id?: string }>(collection: string, data: T): Promise<T> {
  try {
    const { db } = await connectToDatabase();
    const item = { ...data };
    
    // Ensure we have an ID
    if (!item.id) {
      item.id = uuidv4();
    }
    
    const mongoItem = prepareForMongo(item);
    const result = await db.collection(collection).insertOne(mongoItem);
    
    return { ...item, _id: result.insertedId } as unknown as T;
  } catch (error) {
    console.error(`Error creating item in ${collection}:`, error);
    throw error;
  }
}

export async function update<T extends { id: string }>(collection: string, id: string, data: Partial<T>): Promise<T | null> {
  try {
    const { db } = await connectToDatabase();
    let query = {};
    
    try {
      // Try to use ObjectId if it looks like a MongoDB ObjectId
      if (/^[0-9a-fA-F]{24}$/.test(id)) {
        query = { _id: new ObjectId(id) };
      } else {
        query = { id: id };
      }
    } catch (e) {
      query = { id: id };
    }
    
    const updateData = prepareForMongo(data);
    const result = await db.collection(collection).findOneAndUpdate(
      query,
      { $set: updateData },
      { returnDocument: "after" }
    );
    
    return result ? convertId(result) as T : null;
  } catch (error) {
    console.error(`Error updating item in ${collection}:`, error);
    return null;
  }
}

export async function remove<T extends { id: string }>(collection: string, id: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    let query = {};
    
    try {
      // Try to use ObjectId if it looks like a MongoDB ObjectId
      if (/^[0-9a-fA-F]{24}$/.test(id)) {
        query = { _id: new ObjectId(id) };
      } else {
        query = { id: id };
      }
    } catch (e) {
      query = { id: id };
    }
    
    const result = await db.collection(collection).deleteOne(query);
    return result.deletedCount > 0;
  } catch (error) {
    console.error(`Error removing item from ${collection}:`, error);
    return false;
  }
}

// Utility function to initialize the database with default data
export async function initializeDatabase<T>(collection: string, defaultData: T[]): Promise<void> {
  try {
    const { db } = await connectToDatabase();
    
    // Check if collection has any documents
    const count = await db.collection(collection).countDocuments();
    
    if (count === 0) {
      // Collection is empty, insert default data
      const mongoItems = defaultData.map(item => prepareForMongo(item));
      await db.collection(collection).insertMany(mongoItems);
      console.log(`Initialized ${collection} collection with default data`);
    }
  } catch (error) {
    console.error(`Error initializing ${collection} collection:`, error);
    throw error;
  }
}

// Handle file uploads
export async function saveUploadedFile(file: File): Promise<string> {
  // Keep file upload functionality the same as it involves file system operations
  const fs = require('fs');
  const path = require('path');
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  const uniqueFilename = `${uuidv4()}-${file.name}`;
  const filePath = path.join(uploadsDir, uniqueFilename);
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  await fs.promises.writeFile(filePath, buffer);
  
  return `/uploads/${uniqueFilename}`;
} 