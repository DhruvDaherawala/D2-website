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
  DialogDescription, 
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import ContentForm from "@/components/admin/ContentForm";
import { Pencil, Plus, Trash2, Brain, Code, Database, Cog } from "lucide-react";
import { Service } from "@/lib/types";

export default function ServicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showNewServiceForm, setShowNewServiceForm] = useState(false);
  const [showEditServiceForm, setShowEditServiceForm] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  // Check if we should show the new service form based on URL params
  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "new") {
      setShowNewServiceForm(true);
    }
  }, [searchParams]);

  // Fetch services data
  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch("/api/content/services");
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        } else {
          toast.error("Failed to fetch services");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("An error occurred while fetching services");
      } finally {
        setIsLoading(false);
      }
    }

    fetchServices();
  }, []);

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowEditServiceForm(true);
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    try {
      const response = await fetch(`/api/content/services?id=${serviceToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setServices(services.filter(s => s.id !== serviceToDelete.id));
        toast.success("Service deleted successfully");
        setServiceToDelete(null);
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete service");
      }
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : "Something went wrong"}`);
    }
  };

  const handleNewServiceSuccess = () => {
    setShowNewServiceForm(false);
    router.push("/admin/services");
    router.refresh();
  };

  const handleEditServiceSuccess = () => {
    setShowEditServiceForm(false);
    setEditingService(null);
    router.refresh();
  };

  // Form fields for service form
  const serviceFields = [
    {
      name: "icon",
      label: "Icon",
      type: "text" as const,
      placeholder: "Brain, Code, Cog, Database",
      description: "Icon name from Lucide icons",
      required: true,
    },
    {
      name: "title",
      label: "Title",
      type: "text" as const,
      placeholder: "Service Title",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea" as const,
      placeholder: "Service description",
      required: true,
    },
    {
      name: "gradient",
      label: "Gradient",
      type: "text" as const,
      placeholder: "from-blue-600 to-purple-600",
      description: "Tailwind gradient classes",
      required: true,
    },
    {
      name: "hoverGradient",
      label: "Hover Gradient",
      type: "text" as const,
      placeholder: "from-blue-700 to-purple-700",
      description: "Tailwind gradient classes on hover",
      required: true,
    },
  ];

  // Helper function to render icon based on name
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Brain":
        return <Brain className="h-5 w-5" />;
      case "Code":
        return <Code className="h-5 w-5" />;
      case "Cog":
        return <Cog className="h-5 w-5" />;
      case "Database":
        return <Database className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Services</h1>
        <Dialog open={showNewServiceForm} onOpenChange={setShowNewServiceForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Service</DialogTitle>
              <DialogDescription>
                Create a new service to display on your website
              </DialogDescription>
            </DialogHeader>
            <ContentForm
              title="New Service"
              fields={serviceFields}
              collection="services"
              onSuccess={handleNewServiceSuccess}
              onCancel={() => setShowNewServiceForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Manage Services</CardTitle>
          <CardDescription>
            Edit, add, or remove services displayed on your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading services...</div>
          ) : services.length === 0 ? (
            <div className="text-center py-4 text-gray-400">
              No services found. Create your first service by clicking "Add Service".
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Icon</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="w-28 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="w-12">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-700">
                        {renderIcon(service.icon)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{service.title}</TableCell>
                    <TableCell className="hidden md:table-cell text-gray-400 truncate max-w-xs">
                      {service.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditService(service)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => setServiceToDelete(service)}
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

      {/* Edit Service Dialog */}
      <Dialog open={showEditServiceForm} onOpenChange={setShowEditServiceForm}>
        <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Service</DialogTitle>
            <DialogDescription>
              Update the details of this service
            </DialogDescription>
          </DialogHeader>
          {editingService && (
            <ContentForm
              title="Edit Service"
              fields={serviceFields}
              initialData={editingService}
              collection="services"
              onSuccess={handleEditServiceSuccess}
              onCancel={() => {
                setShowEditServiceForm(false);
                setEditingService(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!serviceToDelete} 
        onOpenChange={(open) => !open && setServiceToDelete(null)}
      >
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the service "{serviceToDelete?.title}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteService}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 