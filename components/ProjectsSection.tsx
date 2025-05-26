"use client"

import { Home, Users, Heart, Truck, CreditCard } from "lucide-react"
import { motion } from "framer-motion"

export default function ProjectsSection() {
  const projects = [
    {
      icon: Home,
      title: "Property Rental Management System",
      description:
        "A comprehensive web system for managing properties, tracking renter information, notifying tenants about upcoming rent due dates with integrated payment reminders.",
      tags: ["Web Development", "Database Management"],
    },
    {
      icon: Users,
      title: "AI-Recruitment System",
      description:
        "An intelligent resume screening tool that leverages natural language processing to scan resumes and shortlist candidates based on skill-role matching and compatibility analysis.",
      tags: ["AI/ML", "NLP", "Recruitment Tech"],
    },
    {
      icon: Heart,
      title: "SelfDoc",
      description:
        "A machine learning-based health prediction tool that analyzes user input parameters like age, glucose level, BMI, and lifestyle factors to predict diabetes likelihood.",
      tags: ["Healthcare AI", "Predictive Analytics", "ML"],
    },
    {
      icon: Truck,
      title: "CRM for Construction Rentals",
      description:
        "A smart equipment rental management system for construction sites that tracks equipment usage time, generates automated bills, and enables real-time equipment tracking.",
      tags: ["IoT", "Real-time Tracking", "CRM"],
    },
    {
      icon: CreditCard,
      title: "Loan Eligibility System",
      description:
        "An AI-powered financial assessment model that analyzes user data including credit history, income, and financial behavior to determine loan eligibility and repayment capability.",
      tags: ["FinTech", "Risk Assessment", "AI"],
    },
  ]

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

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative h-[420px]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl backdrop-blur-sm -z-10" />
              <div className="relative h-full p-6 rounded-xl border border-gray-700/50 hover:border-transparent transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col">
                <motion.div 
                  className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-6 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <project.icon className="h-7 w-7 text-white" />
                </motion.div>

                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>

                <p className="text-gray-400 leading-relaxed mb-6 flex-grow text-justify">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map((tag, tagIndex) => (
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
          ))}
        </motion.div>
      </div>
    </section>
  )
}
