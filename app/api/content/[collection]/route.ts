import { NextRequest, NextResponse } from "next/server";
import { getAll, getById, create, update, remove } from "@/lib/db";
import { getServerSession } from "next-auth";

// Check if user is authenticated as admin
async function isAdmin() {
  const session = await getServerSession();
  return !!session?.user;
}

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
  const admin = await isAdmin();
  
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const collection = params.collection;
    const data = await request.json();
    
    const newItem = await create(collection, data);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating content:", error);
    return NextResponse.json(
      { error: "Failed to create content" },
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
    const collection = params.collection;
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "Missing ID parameter" },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    const updatedItem = await update(collection, id, data);
    
    if (!updatedItem) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json(
      { error: "Failed to update content" },
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
    const collection = params.collection;
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "Missing ID parameter" },
        { status: 400 }
      );
    }
    
    const success = await remove(collection, id);
    
    if (!success) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting content:", error);
    return NextResponse.json(
      { error: "Failed to delete content" },
      { status: 500 }
    );
  }
} 