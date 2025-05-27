"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowUp } from "lucide-react"

const navItems = [
  { name: "Home", href: "#hero" },
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("#hero")
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 20)
      setShowBackToTop(scrollPosition > 500)

      // If we're at the top of the page, set active section to hero
      if (scrollPosition < 100) {
        setActiveSection("#hero")
        return
      }

      // Find the current section in view
      const sections = navItems.map(item => item.href)
      const currentSection = sections.find(section => {
        const element = document.querySelector(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })

      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    // First close mobile menu to avoid UI conflicts
    setIsMobileMenuOpen(false)
    
    // Small delay to ensure menu closes before scrolling
    setTimeout(() => {
      if (href === "#hero") {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        })
      } else {
        const element = document.querySelector(href)
        if (element) {
          const yOffset = -80; // Adjust this value as needed for proper offset
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          
          window.scrollTo({
            top: y,
            behavior: "smooth"
          })
        }
      }
      setActiveSection(href)
    }, 100)
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4">
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`max-w-5xl mx-auto rounded-full ${
            isScrolled 
              ? "bg-gray-900/80 backdrop-blur-lg shadow-lg border border-gray-800/50" 
              : "bg-gray-900/40 backdrop-blur-md"
          } relative`}
        >
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex-shrink-0"
              >
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  Devnex
                </span>
              </motion.div>

              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <div className="flex items-center space-x-8">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.name}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault()
                        scrollToSection(item.href)
                      }}
                      className={`px-3 py-2 text-sm font-medium transition-all duration-200 relative ${
                        activeSection === item.href
                          ? "text-white"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      {item.name}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-300 hover:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="absolute top-full left-0 right-0 w-full md:hidden bg-gray-900/95 backdrop-blur-lg rounded-b-2xl shadow-lg border border-gray-800/50 mt-2 overflow-hidden z-50"
              >
                <div className="px-4 pt-3 pb-4 space-y-2">
                  {navItems.map((item) => (
                    <motion.button
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onClick={() => scrollToSection(item.href)}
                      className={`block w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                        activeSection === item.href
                          ? "text-white bg-gray-800/70"
                          : "text-gray-300 hover:text-white hover:bg-gray-800/50 active:bg-gray-700/70"
                      }`}
                    >
                      {item.name}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-gray-900/80 hover:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg z-50 group border border-gray-800/50"
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp className="h-6 w-6 text-gray-400 group-hover:text-white transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
