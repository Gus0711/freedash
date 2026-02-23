import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"
import AppLayout from "@/components/layout/AppLayout"
import DashboardPage from "@/pages/DashboardPage"
import DistantPage from "@/pages/DistantPage"
import LocalPage from "@/pages/LocalPage"
import AdminPage from "@/pages/AdminPage"
import StatsPage from "@/pages/StatsPage"
import DomotiquePage from "@/pages/DomotiquePage"
import BookmarksPage from "@/pages/BookmarksPage"
import LogsPage from "@/pages/LogsPage"
import NotFoundPage from "@/pages/NotFoundPage"

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/distant", element: <DistantPage /> },
      { path: "/local", element: <LocalPage /> },
      { path: "/admin", element: <AdminPage /> },
      { path: "/stats", element: <StatsPage /> },
      { path: "/domotique", element: <DomotiquePage /> },
      { path: "/bookmarks", element: <BookmarksPage /> },
      { path: "/logs", element: <LogsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return (
    <TooltipProvider>
      <RouterProvider router={router} />
    </TooltipProvider>
  )
}
