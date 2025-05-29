import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const DB_DIR = path.join(process.cwd(), "data");

// Ensure the data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Generic function to read a collection
export async function readCollection<T>(collection: string): Promise<T[]> {
  const filePath = path.join(DB_DIR, `${collection}.json`);
  
  if (!fs.existsSync(filePath)) {
    return [];
  }
  
  const data = await fs.promises.readFile(filePath, "utf8");
  return JSON.parse(data) as T[];
}

// Generic function to write a collection
export async function writeCollection<T>(collection: string, data: T[]): Promise<void> {
  const filePath = path.join(DB_DIR, `${collection}.json`);
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

// Generic CRUD operations
export async function getAll<T>(collection: string): Promise<T[]> {
  return readCollection<T>(collection);
}

export async function getById<T extends { id: string }>(collection: string, id: string): Promise<T | null> {
  const items = await readCollection<T>(collection);
  return items.find(item => item.id === id) || null;
}

export async function create<T extends { id?: string }>(collection: string, data: T): Promise<T> {
  const items = await readCollection<T>(collection);
  const newItem = { ...data, id: data.id || uuidv4() };
  items.push(newItem as T);
  await writeCollection(collection, items);
  return newItem as T;
}

export async function update<T extends { id: string }>(collection: string, id: string, data: Partial<T>): Promise<T | null> {
  const items = await readCollection<T>(collection);
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const updatedItem = { ...items[index], ...data, id };
  items[index] = updatedItem;
  await writeCollection(collection, items);
  return updatedItem;
}

export async function remove<T extends { id: string }>(collection: string, id: string): Promise<boolean> {
  const items = await readCollection<T>(collection);
  const filteredItems = items.filter(item => item.id !== id);
  
  if (filteredItems.length === items.length) {
    return false;
  }
  
  await writeCollection(collection, filteredItems);
  return true;
}

// Utility function to initialize the database with default data
export async function initializeDatabase<T>(collection: string, defaultData: T[]): Promise<void> {
  const filePath = path.join(DB_DIR, `${collection}.json`);
  
  if (!fs.existsSync(filePath)) {
    await writeCollection(collection, defaultData);
  }
}

// Handle file uploads
export async function saveUploadedFile(file: File): Promise<string> {
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