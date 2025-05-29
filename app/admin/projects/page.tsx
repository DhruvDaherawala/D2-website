"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import ContentForm from "@/components/admin/ContentForm";
import FileUpload from "@/components/admin/FileUpload";
import { Pencil, Plus, Trash2, Image, ExternalLink, Github } from "lucide-react";
import { Project } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export default function ProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [showEditProjectForm, setShowEditProjectForm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [currentImageUploadTarget, setCurrentImageUploadTarget] = useState<string>("");

  // Check if we should show the new project form based on URL params
  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "new") {
      setShowNewProjectForm(true);
    }
  }, [searchParams]);

  // Fetch projects data
  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/content/projects");
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          toast.error("Failed to fetch projects");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("An error occurred while fetching projects");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowEditProjectForm(true);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      const response = await fetch(`/api/content/projects?id=${projectToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== projectToDelete.id));
        toast.success("Project deleted successfully");
        setProjectToDelete(null);
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete project");
      }
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : "Something went wrong"}`);
    }
  };

  const handleNewProjectSuccess = () => {
    setShowNewProjectForm(false);
    router.push("/admin/projects");
    router.refresh();
  };

  const handleEditProjectSuccess = () => {
    setShowEditProjectForm(false);
    setEditingProject(null);
    router.refresh();
  };

  const handleUploadComplete = (url: string) => {
    if (currentImageUploadTarget === "new") {
      // For new project, we need to store the URL somewhere
      setShowImageUpload(false);
      setShowNewProjectForm(true);
      // Ideally, you'd have a way to pass this URL to the form
      toast.success("Image uploaded. Please enter project details.");
    } else if (editingProject && currentImageUploadTarget === "edit") {
      // For existing project, update the image URL
      handleUpdateProjectImage(url);
    }
  };

  const handleUpdateProjectImage = async (url: string) => {
    if (!editingProject) return;

    try {
      const updatedProject = { ...editingProject, imageUrl: url };
      
      const response = await fetch(`/api/content/projects?id=${editingProject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProject),
      });

      if (!response.ok) {
        throw new Error("Failed to update project image");
      }

      // Update local state
      setProjects(projects.map(p => 
        p.id === editingProject.id ? updatedProject : p
      ));
      
      setShowImageUpload(false);
      toast.success("Project image updated successfully");
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : "Something went wrong"}`);
    }
  };

  // Form fields for project form
  const projectFields = [
    {
      name: "title",
      label: "Title",
      type: "text" as const,
      placeholder: "Project Title",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea" as const,
      placeholder: "Project description",
      required: true,
    },
    {
      name: "imageUrl",
      label: "Image URL",
      type: "text" as const,
      placeholder: "/uploads/your-image.jpg",
      required: true,
    },
    {
      name: "tags",
      label: "Tags (comma separated)",
      type: "text" as const,
      placeholder: "React, UI/UX, Web Development",
      required: false,
    },
    {
      name: "demoLink",
      label: "Demo Link",
      type: "url" as const,
      placeholder: "https://example.com",
      required: false,
    },
    {
      name: "githubLink",
      label: "GitHub Link",
      type: "url" as const,
      placeholder: "https://github.com/example/repo",
      required: false,
    },
  ];

  // Parse tags from string for new/edit project
  const parseProjectData = (data: any) => {
    // Convert tags from comma-separated string to array if provided
    if (typeof data.tags === 'string') {
      return {
        ...data,
        tags: data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
      };
    }
    return data;
  };

  // Format tags to string for editing
  const formatProjectForEdit = (project: Project) => {
    return {
      ...project,
      tags: project.tags.join(', ')
    };
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Projects</h1>
        <div className="space-x-2">
          <Dialog open={showImageUpload} onOpenChange={setShowImageUpload}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Image className="mr-2 h-4 w-4" /> Upload Image
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Upload Project Image</DialogTitle>
              </DialogHeader>
              <FileUpload 
                onUploadComplete={handleUploadComplete}
                accept="image/*"
              />
            </DialogContent>
          </Dialog>
          
          <Dialog open={showNewProjectForm} onOpenChange={setShowNewProjectForm}>
            <DialogTrigger asChild>
              <Button onClick={() => setCurrentImageUploadTarget("new")}>
                <Plus className="mr-2 h-4 w-4" /> Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Project</DialogTitle>
              </DialogHeader>
              <ContentForm
                title="New Project"
                fields={projectFields}
                collection="projects"
                onSuccess={(data) => handleNewProjectSuccess()}
                onCancel={() => setShowNewProjectForm(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Manage Projects</CardTitle>
          <CardDescription>
            Edit, add, or remove projects displayed on your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-4 text-gray-400">
              No projects found. Create your first project by clicking "Add Project".
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Tags</TableHead>
                  <TableHead className="hidden md:table-cell">Links</TableHead>
                  <TableHead className="w-28 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="relative w-10 h-10 rounded overflow-hidden">
                        <img
                          src={project.imageUrl || "/placeholder-image.jpg"}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex space-x-2">
                        {project.demoLink && (
                          <a 
                            href={project.demoLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        {project.githubLink && (
                          <a 
                            href={project.githubLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setEditingProject(project);
                            setCurrentImageUploadTarget("edit");
                            setShowImageUpload(true);
                          }}
                        >
                          <Image className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditProject(project)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => setProjectToDelete(project)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Project Dialog */}
      <Dialog open={showEditProjectForm} onOpenChange={setShowEditProjectForm}>
        <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Project</DialogTitle>
          </DialogHeader>
          {editingProject && (
            <ContentForm
              title="Edit Project"
              fields={projectFields}
              initialData={formatProjectForEdit(editingProject)}
              collection="projects"
              onSuccess={handleEditProjectSuccess}
              onCancel={() => {
                setShowEditProjectForm(false);
                setEditingProject(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!projectToDelete} 
        onOpenChange={(open) => !open && setProjectToDelete(null)}
      >
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project "{projectToDelete?.title}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteProject}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 