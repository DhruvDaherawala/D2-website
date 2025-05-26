"use client"

import { Brain, Code, Cog, Database } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

export default function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const services = [
    {
      icon: Brain,
      title: "AI/ML Solutions",
      description:
        "Advanced machine learning models and AI systems that deliver intelligent insights for your business.",
      gradient: "from-blue-600 to-purple-600",
      hoverGradient: "from-blue-700 to-purple-700",
    },
    {
      icon: Code,
      title: "Software Development",
      description:
        "Custom software solutions built with modern technologies and scalable architecture for optimal performance.",
      gradient: "from-purple-600 to-pink-600",
      hoverGradient: "from-purple-700 to-pink-700",
    },
    {
      icon: Cog,
      title: "Smart Systems & Automation",
      description:
        "Intelligent automation systems that streamline processes and increase operational efficiency.",
      gradient: "from-pink-600 to-red-600",
      hoverGradient: "from-pink-700 to-red-700",
    },
    {
      icon: Database,
      title: "Data-Driven Applications",
      description:
        "Powerful applications that leverage data analytics to drive informed decision-making.",
      gradient: "from-red-600 to-orange-600",
      hoverGradient: "from-red-700 to-orange-700",
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
    <section id="services" className="py-20 bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We deliver cutting-edge technology solutions that drive innovation and transform businesses across
            industries.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-xl backdrop-blur-sm -z-10" />
              <div className="relative p-6 rounded-xl border border-gray-700/50 hover:border-transparent transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 h-[280px] flex flex-col">
                <div className="flex-shrink-0">
                  <motion.div 
                    className={`flex items-center justify-center w-14 h-14 bg-gradient-to-r ${service.gradient} rounded-xl mb-6 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <service.icon className="h-7 w-7 text-white" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 leading-relaxed flex-grow">{service.description}</p>
                
                {/* Interactive overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"
                  style={{
                    background: `linear-gradient(to right, ${service.gradient.split(' ')[1]}, ${service.gradient.split(' ')[3]})`,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
