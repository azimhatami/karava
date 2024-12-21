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
import CompleteProfile from './pages/CompleteProfile';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Owner from './pages/Owner';
import AppLayout from './ui/AppLayout';
import './App.css'


// Create a client
const queryClient = new QueryClient();

function App() {


  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <Routes>
          <Route path='/auth' element={<Auth />} />
          <Route path='/complete-profile' element={<CompleteProfile />} />
          <Route element={<AppLayout />}>
            <Route path='/owner' element={<Owner />}/>
          </Route>
          <Route path='/' element={<Home />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </QueryClientProvider>
    </>
  )
}

export default App
