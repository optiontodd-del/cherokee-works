import { createRootRoute, Outlet } from '@tanstack/react-router'

function RootLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Outlet />
    </div>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
