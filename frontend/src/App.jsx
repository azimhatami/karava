import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Auth from './pages/Auth';
import './App.css'


// Create a client
const queryClient = new QueryClient();

function App() {


  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <div className='container xl:max-w-screen-xl'>
          <Routes>
            <Route path='/auth' element={<Auth />} />
          </Routes>
        </div>
      </QueryClientProvider>
    </>
  )
}

export default App
