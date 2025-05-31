import { NextRequest, NextResponse } from "next/server";
import { Project } from "@/lib/types";
import { getById, create, update, remove } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Function to handle project creation and updates
async function handleSaveProject(req: NextRequest, projectId?: string): Promise<NextResponse> {
  try {
    const data = await req.json();
    
    // Ensure we have required fields
    if (!data.title || !data.description || !data.iconName) {
      return NextResponse.json({ 
        error: "Missing required fields" 
      }, { status: 400 });
    }

    // Make sure tags is an array
    let tagsArray: string[] = [];
    if (typeof data.tags === 'string') {
      tagsArray = data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
    } else if (Array.isArray(data.tags)) {
      tagsArray = data.tags.filter((tag: any) => typeof tag === 'string' && tag.trim() !== '');
    }

    // Ensure link has a value
    const link = data.link || "#";

    // Project data to save
    const project: Project = {
      title: data.title,
      description: data.description,
      iconName: data.iconName,
      tags: tagsArray,
      link: link,
    };

    let result;
    
    if (projectId) {
      // Update existing project
      result = await update<Project>("projects", projectId, project);
      if (!result) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
    } else {
      // Create new project
      result = await create<Project>("projects", project);
    }

    // Revalidate projects page to update cache
    revalidatePath("/projects");
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error saving project:", error);
    return NextResponse.json(
      { error: "Failed to save project" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return handleSaveProject(req);
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  
  if (!id) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
  }
  
  return handleSaveProject(req, id);
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  
  if (!id) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
  }

  try {
    // Check if project exists
    const project = await getById<Project>("projects", id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    
    // Delete project
    const result = await remove("projects", id);
    if (!result) {
      return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
    }
    
    // Revalidate projects page to update cache
    revalidatePath("/projects");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
} 