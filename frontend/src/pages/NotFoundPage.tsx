import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
        <h1 className="text-7xl font-extrabold text-zinc-700">
          404
        </h1>
        <p className="text-lg text-zinc-400">
          Page non trouvee
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
