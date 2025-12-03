import React, { useRef } from 'react';
import { Upload, Plus, Trash2 } from 'lucide-react';
import { useFileDrop } from '../hooks';
import { MAX_IMAGES } from '../utils/image';

// Upload Area Component
export const UploadArea = ({ onUpload, disabled = false }) => {
  const fileInputRef = useRef(null);
  
  const { isDragging, dragProps } = useFileDrop((files) => {
    onUpload(files);
  });

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`
        relative group cursor-pointer mb-6
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      {...dragProps}
    >
      {/* Glow effect */}
      <div 
        className={`
          absolute inset-0 rounded-3xl blur-xl transition-all duration-300
          ${isDragging 
            ? 'bg-gradient-to-r from-orange-500/40 to-pink-500/40 blur-2xl' 
            : 'bg-gradient-to-r from-orange-500/20 to-pink-500/20 group-hover:blur-2xl'
          }
        `}
      />
      
      {/* Upload box */}
      <div 
        className={`
          relative border-2 border-dashed rounded-3xl p-8 
          transition-all duration-300 bg-slate-800/50 backdrop-blur-sm
          ${isDragging 
            ? 'border-orange-500 bg-orange-500/10' 
            : 'border-slate-600 group-hover:border-orange-500'
          }
        `}
      >
        <div className="flex flex-col items-center gap-4">
          <div 
            className={`
              w-20 h-20 rounded-2xl flex items-center justify-center 
              transition-transform duration-300
              bg-gradient-to-br from-orange-500/20 to-pink-500/20
              ${!disabled && 'group-hover:scale-110'}
            `}
          >
            <Upload 
              className={`
                w-10 h-10 
                ${isDragging ? 'text-orange-400' : 'text-orange-400'}
              `} 
            />
          </div>
          
          <div className="text-center">
            <p className="text-white font-medium mb-1">
              {isDragging ? 'Bırakın' : 'Fotoğrafları Yükle'}
            </p>
            <p className="text-slate-400 text-sm">
              {isDragging 
                ? 'Dosyaları buraya bırakın'
                : 'Tıklayın veya sürükleyip bırakın'
              }
            </p>
            <p className="text-slate-500 text-xs mt-2">
              Maksimum {MAX_IMAGES} fotoğraf
            </p>
          </div>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
        aria-label="Fotoğraf seç"
      />
    </div>
  );
};

// Image Grid Component
export const ImageGrid = ({ images, onRemove, onAddMore }) => {
  const fileInputRef = useRef(null);
  
  if (images.length === 0) return null;

  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
        Seçilen Fotoğraflar
      </h3>
      
      <div className="grid grid-cols-3 gap-3">
        {images.map((image, index) => (
          <ImageThumbnail
            key={image.id}
            image={image}
            index={index}
            onRemove={() => onRemove(image.id)}
          />
        ))}
        
        {/* Add more button */}
        {images.length < MAX_IMAGES && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="
              aspect-square rounded-2xl 
              border-2 border-dashed border-slate-600 
              hover:border-orange-500 
              flex items-center justify-center 
              transition-all duration-200 
              hover:bg-orange-500/10
            "
            aria-label="Daha fazla fotoğraf ekle"
          >
            <Plus className="w-8 h-8 text-slate-500" />
          </button>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          if (e.target.files) {
            onAddMore(e.target.files);
            e.target.value = '';
          }
        }}
        className="hidden"
        aria-label="Daha fazla fotoğraf seç"
      />
    </div>
  );
};

// Image Thumbnail Component
const ImageThumbnail = ({ image, index, onRemove }) => {
  return (
    <div className="relative aspect-square rounded-2xl overflow-hidden group">
      <img 
        src={image.preview} 
        alt={image.name || `Fotoğraf ${index + 1}`}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      
      {/* Hover overlay */}
      <div 
        className="
          absolute inset-0 
          bg-gradient-to-t from-black/60 to-transparent 
          opacity-0 group-hover:opacity-100 
          transition-opacity duration-200
        "
      />
      
      {/* Remove button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="
          absolute top-2 right-2 
          w-8 h-8 
          bg-red-500/90 hover:bg-red-600
          rounded-full 
          flex items-center justify-center 
          opacity-0 group-hover:opacity-100 
          transition-all duration-200
          focus:opacity-100
        "
        aria-label={`${image.name || 'Fotoğraf'} sil`}
      >
        <Trash2 className="w-4 h-4 text-white" />
      </button>
      
      {/* Index badge */}
      <span 
        className="
          absolute bottom-2 left-2 
          text-xs text-white font-medium 
          bg-black/50 px-2 py-0.5 rounded-full
        "
      >
        {index + 1}
      </span>
    </div>
  );
};

export default UploadArea;
