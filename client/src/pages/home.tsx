import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Film, Building2 } from 'lucide-react';

export default function HomePage() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Welcome to Movie Reservation</h1>
          <p className="text-zinc-600">Book your favorite movies online</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/movies')}>
              <Film className="mr-2 h-4 w-4" />
              Browse Movies
            </Button>
            <Button onClick={() => navigate('/login')}>Login</Button>
            <Button variant="outline" onClick={() => navigate('/register')}>
              Register
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>Movie Reservation</h1>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/movies')}>
              <Film className="mr-2 h-4 w-4" />
              Movies
            </Button>
            
            {user?.role === 'admin' && (
              <Button variant="ghost" onClick={() => navigate('/admin/theaters')}>
                <Building2 className="mr-2 h-4 w-4" />
                Theaters
              </Button>
            )}
            
            <div 
              className="flex items-center gap-3 cursor-pointer hover:bg-zinc-100 rounded-lg p-2 transition-colors"
              onClick={() => navigate('/profile')}
            >
              <Avatar className="h-10 w-10">
                {user?.avatar && user.avatar !== 'default-avatar-url' ? (
                  <AvatarImage src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${user.avatar}`} alt={user.name} />
                ) : (
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{user?.name}</p>
                <p className="text-zinc-500">{user?.email}</p>
              </div>
            </div>
            
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-zinc-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome back, {user?.name}!</h2>
          <p className="text-zinc-600 mb-4">
            You are logged in as {user?.role === 'admin' ? 'an Administrator' : 'a User'}.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/movies')}>
              <Film className="mr-2 h-4 w-4" />
              Browse Movies
            </Button>
            {user?.role === 'admin' && (
              <Button variant="outline" onClick={() => navigate('/admin/theaters')}>
                <Building2 className="mr-2 h-4 w-4" />
                Manage Theaters
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}