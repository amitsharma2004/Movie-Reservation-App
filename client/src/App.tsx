import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import LoginPage from '@/pages/login';
import RegisterPage from '@/pages/register';
import HomePage from '@/pages/home';
import MoviesPage from '@/pages/movies';
import MovieDetailPage from '@/pages/movie-detail';
import ProfilePage from '@/pages/profile';
import TheatersPage from '@/pages/admin/theaters';
import NewTheaterPage from '@/pages/admin/theater-new';
import EditTheaterPage from '@/pages/admin/theater-edit';
import { GuestRoute } from '@/middleware/guest-route';
import { AdminRoute } from '@/middleware/admin-route';
import { ProtectedRoute } from '@/middleware/protected-route';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
          
          {/* Profile Route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route
            path="/admin/theaters"
            element={
              <AdminRoute>
                <TheatersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/theaters/new"
            element={
              <AdminRoute>
                <NewTheaterPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/theaters/:id/edit"
            element={
              <AdminRoute>
                <EditTheaterPage />
              </AdminRoute>
            }
          />
          
          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          
          <Route
            path="/register"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
