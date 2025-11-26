import React, { useRef, useState } from 'react';
import { Camera, Upload, RefreshCw } from 'lucide-react';

interface Props {
  onImageSelected: (base64: string) => void;
  currentImage: string | null;
  onClear: () => void;
}

export const ImageUpload: React.FC<Props> = ({ onImageSelected, currentImage, onClear }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelected(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  if (currentImage) {
    return (
      <div className="relative group w-full aspect-[3/4] md:aspect-square bg-ink-800 rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
        <img 
          src={currentImage} 
          alt="Hand preview" 
          className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-75"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
          <button 
            onClick={onClear}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full backdrop-blur-md border border-white/20 flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <RefreshCw className="w-4 h-4" />
            Change Photo
          </button>
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-xs text-white/70 bg-black/50 p-2 rounded backdrop-blur-md">
                We'll identify scars and contours automatically.
            </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`
        relative w-full aspect-[3/4] md:aspect-square rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 text-center cursor-pointer
        ${isDragging ? 'border-skin-500 bg-skin-500/10' : 'border-gray-700 hover:border-gray-500 bg-ink-800'}
      `}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={inputRef} 
        onChange={onChange}
      />
      
      <div className="w-16 h-16 rounded-full bg-ink-900 flex items-center justify-center mb-4 border border-gray-700 shadow-inner">
        <Camera className="w-8 h-8 text-skin-500" />
      </div>
      
      <h3 className="text-lg font-serif mb-2 text-gray-200">Upload Hand Photo</h3>
      <p className="text-sm text-gray-500 max-w-[200px] mb-6">
        Drag & drop or click to upload. Ensure good lighting for scar visibility.
      </p>

      <button className="text-xs flex items-center gap-2 text-skin-500 border border-skin-500/30 px-4 py-2 rounded-full hover:bg-skin-500/10 transition-colors">
        <Upload className="w-3 h-3" />
        Select File
      </button>
    </div>
  );
};