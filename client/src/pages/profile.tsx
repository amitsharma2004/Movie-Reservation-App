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
import { ArrowLeft, User, Mail, Calendar, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { ProfileUpdateData } from '@/types/auth';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, getProfile, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="grid md:grid-cols-3 gap-6">
            <Skeleton className="h-64" />
            <div className="md:col-span-2 space-y-4">
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
          <p className="text-zinc-600">Manage your personal information</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24">
                  {user.avatar && user.avatar !== 'default-avatar-url' ? (
                    <AvatarImage src={`http://localhost:3000${user.avatar}`} alt={user.name} />
                  ) : (
                    <AvatarFallback className="text-2xl">
                      <User className="h-12 w-12" />
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className="w-full">
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-sm text-zinc-500 flex items-center justify-center gap-1 mt-1">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </p>
                </div>

                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role === 'admin' ? 'Administrator' : 'User'}
                </Badge>

                {user.isVerified && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Verified Account
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

          {/* Profile Form */}
          <div className="md:col-span-2 space-y-6">
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
                      placeholder="Enter phone number (10-15 digits)"
                    />
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
