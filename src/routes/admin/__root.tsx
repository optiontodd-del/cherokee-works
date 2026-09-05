import { createFileRoute, Outlet } from '@tanstack/react-router'
import AdminLayout from './-layout'

function AdminRoot() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}

export const Route = createFileRoute('/admin/__root')({
  component: AdminRoot,
})
