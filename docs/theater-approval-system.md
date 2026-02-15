# Theater Approval System - Implementation Guide

## Overview
Implemented a complete theater approval workflow where users can submit theaters for review, admins can approve/reject them, and a cron job automatically cleans up unaccepted theaters daily.

## Changes Made

### 1. Theater Model Updates

**File**: `server/src/modules/threaters/threater.model.ts`

**New Fields Added**:
```typescript
ownerId: mongoose.Types.ObjectId;           // User who created the theater
approvalStatus: 'pending' | 'approved' | 'rejected';  // Approval status
approvedBy?: mongoose.Types.ObjectId;       // Admin who approved
approvedAt?: Date;                          // Approval timestamp
rejectedAt?: Date;                          // Rejection timestamp
rejectionReason?: string;                   // Reason for rejection
```

**New Indexes**:
- `{ ownerId: 1, approvalStatus: 1 }` - For owner's theater queries
- `{ city: 1, isActive: 1, approvalStatus: 1 }` - For filtered queries

### 2. Theater Routes Updates

**File**: `server/src/modules/threaters/threater.route.ts`

**Changed**:
- `POST /create` - Removed `verifyAdmin`, now uses `verifyToken` (any authenticated user)

**New Routes**:
```typescript
GET    /api/theaters/pending        // Get pending theaters (Admin only)
PUT    /api/theaters/approve/:id    // Approve theater (Admin only)
PUT    /api/theaters/reject/:id     // Reject theater (Admin only)
```

### 3. Theater Controller Updates

**File**: `server/src/modules/threaters/threater.controller.ts`

**Modified Functions**:
- `createTheater` - Now sets `ownerId` and `approvalStatus: 'pending'`

**New Functions**:
```typescript
getPendingTheaters()   // Fetch all pending theaters
approveTheater()       // Approve a theater
rejectTheater()        // Reject a theater with optional reason
```

### 4. Theater Service Updates

**File**: `server/src/modules/threaters/threater.service.ts`

**Modified Functions**:
- `getAllTheaters` - Only returns approved theaters
- `searchTheaters` - Only searches approved theaters

**New Functions**:
```typescript
getPendingTheaters()           // Get theaters with status 'pending'
approveTheater(id, adminId)    // Set status to 'approved'
rejectTheater(id, reason)      // Set status to 'rejected'
deleteUnacceptedTheaters()     // Delete pending/rejected theaters older than 24h
```

### 5. Cron Job Implementation

**File**: `server/src/utils/cron.ts`

**Features**:
- Runs daily at 11:59 PM (configurable timezone)
- Deletes theaters with status 'pending' or 'rejected' that are older than 24 hours
- Logs all operations for monitoring

**Cron Expression**: `'59 23 * * *'` (11:59 PM every day)

### 6. Server Initialization

**File**: `server/index.ts`

**Added**:
```typescript
import { initializeCronJobs } from './src/utils/cron.js';
initializeCronJobs(); // Start cron jobs on server start
```

---

## API Endpoints

### User Endpoints

#### Create Theater (Authenticated Users)
```
POST /api/theaters/create
Headers: Authorization: Bearer <token>
Body: {
  name: string,
  address: string,
  city: string,
  state: string,
  zipCode: string,
  country: string,
  screens: number,
  capacity: number,
  contactNumber: string,
  email: string,
  description: string,
  location: string,
  threaterLogo: string
}
Response: {
  success: true,
  message: "Theater submitted for approval. Admin will review your request.",
  data: { theater }
}
```

### Admin Endpoints

#### Get Pending Theaters
```
GET /api/theaters/pending
Headers: Authorization: Bearer <admin_token>
Response: {
  success: true,
  data: {
    theaters: [...],
    count: number
  }
}
```

#### Approve Theater
```
PUT /api/theaters/approve/:id
Headers: Authorization: Bearer <admin_token>
Response: {
  success: true,
  message: "Theater approved successfully",
  data: { theater }
}
```

#### Reject Theater
```
PUT /api/theaters/reject/:id
Headers: Authorization: Bearer <admin_token>
Body: {
  reason: string (optional)
}
Response: {
  success: true,
  message: "Theater rejected",
  data: { theater }
}
```

### Public Endpoints

#### Get All Theaters (Only Approved)
```
GET /api/theaters/getall
Response: Only returns theaters with approvalStatus: 'approved'
```

#### Search Theaters (Only Approved)
```
GET /api/theaters/search?q=searchTerm
Response: Only returns approved theaters matching search
```

---

## User Flow

### Theater Owner Flow

```
1. User registers/logs in
2. User navigates to profile
3. User clicks "Add Your Theater"
4. User fills theater onboarding form
5. User submits form
   ↓
6. Theater created with status: 'pending'
7. User sees success message: "Theater submitted for approval"
8. User waits for admin review
```

### Admin Flow

```
1. Admin logs in
2. Admin navigates to admin dashboard
3. Admin sees "Pending Requests" section
4. Admin reviews theater details
5. Admin decides:
   
   Option A: Approve
   - Click "Approve" button
   - Theater status → 'approved'
   - Theater appears in public listings
   - Owner can manage theater
   
   Option B: Reject
   - Click "Reject" button
   - Optionally add rejection reason
   - Theater status → 'rejected'
   - Theater will be deleted at 11:59 PM
```

### Automatic Cleanup Flow

```
Every day at 11:59 PM:
1. Cron job runs
2. Finds theaters where:
   - approvalStatus is 'pending' OR 'rejected'
   - createdAt is older than 24 hours
3. Deletes these theaters
4. Logs deletion count
```

---

## Database Schema

### Theater Document Example

```javascript
{
  _id: ObjectId("..."),
  name: "AMC Empire 25",
  location: "New York, NY",
  address: "234 W 42nd St",
  city: "New York",
  state: "NY",
  zipCode: "10036",
  country: "USA",
  capacity: 5000,
  screens: 25,
  threaterLogo: "/uploads/theater-logo.png",
  contactNumber: "+1234567890",
  email: "contact@amcempire.com",
  description: "Premium movie theater...",
  isActive: true,
  
  // New fields
  ownerId: ObjectId("user_id"),
  approvalStatus: "pending",  // or "approved" or "rejected"
  approvedBy: ObjectId("admin_id"),  // Set when approved
  approvedAt: ISODate("2024-02-15T10:30:00Z"),
  rejectedAt: null,
  rejectionReason: null,
  
  createdAt: ISODate("2024-02-15T08:00:00Z"),
  updatedAt: ISODate("2024-02-15T10:30:00Z")
}
```

---

## Installation Steps

### 1. Install Dependencies

```bash
cd server
npm install node-cron @types/node-cron
```

### 2. Run Database Migration (Optional)

If you have existing theaters, update them:

```javascript
// Run this in MongoDB shell or create a migration script
db.threaters.updateMany(
  { approvalStatus: { $exists: false } },
  { 
    $set: { 
      approvalStatus: 'approved',  // Existing theaters auto-approved
      ownerId: ObjectId("admin_user_id")  // Set to admin or owner
    } 
  }
);
```

### 3. Start Server

```bash
npm run dev
```

You should see in logs:
```
Theater cleanup cron job scheduled (runs daily at 11:59 PM)
All cron jobs initialized
```

---

## Configuration

### Cron Job Timezone

Edit `server/src/utils/cron.ts`:

```typescript
cron.schedule('59 23 * * *', async () => {
  // ...
}, {
  timezone: 'Asia/Kolkata'  // Change to your timezone
});
```

**Common Timezones**:
- `'America/New_York'` - EST/EDT
- `'America/Los_Angeles'` - PST/PDT
- `'Europe/London'` - GMT/BST
- `'Asia/Kolkata'` - IST
- `'UTC'` - Universal Time

### Cleanup Interval

To change when unaccepted theaters are deleted:

```typescript
// In threater.service.ts -> deleteUnacceptedTheaters()
const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);  // 24 hours
// Change to:
const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);  // 48 hours
```

---

## Testing

### Test Theater Creation

```bash
curl -X POST http://localhost:3000/api/theaters/create \
  -H "Authorization: Bearer <user_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Theater",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "screens": 5,
    "capacity": 500,
    "contactNumber": "+1234567890",
    "email": "test@theater.com",
    "location": "New York, NY",
    "threaterLogo": "/default-logo.png"
  }'
```

### Test Get Pending Theaters

```bash
curl -X GET http://localhost:3000/api/theaters/pending \
  -H "Authorization: Bearer <admin_token>"
```

### Test Approve Theater

```bash
curl -X PUT http://localhost:3000/api/theaters/approve/<theater_id> \
  -H "Authorization: Bearer <admin_token>"
```

### Test Reject Theater

```bash
curl -X PUT http://localhost:3000/api/theaters/reject/<theater_id> \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Incomplete information"}'
```

### Test Cron Job Manually

Add this to `server/src/utils/cron.ts` for testing:

```typescript
// Run immediately for testing
export const runCleanupNow = async () => {
  const deletedCount = await deleteUnacceptedTheaters();
  logger.info(`Manual cleanup: Deleted ${deletedCount} theaters`);
};
```

Then call it from a test endpoint or console.

---

## Monitoring

### Check Cron Job Logs

```bash
# In server logs, look for:
"Theater cleanup cron job scheduled (runs daily at 11:59 PM)"
"Running scheduled theater cleanup job..."
"Theater cleanup completed. Deleted X unaccepted theaters."
```

### Monitor Pending Theaters

```bash
# Query MongoDB directly
db.threaters.find({ approvalStatus: 'pending' }).count()
```

### Check Approval Stats

```bash
# Get approval statistics
db.threaters.aggregate([
  {
    $group: {
      _id: "$approvalStatus",
      count: { $sum: 1 }
    }
  }
])
```

---

## Security Considerations

1. **Owner Verification**: Only theater owners can see their own pending theaters
2. **Admin Only**: Approval/rejection requires admin role
3. **Audit Trail**: All approvals tracked with adminId and timestamp
4. **Automatic Cleanup**: Prevents database bloat from abandoned submissions
5. **Rejection Reasons**: Helps users understand why theater was rejected

---

## Future Enhancements

1. **Email Notifications**:
   - Notify owner when theater is approved
   - Notify owner when theater is rejected
   - Send reminder before automatic deletion

2. **Owner Dashboard**:
   - View own theaters (pending, approved, rejected)
   - Resubmit rejected theaters
   - Edit pending theaters

3. **Admin Dashboard**:
   - Bulk approve/reject
   - Filter by city, date, owner
   - Export pending theaters list

4. **Analytics**:
   - Track approval rates
   - Average approval time
   - Rejection reasons statistics

---

## Troubleshooting

### Cron Job Not Running

**Check**:
1. Server is running continuously
2. Timezone is correct
3. Check server logs for cron initialization message

**Solution**:
```bash
# Verify cron is scheduled
# Should see: "Theater cleanup cron job scheduled"
```

### Theaters Not Being Deleted

**Check**:
1. Cron job is running (check logs at 11:59 PM)
2. Theaters are older than 24 hours
3. Theaters have status 'pending' or 'rejected'

**Manual Cleanup**:
```javascript
// Run in MongoDB shell
db.threaters.deleteMany({
  approvalStatus: { $in: ['pending', 'rejected'] },
  createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
})
```

### Admin Can't See Pending Theaters

**Check**:
1. User has role: 'admin'
2. Authorization header is correct
3. Theaters exist with status 'pending'

---

## Summary

✅ Users can submit theaters without admin approval
✅ Theaters start with 'pending' status
✅ Admins can approve/reject from dashboard
✅ Only approved theaters appear in public listings
✅ Automatic cleanup runs daily at 11:59 PM
✅ Unaccepted theaters deleted after 24 hours
✅ Complete audit trail maintained

**Status**: Ready for deployment
**Next Steps**: Install node-cron package and test the flow
