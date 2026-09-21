import React, { useRef, useState } from "react";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";
import { Button } from "./button";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Hanya file gambar yang diizinkan");
      return;
    }
    
    // Convert to base64 for local storage mocking
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="w-full">
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
      
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-slate-200 group bg-slate-50">
          <img src={value} alt="Uploaded" className="w-full h-40 object-contain" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
              Ganti
            </Button>
            <Button type="button" variant="destructive" size="sm" onClick={() => onChange("")}>
              Hapus
            </Button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'}`}
        >
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-3">
            <UploadCloud className="w-5 h-5 text-slate-500" />
          </div>
          <p className="text-sm font-medium text-slate-700 mb-1">Klik atau seret gambar ke sini</p>
          <p className="text-xs text-slate-500">Maks. 2MB (JPG, PNG, WebP)</p>
        </div>
      )}
    </div>
  );
}
