# Theater Logo Upload - TODO

## Current Status
✅ Logo field made optional with default value
✅ Default logo: `/default-theater-logo.png`
✅ Validation updated to not require logo
✅ User can create theater without uploading logo

## What Was Changed

### Backend Changes

**1. Theater Model** (`server/src/modules/threaters/threater.model.ts`)
```typescript
// Before
threaterLogo: {
    type: String,
    required: [true, 'Theater logo is required'],
}

// After
threaterLogo: {
    type: String,
    default: '/default-theater-logo.png',
}
```

**2. Theater Validation** (`server/src/modules/threaters/threater.validate.ts`)
```typescript
// Before
threaterLogo: Joi.string()
    .required()
    .uri()
    .messages({
        'string.empty': 'Theater logo is required',
        'any.required': 'Theater logo is required',
        'string.uri': 'Theater logo must be a valid URL'
    }),

// After
threaterLogo: Joi.string()
    .trim()
    .default('/default-theater-logo.png')
    .messages({
        'string.uri': 'Theater logo must be a valid URL'
    }),
```

### Frontend Changes

**Theater Onboarding Form** (`client/src/pages/theater-onboarding.tsx`)
- Removed `threaterLogo` from form submission
- Added informational message about logo upload coming soon
- Added TODO comment for future implementation

## Future Implementation

### Phase 1: Basic Image Upload

**Backend**:
1. Add multer middleware for image upload
2. Create upload endpoint: `POST /api/theaters/upload-logo/:id`
3. Store images in `server/uploads/theater-logos/`
4. Update theater document with logo path

**Frontend**:
1. Add file input field to theater onboarding form
2. Add image preview before upload
3. Implement drag-and-drop functionality
4. Show upload progress

### Phase 2: Cloud Storage (Recommended)

**Use Cloudinary** (already configured in project):
1. Upload directly to Cloudinary
2. Get secure URL
3. Store URL in database
4. Benefits:
   - CDN delivery
   - Image optimization
   - Automatic resizing
   - Better performance

### Phase 3: Image Management

**Features**:
1. Edit/replace logo
2. Image cropping tool
3. Multiple image sizes (thumbnail, full)
4. Image validation (size, format)
5. Default placeholder images

## Implementation Guide

### Step 1: Create Upload Endpoint

```typescript
// server/src/modules/threaters/threater.controller.ts
import { upload } from '../../config/multer.js';

const uploadTheaterLogo = AsyncHandler(async (req: any, res: Response) => {
    const authRequest = req as AuthRequest;
    const { id } = authRequest.params;
    
    if (!req.file) {
        throw new ApiError('No file uploaded', 400);
    }
    
    const logoPath = `/uploads/theater-logos/${req.file.filename}`;
    
    const theater = await theaterService.updateTheater(id, {
        threaterLogo: logoPath
    });
    
    res.status(200).json({
        success: true,
        message: 'Logo uploaded successfully',
        data: { theater }
    });
});
```

### Step 2: Add Route

```typescript
// server/src/modules/threaters/threater.route.ts
import { upload } from '../../config/multer.js';

ThreaterRouter.post(
    '/upload-logo/:id', 
    verifyToken, 
    upload.single('logo'), 
    uploadTheaterLogo
);
```

### Step 3: Update Multer Config

```typescript
// server/src/config/multer.ts
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/theater-logos';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'theater-logo-' + uniqueSuffix + path.extname(file.originalname));
    }
});
```

### Step 4: Frontend Component

```typescript
// client/src/components/theaters/logo-upload.tsx
import { useState } from 'react';
import { Upload } from 'lucide-react';

export function TheaterLogoUpload({ theaterId, onUploadSuccess }) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        
        setUploading(true);
        const formData = new FormData();
        formData.append('logo', file);

        try {
            const response = await api.post(
                `/theaters/upload-logo/${theaterId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            onUploadSuccess(response.data.data.theater);
            toast.success('Logo uploaded successfully');
        } catch (error) {
            toast.error('Failed to upload logo');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {preview ? (
                    <img src={preview} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded" />
                ) : (
                    <Upload className="mx-auto h-12 w-12 text-zinc-400" />
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-4"
                />
            </div>
            {file && (
                <Button onClick={handleUpload} disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload Logo'}
                </Button>
            )}
        </div>
    );
}
```

## Cloudinary Implementation (Recommended)

### Backend

```typescript
import { v2 as cloudinary } from 'cloudinary';

const uploadToCloudinary = async (file: Express.Multer.File) => {
    const result = await cloudinary.uploader.upload(file.path, {
        folder: 'theater-logos',
        transformation: [
            { width: 500, height: 500, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
        ]
    });
    return result.secure_url;
};

const uploadTheaterLogo = AsyncHandler(async (req: any, res: Response) => {
    const authRequest = req as AuthRequest;
    const { id } = authRequest.params;
    
    if (!req.file) {
        throw new ApiError('No file uploaded', 400);
    }
    
    const logoUrl = await uploadToCloudinary(req.file);
    
    const theater = await theaterService.updateTheater(id, {
        threaterLogo: logoUrl
    });
    
    res.status(200).json({
        success: true,
        message: 'Logo uploaded successfully',
        data: { theater }
    });
});
```

## Validation Rules

When implementing, add these validations:

```typescript
// File size limit
maxSize: 5 * 1024 * 1024, // 5MB

// Allowed formats
allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],

// Image dimensions
minWidth: 200,
minHeight: 200,
maxWidth: 2000,
maxHeight: 2000,
```

## Default Logo

Create a default theater logo image:
1. Place in `server/public/default-theater-logo.png`
2. Or use a placeholder service: `https://via.placeholder.com/500x500?text=Theater`
3. Or use an icon/SVG as default

## Testing Checklist

- [ ] Theater can be created without logo
- [ ] Default logo is assigned
- [ ] Logo upload endpoint works
- [ ] Image validation works
- [ ] File size limits enforced
- [ ] Preview shows before upload
- [ ] Upload progress indicator works
- [ ] Logo displays in theater list
- [ ] Logo displays in theater details
- [ ] Can update/replace logo
- [ ] Old logo is deleted when replaced

## Priority

**Priority**: Medium
**Estimated Time**: 4-6 hours
**Dependencies**: None (Cloudinary already configured)

## Notes

- Current implementation allows theaters to be created without logo
- Default logo path: `/default-theater-logo.png`
- Logo field is optional in validation
- No breaking changes to existing functionality
- Can be implemented incrementally

---

**Status**: ✅ Logo requirement removed, ready for future implementation
**Next Steps**: Implement image upload when ready
