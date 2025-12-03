// Supported image types
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif'
];

// Max file size (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Max images at once
export const MAX_IMAGES = 50;

// Validate image file
export const validateImage = (file) => {
  const errors = [];
  
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    errors.push(`Desteklenmeyen dosya formatı: ${file.type || 'bilinmiyor'}`);
  }
  
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`Dosya çok büyük: ${(file.size / 1024 / 1024).toFixed(1)}MB (max: 10MB)`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Process uploaded files
export const processUploadedFiles = (files) => {
  const results = {
    valid: [],
    errors: []
  };
  
  Array.from(files).forEach(file => {
    const validation = validateImage(file);
    
    if (validation.valid) {
      results.valid.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type
      });
    } else {
      results.errors.push({
        name: file.name,
        errors: validation.errors
      });
    }
  });
  
  return results;
};

// Clean up object URLs
export const revokeImageUrls = (images) => {
  images.forEach(img => {
    if (img.preview) {
      URL.revokeObjectURL(img.preview);
    }
  });
};

// Get image dimensions
export const getImageDimensions = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height
      });
    };
    img.onerror = () => reject(new Error('Resim boyutları alınamadı'));
    img.src = src;
  });
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

// Generate thumbnail
export const generateThumbnail = (src, maxSize = 200) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxSize) {
          height = Math.round(height * maxSize / width);
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = Math.round(width * maxSize / height);
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    
    img.onerror = () => reject(new Error('Thumbnail oluşturulamadı'));
    img.src = src;
  });
};
