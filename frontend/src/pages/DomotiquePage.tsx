import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Thermometer, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DomotiquePage() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
        <Thermometer className="h-16 w-16 text-zinc-600" />
        <h1 className="text-2xl font-bold text-zinc-50">
          Domotique
        </h1>
        <p className="text-sm text-zinc-500">
          Cette page arrive bientot
        </p>
        <Button asChild variant="outline" size="sm">
          <Link to="/" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour au dashboard
          </Link>
        </Button>
      </div>
    </motion.div>
  )
}
