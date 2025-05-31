import { connectToDatabase } from "@/lib/mongodb";

export default async function TestPage() {
  let connectionStatus = "Unknown";
  let errorMessage = "";
  
  try {
    const { client, db } = await connectToDatabase();
    
    // Check if connection is valid
    if (client.topology?.isConnected()) {
      connectionStatus = "Connected";
      
      // Try a simple operation to further verify
      const collections = await db.listCollections().toArray();
      const collectionNames = collections.map(col => col.name).join(", ");
      
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">MongoDB Connection Test</h1>
          <div className="p-4 bg-green-100 text-green-800 rounded mb-4">
            <p className="font-bold">Status: {connectionStatus}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Available Collections:</h2>
            <p className="p-2 bg-gray-100 rounded">{collectionNames || "No collections found"}</p>
          </div>
        </div>
      );
    } else {
      connectionStatus = "Failed";
      throw new Error("MongoDB topology not connected");
    }
  } catch (error: any) {
    connectionStatus = "Failed";
    errorMessage = error.message || "Unknown error";
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">MongoDB Connection Test</h1>
        <div className="p-4 bg-red-100 text-red-800 rounded mb-4">
          <p className="font-bold">Status: {connectionStatus}</p>
          <p className="mt-2">Error: {errorMessage}</p>
        </div>
        <div className="mt-4">
          <h2 className="font-semibold mb-2">Troubleshooting:</h2>
          <ul className="list-disc pl-5">
            <li>Check that your MongoDB connection string is correct</li>
            <li>Ensure your IP address is whitelisted in MongoDB Atlas</li>
            <li>Verify that your MongoDB user credentials are valid</li>
            <li>Check if your MongoDB Atlas cluster is running</li>
          </ul>
        </div>
      </div>
    );
  }
} 