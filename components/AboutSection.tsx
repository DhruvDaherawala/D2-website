"use client"

import { Target, Users, Lightbulb } from "lucide-react"
import { motion } from "framer-motion"

export default function AboutSection() {
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
    <section id="about" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl font-bold text-white mb-6">About Devnex</h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed text-justify">
              At Devnex, we blend intelligence with innovation. From predictive analytics to AI-powered automation, our team
              crafts solutions that solve real-world problems with precision and passion.
            </p>
            <p className="text-lg text-gray-400 mb-12 leading-relaxed text-justify">
              Founded on the principle that technology should enhance human potential, we specialize in creating
              intelligent systems that not only meet today's challenges but anticipate tomorrow's opportunities.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <motion.div 
                className="group"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-center w-14 h-14 bg-blue-600 rounded-xl mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 text-center">Precision</h3>
                <p className="text-sm text-gray-400 text-center">Accurate solutions tailored to your needs</p>
              </motion.div>

              <motion.div 
                className="group"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-center w-14 h-14 bg-purple-600 rounded-xl mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                  <Lightbulb className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 text-center">Innovation</h3>
                <p className="text-sm text-gray-400 text-center">Cutting-edge technology and creative thinking</p>
              </motion.div>

              <motion.div 
                className="group"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-center w-14 h-14 bg-pink-600 rounded-xl mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-pink-500/25 transition-all duration-300">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 text-center">Passion</h3>
                <p className="text-sm text-gray-400 text-center">Dedicated team committed to excellence</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="relative"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl backdrop-blur-sm -z-10" />
            <div className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/50">
              <div className="grid grid-cols-2 gap-8">
                <motion.div 
                  className="text-center group"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-4xl font-bold text-blue-400 mb-2 group-hover:text-blue-300 transition-colors">10+</div>
                  <div className="text-sm text-gray-400">Projects Delivered</div>
                </motion.div>

                <motion.div 
                  className="text-center group"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-4xl font-bold text-purple-400 mb-2 group-hover:text-purple-300 transition-colors">100%</div>
                  <div className="text-sm text-gray-400">Client Satisfaction</div>
                </motion.div>

                <motion.div 
                  className="text-center group"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-4xl font-bold text-pink-400 mb-2 group-hover:text-pink-300 transition-colors">24/7</div>
                  <div className="text-sm text-gray-400">Support Available</div>
                </motion.div>

                <motion.div 
                  className="text-center group"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-4xl font-bold text-green-400 mb-2 group-hover:text-green-300 transition-colors">5+</div>
                  <div className="text-sm text-gray-400">Years Experience</div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
