import { motion } from "framer-motion"
import ServiceCard from "./ServiceCard"
import type { Service, UrlField } from "@/lib/types"

interface ServiceGridProps {
  services: Service[]
  urlField: UrlField
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function ServiceGrid({ services, urlField }: ServiceGridProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {services.map((service) => (
        <motion.div key={service.id} variants={item}>
          <ServiceCard service={service} urlField={urlField} />
        </motion.div>
      ))}
    </motion.div>
  )
}
