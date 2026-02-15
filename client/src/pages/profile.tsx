import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  Loader2,
  Building2,
  Ticket,
  Heart,
  Settings,
  ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { ProfileUpdateData } from '@/types/auth';

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, getProfile, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const hasTheater = false; // TODO: Check if user owns a theater via API

  useEffect(() => {
    const fetchProfile = async () => {
      await getProfile();
      setIsLoading(false);
    };
    fetchProfile();
  }, [getProfile]);

  const {
    register,
    handleSubmit,
  } = useForm<ProfileUpdateData>({
    values: user ? {
      fullname: user.name || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      phone: user.phone || '',
      zipCode: user.zipCode || '',
      country: user.country || '',
    } : undefined,
  });

  const onSubmit = async (data: ProfileUpdateData) => {
    setIsUpdating(true);
    setError('');
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update profile';
      setError(message);
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddTheater = () => {
    navigate('/theater/onboarding', { state: { from: location.pathname } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="grid lg:grid-cols-4 gap-6">
            <Skeleton className="h-96" />
            <div className="lg:col-span-3 space-y-4">
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-zinc-600 mb-4">Unable to load your profile.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-zinc-600">Manage your personal information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-20 w-20">
                    {user.avatar && user.avatar !== 'default-avatar-url' ? (
                      <AvatarImage src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${user.avatar}`} alt={user.name} />
                    ) : (
                      <AvatarFallback className="text-xl">
                        <User className="h-10 w-10" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className="w-full">
                    <h2 className="text-lg font-semibold">{user.name}</h2>
                    <p className="text-xs text-zinc-500 flex items-center justify-center gap-1 mt-1">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </p>
                  </div>

                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role === 'admin' ? 'Administrator' : 'User'}
                  </Badge>

                  {user.isVerified && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Verified
                    </Badge>
                  )}

                  {user.createdAt && (
                    <div className="text-xs text-zinc-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Member since {format(new Date(user.createdAt), 'MMM yyyy')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Navigation Menu */}
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-1">
                  <button
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md bg-zinc-100 text-zinc-900"
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </div>
                  </button>
                  
                  <button
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors"
                    onClick={() => toast.info('Coming soon!')}
                  >
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4" />
                      <span>My Bookings</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  
                  <button
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors"
                    onClick={() => toast.info('Coming soon!')}
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      <span>Watchlist</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  
                  <button
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors"
                    onClick={() => toast.info('Coming soon!')}
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              </CardContent>
            </Card>

            {/* Add Your Theater CTA - Only show if user doesn't have a theater */}
            {!hasTheater && (
              <Card className="border-2 border-zinc-900 bg-zinc-900 text-white">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6" />
                      </div>
                    </div>
                    
                    <div className="text-center space-y-2">
                      <h3 className="font-semibold text-lg">Own a Theater?</h3>
                      <p className="text-sm text-zinc-300">
                        List your venue and start selling tickets to millions of movie lovers
                      </p>
                    </div>

                    <Button 
                      onClick={handleAddTheater}
                      className="w-full bg-white text-zinc-900 hover:bg-zinc-100"
                    >
                      <Building2 className="mr-2 h-4 w-4" />
                      Add Your Theater
                    </Button>

                    <p className="text-xs text-zinc-400 text-center">
                      Free to list • Easy setup • Start earning
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                      {error}
                    </div>
                  )}
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullname">Full Name</Label>
                      <Input
                        id="fullname"
                        {...register('fullname')}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        {...register('phone')}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Address Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      {...register('address')}
                      placeholder="Enter your street address"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        {...register('city')}
                        placeholder="Enter city"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        {...register('state')}
                        placeholder="Enter state"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input
                        id="zipCode"
                        {...register('zipCode')}
                        placeholder="Enter zip code"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        {...register('country')}
                        placeholder="Enter country"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" disabled={isUpdating} className="w-full">
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Profile'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
