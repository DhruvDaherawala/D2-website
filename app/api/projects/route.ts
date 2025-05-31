import { getAll, getById } from "@/lib/db";
import { Project } from "@/data/projects";
import { NextResponse } from "next/server";
import { initializeProjectsDatabase } from "@/lib/init-db";

export async function GET(request: Request) {
  try {
    // Initialize the projects database if it doesn't exist yet
    await initializeProjectsDatabase();
    
    // Check if we are requesting a specific project by ID
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      // Get specific project by ID
      const project = await getById<Project>("projects", id);
      
      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }
      
      // Ensure project has required properties with default values if missing
      const normalizedProject = {
        ...project,
        // Ensure tags is an array
        tags: Array.isArray(project.tags)
          ? project.tags
          : typeof project.tags === 'string'
            ? [project.tags]
            : [],
        // Ensure link exists
        link: project.link || "#" 
      };
      
      return NextResponse.json(normalizedProject);
    } else {
      // Get all projects from the database
      const projects = await getAll<Project>("projects");
      
      // Ensure each project has required properties with default values if missing
      const normalizedProjects = projects.map(project => ({
        ...project,
        // Ensure tags is an array
        tags: Array.isArray(project.tags)
          ? project.tags
          : typeof project.tags === 'string'
            ? [project.tags]
            : [],
        // Ensure link exists
        link: project.link || "#"
      }));
      
      return NextResponse.json(normalizedProjects);
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
} 