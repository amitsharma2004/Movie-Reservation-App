import { useState, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  className?: string;
}

export function AvatarUpload({ onChange, error, className }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className="relative">
        <Avatar className="h-24 w-24">
          {preview ? (
            <AvatarImage src={preview} alt="Avatar preview" />
          ) : (
            <AvatarFallback className="bg-zinc-200">
              <Upload className="h-8 w-8 text-zinc-500" />
            </AvatarFallback>
          )}
        </Avatar>
        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="avatar-upload"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4 text-white"/>
          {preview ? 'Change Avatar' : 'Upload Avatar'}
        </Button>
        <p className="text-xs text-zinc-500">PNG, JPG up to 5MB</p>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
