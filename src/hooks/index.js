import { useState, useEffect, useCallback, useRef } from 'react';
import { loadJsPDF, generatePDF, estimatePdfSize } from '../utils/pdf';
import { processUploadedFiles, revokeImageUrls, MAX_IMAGES } from '../utils/image';
import { useAppStore, useCompanyStore } from '../store';

// Hook for jsPDF loading
export const useJsPDF = () => {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        await loadJsPDF();
        if (mounted) {
          setLoaded(true);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return { loaded, loading, error };
};

// Hook for image management
export const useImages = () => {
  const { 
    images, 
    addImages, 
    removeImage, 
    reorderImages, 
    clearImages,
    setErrorMessage 
  } = useAppStore();

  const handleFileUpload = useCallback((files) => {
    if (images.length >= MAX_IMAGES) {
      setErrorMessage(`Maksimum ${MAX_IMAGES} fotoğraf ekleyebilirsiniz`);
      return;
    }

    const results = processUploadedFiles(files);
    
    // Check max images limit
    const availableSlots = MAX_IMAGES - images.length;
    const imagesToAdd = results.valid.slice(0, availableSlots);
    
    if (imagesToAdd.length > 0) {
      addImages(imagesToAdd);
    }
    
    if (results.errors.length > 0) {
      const errorMsg = results.errors
        .map(e => `${e.name}: ${e.errors.join(', ')}`)
        .join('\n');
      setErrorMessage(errorMsg);
    }
    
    if (results.valid.length > availableSlots) {
      setErrorMessage(`${results.valid.length - availableSlots} fotoğraf limit nedeniyle eklenmedi`);
    }
  }, [images.length, addImages, setErrorMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      revokeImageUrls(images);
    };
  }, []);

  return {
    images,
    addImages: handleFileUpload,
    removeImage,
    reorderImages,
    clearImages,
    imageCount: images.length,
    canAddMore: images.length < MAX_IMAGES
  };
};

// Hook for PDF generation
export const usePdfGenerator = () => {
  const { 
    images, 
    selectedQuality,
    setIsConverting,
    setConversionProgress,
    setPdfReady,
    setPdfUrl,
    setPdfSize,
    setErrorMessage,
    setShowQualityModal
  } = useAppStore();
  
  const { companyInfo } = useCompanyStore();
  const { loaded: jsPdfLoaded } = useJsPDF();
  
  const pdfBlobRef = useRef(null);

  const generatePdf = useCallback(async () => {
    if (images.length === 0) {
      setErrorMessage('Lütfen en az bir fotoğraf ekleyin');
      return null;
    }

    if (!jsPdfLoaded) {
      setErrorMessage('PDF kütüphanesi henüz yüklenmedi, lütfen bekleyin');
      return null;
    }

    setShowQualityModal(false);
    setIsConverting(true);
    setConversionProgress(0);
    setErrorMessage(null);

    try {
      const result = await generatePDF(
        images, 
        companyInfo, 
        selectedQuality,
        setConversionProgress
      );

      pdfBlobRef.current = result.blob;
      setPdfUrl(result.url);
      setPdfSize(result.formattedSize);
      setPdfReady(true);
      
      return result;
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      setErrorMessage('PDF oluşturulurken hata: ' + error.message);
      return null;
    } finally {
      setIsConverting(false);
    }
  }, [
    images, 
    companyInfo, 
    selectedQuality, 
    jsPdfLoaded,
    setIsConverting,
    setConversionProgress,
    setPdfReady,
    setPdfUrl,
    setPdfSize,
    setErrorMessage,
    setShowQualityModal
  ]);

  const estimatedSize = estimatePdfSize(images, selectedQuality);

  return {
    generatePdf,
    estimatedSize,
    pdfBlob: pdfBlobRef.current,
    isReady: jsPdfLoaded
  };
};

// Hook for responsive design
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

// Hook for mobile detection
export const useIsMobile = () => {
  return useMediaQuery('(max-width: 768px)');
};

// Hook for online status
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Hook for file drop
export const useFileDrop = (onDrop) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragCountRef = useRef(0);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCountRef.current++;
    
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCountRef.current--;
    
    if (dragCountRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCountRef.current = 0;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onDrop(files);
    }
  }, [onDrop]);

  return {
    isDragging,
    dragProps: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop
    }
  };
};
