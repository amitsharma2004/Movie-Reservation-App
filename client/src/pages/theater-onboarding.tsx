import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Building2, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface TheaterFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  screens: number;
  capacity: number;
  contactNumber: string;
  email: string;
  description: string;
}

export default function TheaterOnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TheaterFormData>({
    defaultValues: {
      country: 'India',
      screens: 1,
      capacity: 100,
    },
  });

  const onSubmit = async (data: TheaterFormData) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      // TODO: Add image upload for theater logo
      await api.post('/theaters/create', {
        ...data,
        location: `${data.city}, ${data.state}`,
        isActive: true,
      });
      
      toast.success('Theater added successfully!');
      
      // Navigate back to where user came from or to profile
      const from = (location.state as any)?.from || '/profile';
      navigate(from);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to add theater';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    const from = (location.state as any)?.from || '/profile';
    navigate(from);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-zinc-900 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Add Your Theater</h1>
          <p className="text-zinc-600">
            Fill in the details below to list your theater and start selling tickets
          </p>
        </div>

        {/* Benefits Section */}
        <Card className="mb-8 border-zinc-200">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-1">Free to List</h3>
                <p className="text-sm text-zinc-600">No upfront costs or hidden fees</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-1">Easy Setup</h3>
                <p className="text-sm text-zinc-600">Get started in just 5 minutes</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-1">Reach Millions</h3>
                <p className="text-sm text-zinc-600">Connect with movie lovers nationwide</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theater Information</CardTitle>
              <CardDescription>Basic details about your theater</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Theater Name *</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Theater name is required' })}
                  placeholder="e.g., AMC Empire 25"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  {...register('description')}
                  placeholder="Brief description of your theater"
                />
              </div>

              {/* TODO: Add theater logo upload functionality */}
              <div className="rounded-md bg-zinc-100 p-3 text-sm text-zinc-600">
                <p className="font-medium mb-1">📸 Theater Logo Upload</p>
                <p>Image upload feature coming soon. A default logo will be used for now.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="screens">Number of Screens *</Label>
                  <Input
                    id="screens"
                    type="number"
                    min="1"
                    {...register('screens', { 
                      required: 'Number of screens is required',
                      min: { value: 1, message: 'Must have at least 1 screen' }
                    })}
                  />
                  {errors.screens && (
                    <p className="text-sm text-red-600">{errors.screens.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Total Capacity *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    {...register('capacity', { 
                      required: 'Capacity is required',
                      min: { value: 1, message: 'Capacity must be at least 1' }
                    })}
                  />
                  {errors.capacity && (
                    <p className="text-sm text-red-600">{errors.capacity.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
              <CardDescription>Where is your theater located?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  {...register('address', { required: 'Address is required' })}
                  placeholder="e.g., 234 W 42nd St"
                />
                {errors.address && (
                  <p className="text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    {...register('city', { required: 'City is required' })}
                    placeholder="e.g., New York"
                  />
                  {errors.city && (
                    <p className="text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    {...register('state', { required: 'State is required' })}
                    placeholder="e.g., NY"
                  />
                  {errors.state && (
                    <p className="text-sm text-red-600">{errors.state.message}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code *</Label>
                  <Input
                    id="zipCode"
                    {...register('zipCode', { required: 'Zip code is required' })}
                    placeholder="e.g., 10036"
                  />
                  {errors.zipCode && (
                    <p className="text-sm text-red-600">{errors.zipCode.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    {...register('country', { required: 'Country is required' })}
                    placeholder="e.g., India"
                  />
                  {errors.country && (
                    <p className="text-sm text-red-600">{errors.country.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How can customers reach you?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  {...register('contactNumber', { required: 'Contact number is required' })}
                  placeholder="e.g., +1234567890"
                />
                {errors.contactNumber && (
                  <p className="text-sm text-red-600">{errors.contactNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address'
                    }
                  })}
                  placeholder="e.g., contact@theater.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Building2 className="mr-2 h-4 w-4" />
                  Add Theater
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
