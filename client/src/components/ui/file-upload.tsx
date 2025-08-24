import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Upload, Image } from 'lucide-react';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: Record<string, string[]>;
  className?: string;
}

export function FileUpload({
  onFilesChange,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
    setFiles(newFiles);
    onFilesChange(newFiles);

    // Generate previews
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews].slice(0, maxFiles));
  }, [files, maxFiles, onFilesChange]);

  const removeFile = useCallback((index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    // Cleanup preview URL
    if (previews[index]) {
      URL.revokeObjectURL(previews[index]);
    }
    
    setFiles(newFiles);
    setPreviews(newPreviews);
    onFilesChange(newFiles);
  }, [files, previews, onFilesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: maxFiles - files.length,
  });

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop zone */}
      <Card
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 transition-colors cursor-pointer',
          isDragActive && 'border-blue-400 bg-blue-400/10',
          files.length >= maxFiles && 'opacity-50 cursor-not-allowed'
        )}
        data-testid="file-upload-dropzone"
      >
        <input {...getInputProps()} data-testid="file-upload-input" />
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        {isDragActive ? (
          <p className="text-blue-400 font-medium">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-gray-300 mb-2">Drag and drop images here, or click to browse</p>
            <p className="text-sm text-gray-500">
              Maximum {maxFiles} images, {Math.round(maxSize / 1024 / 1024)}MB each
            </p>
          </div>
        )}
      </Card>

      {/* File previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <Card className="p-2 bg-white/5 border-white/10">
                {previews[index] ? (
                  <img
                    src={previews[index]}
                    alt={file.name}
                    className="w-full h-24 object-cover rounded"
                    data-testid={`file-preview-${index}`}
                  />
                ) : (
                  <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center">
                    <Image className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <p className="text-xs text-gray-300 mt-2 truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(index)}
                  data-testid={`remove-file-${index}`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Card>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <p className="text-sm text-gray-400">
          {files.length} of {maxFiles} files selected
        </p>
      )}
    </div>
  );
}
