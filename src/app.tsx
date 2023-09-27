import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './routes'
import { RouterProvider } from 'react-router-dom'

export default function App() {
  // Create a client
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withGlobalStyles withNormalizeCSS
      >
        <RouterProvider router={router} />
      </MantineProvider>
    </QueryClientProvider>
  )
}