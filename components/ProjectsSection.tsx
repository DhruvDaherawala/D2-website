import { Home, Users, Heart, Truck, CreditCard } from "lucide-react"

export default function ProjectsSection() {
  const projects = [
    {
      icon: Home,
      title: "Property Rental Management System",
      description:
        "A comprehensive web system for managing properties, tracking renter information, and automatically notifying tenants about upcoming rent due dates with integrated payment reminders.",
      tags: ["Web Development", "Database Management", "Automation"],
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

  return (
    <section id="projects" className="py-20 bg-gray-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Our Projects</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover our portfolio of innovative solutions that showcase our expertise in AI, machine learning, and
            intelligent system development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mb-6 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                <project.icon className="h-8 w-8 text-white" />
              </div>

              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                {project.title}
              </h3>

              <p className="text-gray-400 leading-relaxed mb-4">{project.description}</p>

              <div className="flex flex-wrap gap-2">
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
          ))}
        </div>
      </div>
    </section>
  )
}
