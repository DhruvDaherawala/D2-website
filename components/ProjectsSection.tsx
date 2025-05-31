"use client"

import { Home, Users, Heart, Truck, CreditCard, LucideIcon } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Project } from "@/lib/types"

// Map of icon names to their components
const iconMap: Record<string, LucideIcon> = {
  Home,
  Users, 
  Heart,
  Truck,
  CreditCard
};

interface ProjectsSectionProps {
  projects?: Project[];
}

export default function ProjectsSection({ projects: initialProjects }: ProjectsSectionProps) {
  const [projects, setProjects] = useState<(Project & { icon?: LucideIcon })[]>([]);
  const [loading, setLoading] = useState(!initialProjects);
  
  // Helper to map icon names to components
  const mapProjectsWithIcons = (projectsData: Project[]) => {
    return projectsData.map(project => {
      // Ensure project has valid tags array
      const tags = Array.isArray(project.tags) ? project.tags : [];
      
      return {
        ...project,
        tags: tags, // Ensure tags is always an array
        icon: iconMap[project.iconName] || Home, // Default to Home if icon not found
      };
    });
  };
  
  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) {
      // If we have server-side props, use those
      setProjects(mapProjectsWithIcons(initialProjects));
      setLoading(false);
    } else {
      // Otherwise, fetch from API
      async function fetchProjects() {
        try {
          const response = await fetch('/api/projects');
          if (!response.ok) {
            throw new Error('Failed to fetch projects');
          }
          
          const data = await response.json();
          // Map the string icon names back to components
          const projectsWithIcons = mapProjectsWithIcons(data);
          
          setProjects(projectsWithIcons);
        } catch (error) {
          console.error("Error fetching projects:", error);
          // Fallback to hard-coded projects for development
          const fallbackProjects = [
            {
              icon: Home,
              iconName: "Home",
              title: "Property Rental Management System",
              description:
                "A comprehensive web system for managing properties, tracking renter information, notifying tenants about upcoming rent due dates with integrated payment reminders.",
              tags: ["Web Development", "Database Management"],
              link: "https://new-updated-prms-frontend.vercel.app/"
            },
            // Add other fallback projects here if needed
          ];
          setProjects(fallbackProjects as (Project & { icon: LucideIcon })[]);
        } finally {
          setLoading(false);
        }
      }
      
      fetchProjects();
    }
  }, [initialProjects]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section id="projects" className="py-20 bg-gray-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">Our Projects</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover our portfolio of innovative solutions that showcase our expertise in AI, machine learning, and
            intelligent system development.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {projects.map((project, index) => (
              <a
                key={index}
                href={project.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <motion.div
                  variants={itemVariants}
                  className="group relative h-[420px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl backdrop-blur-sm -z-10" />
                  <div className="relative h-full p-6 rounded-xl border border-gray-700/50 hover:border-transparent transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col">
                    <motion.div 
                      className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-6 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {project.icon && <project.icon className="h-7 w-7 text-white" />}
                    </motion.div>

                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-gray-400 leading-relaxed mb-6 flex-grow text-justify">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {Array.isArray(project.tags) && project.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-blue-600/20 text-blue-300 text-sm rounded-full border border-blue-600/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
