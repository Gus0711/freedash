import { Outlet } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Sidebar from "./Sidebar"
import Header from "./Header"
import AuroraBackground from "@/components/dashboard/AuroraBackground"

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <AuroraBackground />
        <Header />
        <main className="relative flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            <AnimatePresence mode="wait">
              <Outlet />
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}
