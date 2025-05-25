import { Brain, Code, Cog, Database } from "lucide-react"

export default function ServicesSection() {
  const services = [
    {
      icon: Brain,
      title: "AI/ML Solutions",
      description:
        "Advanced machine learning models and AI systems that learn, adapt, and deliver intelligent insights for your business needs.",
    },
    {
      icon: Code,
      title: "Software Development",
      description:
        "Custom software solutions built with modern technologies, scalable architecture, and user-centric design principles.",
    },
    {
      icon: Cog,
      title: "Smart Systems & Automation",
      description:
        "Intelligent automation systems that streamline processes, reduce manual work, and increase operational efficiency.",
    },
    {
      icon: Database,
      title: "Data-Driven Applications",
      description:
        "Powerful applications that harness the power of data analytics to drive informed decision-making and business growth.",
    },
  ]

  return (
    <section id="services" className="py-20 bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We deliver cutting-edge technology solutions that drive innovation and transform businesses across
            industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mb-6 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                <service.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
              <p className="text-gray-400 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
