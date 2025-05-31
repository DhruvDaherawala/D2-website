import { NextRequest, NextResponse } from "next/server";
import { getAll, getById, create, update, remove } from "@/lib/db";
import { getServerSession } from "next-auth";
import { initializeContactsDatabase } from "@/lib/init-db";

// Check if user is authenticated as admin
async function isAdmin() {
  const session = await getServerSession();
  return !!session?.user;
}

// Ensure we have a contacts database
const ensureContactsCollection = async () => {
  await initializeContactsDatabase();
};

// GET /api/content/[collection]
export async function GET(
  request: NextRequest,
  { params }: { params: { collection: string } }
) {
  const collection = params.collection;
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  try {
    if (id) {
      const item = await getById(collection, id);
      
      if (!item) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
      }
      
      return NextResponse.json(item);
    }
    
    const items = await getAll(collection);
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

// POST /api/content/[collection]
export async function POST(
  request: NextRequest,
  { params }: { params: { collection: string } }
) {
  try {
    const { collection } = params;
    
    // Only allow specific collections for security
    if (!["contacts", "newsletter", "inquiries"].includes(collection)) {
      return NextResponse.json(
        { error: "Collection not allowed" },
        { status: 403 }
      );
    }
    
    // Ensure collections exist
    if (collection === "contacts") {
      await ensureContactsCollection();
    }

    const data = await request.json();
    
    // Add creation timestamp
    const itemWithTimestamp = {
      ...data,
      createdAt: new Date()
    };

    const result = await create(collection, itemWithTimestamp);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error creating item in ${params.collection}:`, error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}

// PUT /api/content/[collection]?id=xxx
export async function PUT(
  request: NextRequest,
  { params }: { params: { collection: string } }
) {
  const admin = await isAdmin();
  
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { collection } = params;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const data = await request.json();
    
    // Add updated timestamp
    const itemWithTimestamp = {
      ...data,
      updatedAt: new Date()
    };

    const result = await update(collection, id, itemWithTimestamp);
    
    if (!result) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error updating item in ${params.collection}:`, error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}

// DELETE /api/content/[collection]?id=xxx
export async function DELETE(
  request: NextRequest,
  { params }: { params: { collection: string } }
) {
  const admin = await isAdmin();
  
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { collection } = params;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const result = await remove(collection, id);
    
    if (!result) {
      return NextResponse.json(
        { error: "Item not found or could not be deleted" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting item from ${params.collection}:`, error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
} 