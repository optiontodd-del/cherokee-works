import React, { useMemo } from 'react'
import { RouterProvider } from '@tanstack/react-router'
import { getRouter } from '../routes/-router'

export function Router() {
  const router = useMemo(() => getRouter(), [])
  return <RouterProvider router={router} />
}
