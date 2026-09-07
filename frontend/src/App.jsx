import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { Routes, Route, Navigate } from 'react-router-dom';
import KaravaToaster from './ui/KaravaToaster';
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
import AdminLayout from './features/admin/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import Users from './pages/Users';
import Profile from './pages/Profile';
import ProjectDetails from './pages/ProjectDetails';
import Messages from './pages/Messages';
import { ProfileIncompleteHost } from './features/profile/ProfileIncompleteHost';
import './App.css'


// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
  },
});

function App() {


  return (
    <div className='min-h-screen bg-karava-bg-subtle'>
      <DarkModeProvider>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <KaravaToaster />
          <ProfileIncompleteHost />
          <Routes>
            <Route path='/auth' element={<Auth />} />
            <Route path='/complete-profile' element={<CompleteProfile />} />
            <Route path='/projects/:projectId' element={<ProjectDetails />} />
            <Route path='/' element={<Home />} />
            <Route 
              path='/admin' 
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to='dashboard' replace />}/>
              <Route path='dashboard' element={<AdminDashboard />}/>
              <Route path='users' element={<Users />}/>
              <Route path='proposals' element={<Proposals />}/>
              <Route path='projects' element={<SubmitedProjects />}/>
              <Route path='profile' element={<Profile />}/>
            </Route>
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
              <Route path='messages' element={<Messages basePath="/owner/messages" />}/>
              <Route path='messages/:conversationId' element={<Messages basePath="/owner/messages" />}/>
              <Route path='profile' element={<Profile />}/>
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
              <Route path='messages' element={<Messages basePath="/freelancer/messages" />}/>
              <Route path='messages/:conversationId' element={<Messages basePath="/freelancer/messages" />}/>
              <Route path='profile' element={<Profile />}/>
            </Route>
            <Route path='*' element={<NotFound />} />
          </Routes>
        </QueryClientProvider>
      </DarkModeProvider>
    </div>
  )
}

export default App
