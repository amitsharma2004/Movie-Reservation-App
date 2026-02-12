import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { Theater, TheaterFormData } from '@/types/theater';

const theaterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  location: z.string().min(2, 'Location is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Zip code must be at least 5 characters'),
  country: z.string().min(2, 'Country is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  screens: z.number().min(1, 'Must have at least 1 screen'),
  amenities: z.array(z.string()).optional(),
  isActive: z.boolean(),
  threaterLogo: z.string().url('Must be a valid URL'),
  contactNumber: z.string().optional(),
  email: z.string().email('Must be a valid email').optional().or(z.literal('')),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
  parkingAvailable: z.boolean().optional(),
  foodCourtAvailable: z.boolean().optional(),
});

interface TheaterFormProps {
  theater?: Theater;
  onSubmit: (data: TheaterFormData) => void;
  isLoading?: boolean;
}

export function TheaterForm({ theater, onSubmit, isLoading }: TheaterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TheaterFormData>({
    resolver: zodResolver(theaterSchema),
    defaultValues: theater ? {
      name: theater.name,
      location: theater.location,
      address: theater.address,
      city: theater.city,
      state: theater.state,
      zipCode: theater.zipCode,
      country: theater.country,
      capacity: theater.capacity,
      screens: theater.screens,
      amenities: theater.amenities || [],
      isActive: theater.isActive,
      threaterLogo: theater.threaterLogo,
      contactNumber: theater.contactNumber || '',
      email: theater.email || '',
      description: theater.description || '',
      parkingAvailable: theater.parkingAvailable || false,
      foodCourtAvailable: theater.foodCourtAvailable || false,
    } : {
      country: 'India',
      isActive: true,
      parkingAvailable: false,
      foodCourtAvailable: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Theater Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter theater name"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="e.g., Downtown, Mall Road"
              />
              {errors.location && (
                <p className="text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              {...register('address')}
              placeholder="Enter full address"
            />
            {errors.address && (
              <p className="text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                {...register('city')}
                placeholder="Enter city"
              />
              {errors.city && (
                <p className="text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                {...register('state')}
                placeholder="Enter state"
              />
              {errors.state && (
                <p className="text-sm text-red-600">{errors.state.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code *</Label>
              <Input
                id="zipCode"
                {...register('zipCode')}
                placeholder="Enter zip code"
              />
              {errors.zipCode && (
                <p className="text-sm text-red-600">{errors.zipCode.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              {...register('country')}
              placeholder="Enter country"
            />
            {errors.country && (
              <p className="text-sm text-red-600">{errors.country.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Theater Details</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                {...register('capacity', { valueAsNumber: true })}
                placeholder="Total seating capacity"
              />
              {errors.capacity && (
                <p className="text-sm text-red-600">{errors.capacity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="screens">Number of Screens *</Label>
              <Input
                id="screens"
                type="number"
                {...register('screens', { valueAsNumber: true })}
                placeholder="Number of screens"
              />
              {errors.screens && (
                <p className="text-sm text-red-600">{errors.screens.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="threaterLogo">Theater Logo URL *</Label>
            <Input
              id="threaterLogo"
              {...register('threaterLogo')}
              placeholder="https://example.com/logo.png"
            />
            {errors.threaterLogo && (
              <p className="text-sm text-red-600">{errors.threaterLogo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              {...register('description')}
              placeholder="Enter theater description"
              className="flex min-h-[80px] w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                {...register('contactNumber')}
                placeholder="Enter contact number"
              />
              {errors.contactNumber && (
                <p className="text-sm text-red-600">{errors.contactNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="theater@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Facilities</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="parkingAvailable"
                {...register('parkingAvailable')}
                className="h-4 w-4 rounded border-zinc-300"
              />
              <Label htmlFor="parkingAvailable" className="cursor-pointer">
                Parking Available
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="foodCourtAvailable"
                {...register('foodCourtAvailable')}
                className="h-4 w-4 rounded border-zinc-300"
              />
              <Label htmlFor="foodCourtAvailable" className="cursor-pointer">
                Food Court Available
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                {...register('isActive')}
                className="h-4 w-4 rounded border-zinc-300"
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Active Status
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            theater ? 'Update Theater' : 'Create Theater'
          )}
        </Button>
      </div>
    </form>
  );
}
