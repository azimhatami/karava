import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { DarkModeProvider } from './context/DarkModeContext';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import Auth from './pages/Auth';
import CompleteProfile from './pages/CompleteProfile';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import OwnerDashboard from './pages/OwnerDashboard';
import Projects from './pages/Projects';
import Project from './pages/Project';
import AppLayout from './ui/AppLayout';
import OwnerLayout from './features/owner/OwnerLayout';
import FreelancerDashboard from './pages/FreelancerDashboard';
import Proposals from './pages/Proposals';
import SubmitedProjects from './pages/SubmitedProjects';
import FreelancerLayout from './features/freelancer/FreelancerLayout';
import ProtectedRoute from './ui/ProtectedRoute';
import './App.css'


// Create a client
const queryClient = new QueryClient();

function App() {


  return (
    <>
      <DarkModeProvider>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <Toaster />
          <Routes>
            <Route path='/auth' element={<Auth />} />
            <Route path='/complete-profile' element={<CompleteProfile />} />
            <Route 
              path='/owner' 
              element={
                <ProtectedRoute>
                  <OwnerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to='dashboard' replace />}/>
              <Route path='dashboard' element={<OwnerDashboard />}/>
              <Route path='projects' element={<Projects />}/>
              <Route path='projects/:id' element={<Project />}/>
            </Route>
            <Route 
              path='/freelancer' 
              element={
                <ProtectedRoute>
                  <FreelancerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to='dashboard' replace />}/>
              <Route path='dashboard' element={<FreelancerDashboard />} />
              <Route path='proposals' element={<Proposals />} />
              <Route path='projects' element={<SubmitedProjects />} />
            </Route>
            <Route path='/' element={<Home />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </QueryClientProvider>
      </DarkModeProvider>
    </>
  )
}

export default App
