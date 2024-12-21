import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Auth from './pages/Auth';
import CompleteProfile from './pages/CompleteProfile';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import OwnerDashboard from './pages/OwnerDashboard';
import Projects from './pages/Projects';
import Project from './pages/Project';
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
          <Route path='/owner' element={<AppLayout />}>
            <Route index element={<Navigate to='dashboard' />}/>
            <Route path='dashboard' element={<OwnerDashboard />}/>
            <Route path='projects' element={<Projects />}/>
            <Route path='projects/:id' element={<Project />}/>
          </Route>
          <Route path='/' element={<Home />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </QueryClientProvider>
    </>
  )
}

export default App
