import { useState } from 'react';
import { usePendingTheaters, useTheaters, useApproveTheater, useRejectTheater } from '@/hooks/use-theaters';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TheaterTable } from '@/components/theaters/theater-table';
import { CheckCircle, XCircle, MapPin, Phone, Mail, Clock } from 'lucide-react';
import type { Theater } from '@/types/theater';

export default function TheaterManagementPage() {
  const [activeTab, setActiveTab] = useState('pending');
  
  const { data: pendingTheaters = [], isLoading: isLoadingPending } = usePendingTheaters();
  const { data: allTheaters = [], isLoading: isLoadingAll } = useTheaters();
  const { mutate: approveTheater } = useApproveTheater();
  const { mutate: rejectTheater } = useRejectTheater();

  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setProcessingId(id);
    approveTheater(id, {
      onSettled: () => setProcessingId(null),
    });
  };

  const handleReject = (id: string) => {
    setProcessingId(id);
    rejectTheater({ id }, {
      onSettled: () => setProcessingId(null),
    });
  };

  const approvedCount = allTheaters.filter(t => t.approvalStatus === 'approved').length;

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Theater Management</h1>
          <p className="text-zinc-600">Review and manage theater approval requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600 mb-1">Total Theaters</p>
                <p className="text-3xl font-bold">{allTheaters.length}</p>
              </div>
              <div className="h-12 w-12 bg-zinc-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎭</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600 mb-1">Pending Requests</p>
                <p className="text-3xl font-bold text-amber-600">{pendingTheaters.length}</p>
              </div>
              <div className="h-12 w-12 bg-amber-50 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600 mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs>
          <TabsList className="mb-6">
            <TabsTrigger 
              active={activeTab === 'pending'}
              onClick={() => setActiveTab('pending')}
            >
              Pending Requests
              {pendingTheaters.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pendingTheaters.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              active={activeTab === 'all'}
              onClick={() => setActiveTab('all')}
            >
              All Theaters
            </TabsTrigger>
          </TabsList>

          {/* Pending Requests Tab */}
          {activeTab === 'pending' && (
            <TabsContent>
              {isLoadingPending ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-64 w-full" />
                  ))}
                </div>
              ) : pendingTheaters.length === 0 ? (
                <Card className="p-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-zinc-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Pending Requests</h3>
                    <p className="text-zinc-600">All theater requests have been reviewed</p>
                  </div>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pendingTheaters.map((theater) => (
                    <PendingTheaterCard
                      key={theater._id}
                      theater={theater}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      isProcessing={processingId === theater._id}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          )}

          {/* All Theaters Tab */}
          {activeTab === 'all' && (
            <TabsContent>
              <TheaterTable theaters={allTheaters} isLoading={isLoadingAll} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}

// Pending Theater Card Component
function PendingTheaterCard({
  theater,
  onApprove,
  onReject,
  isProcessing,
}: {
  theater: Theater;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isProcessing: boolean;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold">{theater.name}</h3>
            <Badge variant="secondary" className="bg-amber-50 text-amber-700">
              Pending Review
            </Badge>
          </div>
          <p className="text-zinc-600">{theater.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Location Info */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-zinc-500 uppercase">Location</h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-zinc-400 mt-0.5" />
              <div className="text-sm">
                <p>{theater.address}</p>
                <p className="text-zinc-600">{theater.city}, {theater.state} {theater.zipCode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-zinc-500 uppercase">Contact</h4>
          <div className="space-y-2">
            {(theater.phone || theater.contactNumber) && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-zinc-400" />
                <span className="text-sm">{theater.phone || theater.contactNumber}</span>
              </div>
            )}
            {theater.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-zinc-400" />
                <span className="text-sm">{theater.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Theater Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-zinc-50 rounded-lg">
        <div>
          <p className="text-xs text-zinc-500 mb-1">Screens</p>
          <p className="font-semibold">{theater.screens || 0}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 mb-1">Total Seats</p>
          <p className="font-semibold">{theater.capacity || 0}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 mb-1">Amenities</p>
          <p className="font-semibold">{theater.amenities?.length || 0}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 mb-1">Status</p>
          <Badge variant={theater.isActive ? 'default' : 'secondary'}>
            {theater.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      {/* Amenities */}
      {theater.amenities && theater.amenities.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-sm text-zinc-500 uppercase mb-2">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {theater.amenities.map((amenity, index) => (
              <Badge key={index} variant="outline">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Submission Date */}
      <div className="mb-6 text-sm text-zinc-500">
        <Clock className="h-4 w-4 inline mr-1" />
        Submitted {new Date(theater.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => onApprove(theater._id)}
          disabled={isProcessing}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Approve Theater
        </Button>
        <Button
          onClick={() => onReject(theater._id)}
          disabled={isProcessing}
          variant="outline"
          className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
        >
          <XCircle className="mr-2 h-4 w-4" />
          Reject
        </Button>
      </div>
    </Card>
  );
}
