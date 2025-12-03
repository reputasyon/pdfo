// Quality settings for PDF generation
export const QUALITY_SETTINGS = {
  low: { 
    compression: 0.4, 
    scale: 0.5,
    label: 'Düşük',
    description: 'Küçük boyut, hızlı paylaşım',
    estimateMultiplier: 0.3
  },
  medium: { 
    compression: 0.7, 
    scale: 0.75,
    label: 'Orta',
    description: 'Dengeli kalite ve boyut',
    estimateMultiplier: 0.6
  },
  high: { 
    compression: 0.95, 
    scale: 1,
    label: 'Yüksek',
    description: 'En iyi kalite, büyük boyut',
    estimateMultiplier: 1.2
  }
};

// Format file size for display
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

// Estimate PDF size based on images and quality
export const estimatePdfSize = (images, quality) => {
  if (!images || images.length === 0) return null;
  
  const baseSize = images.reduce((total, img) => {
    return total + (img.size || 200000); // Default 200KB if size unknown
  }, 0);
  
  const multiplier = QUALITY_SETTINGS[quality]?.estimateMultiplier || 0.6;
  const estimated = baseSize * multiplier;
  
  return formatFileSize(estimated);
};

// Load image as data URL with quality settings
export const loadImageAsDataUrl = (src, quality = 'medium') => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      try {
        const settings = QUALITY_SETTINGS[quality];
        const canvas = document.createElement('canvas');
        
        // Apply scale
        canvas.width = Math.round(img.width * settings.scale);
        canvas.height = Math.round(img.height * settings.scale);
        
        const ctx = canvas.getContext('2d');
        
        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', settings.compression);
        
        resolve({ 
          dataUrl, 
          width: canvas.width, 
          height: canvas.height,
          originalWidth: img.width,
          originalHeight: img.height
        });
      } catch (err) {
        reject(new Error('Resim işlenemedi: ' + err.message));
      }
    };
    
    img.onerror = () => reject(new Error('Resim yüklenemedi'));
    img.src = src;
  });
};

// Load jsPDF from CDN
export const loadJsPDF = () => {
  return new Promise((resolve, reject) => {
    if (window.jspdf) {
      resolve(window.jspdf);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    
    script.onload = () => {
      if (window.jspdf) {
        resolve(window.jspdf);
      } else {
        reject(new Error('jsPDF yüklenemedi'));
      }
    };
    
    script.onerror = () => reject(new Error('jsPDF kütüphanesi yüklenemedi'));
    
    document.body.appendChild(script);
  });
};

// Generate PDF with cover page and images
export const generatePDF = async (images, companyInfo, quality, onProgress) => {
  const { jsPDF } = await loadJsPDF();
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  
  const totalSteps = images.length + 1; // +1 for cover page
  let currentStep = 0;

  // === COVER PAGE ===
  onProgress?.(0);
  
  // Background
  pdf.setFillColor(250, 250, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Header bar
  pdf.setFillColor(249, 115, 22);
  pdf.rect(0, 0, pageWidth, 8, 'F');
  
  let yPos = 50;

  // Company Logo
  if (companyInfo.logo) {
    try {
      const logoData = await loadImageAsDataUrl(companyInfo.logo, 'high');
      const maxLogoWidth = 50;
      const maxLogoHeight = 35;
      
      const ratio = Math.min(maxLogoWidth / logoData.width, maxLogoHeight / logoData.height);
      const logoW = logoData.width * ratio;
      const logoH = logoData.height * ratio;
      
      const logoX = (pageWidth - logoW) / 2;
      pdf.addImage(logoData.dataUrl, 'JPEG', logoX, yPos, logoW, logoH);
      yPos += logoH + 15;
    } catch (e) {
      console.warn('Logo eklenemedi:', e);
      yPos += 10;
    }
  }

  // Company Name
  if (companyInfo.name) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    pdf.setTextColor(30, 30, 60);
    pdf.text(companyInfo.name, pageWidth / 2, yPos, { align: 'center' });
    yPos += 12;
  }

  // Divider
  if (companyInfo.name || companyInfo.logo) {
    pdf.setDrawColor(249, 115, 22);
    pdf.setLineWidth(0.5);
    pdf.line(pageWidth / 4, yPos, (pageWidth * 3) / 4, yPos);
    yPos += 15;
  }

  // Contact Info
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(60, 60, 80);

  const contactFields = [
    { value: companyInfo.phone, prefix: 'Tel: ' },
    { value: companyInfo.email, prefix: 'E-posta: ' },
    { value: companyInfo.website, prefix: 'Web: ' },
    { value: companyInfo.address, prefix: 'Adres: ', maxWidth: pageWidth - 40 }
  ];

  contactFields.forEach(field => {
    if (field.value) {
      pdf.text(
        field.prefix + field.value, 
        pageWidth / 2, 
        yPos, 
        { align: 'center', maxWidth: field.maxWidth }
      );
      yPos += 7;
    }
  });

  // Footer info
  pdf.setFontSize(9);
  pdf.setTextColor(120, 120, 140);
  const today = new Date().toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const qualityLabel = QUALITY_SETTINGS[quality]?.label || 'Orta';
  pdf.text(
    `Tarih: ${today} | ${images.length} Fotoğraf | Kalite: ${qualityLabel}`, 
    pageWidth / 2, 
    pageHeight - 20, 
    { align: 'center' }
  );

  // Footer bar
  pdf.setFillColor(249, 115, 22);
  pdf.rect(0, pageHeight - 8, pageWidth, 8, 'F');

  currentStep++;
  onProgress?.(Math.round((currentStep / totalSteps) * 100));

  // === PHOTO PAGES ===
  for (let i = 0; i < images.length; i++) {
    pdf.addPage();
    
    try {
      const imgData = await loadImageAsDataUrl(images[i].preview, quality);
      
      const availableWidth = pageWidth - (margin * 2);
      const availableHeight = pageHeight - (margin * 2) - 10;
      
      const imgRatio = imgData.width / imgData.height;
      const pageRatio = availableWidth / availableHeight;
      
      let finalWidth, finalHeight;
      
      if (imgRatio > pageRatio) {
        finalWidth = availableWidth;
        finalHeight = availableWidth / imgRatio;
      } else {
        finalHeight = availableHeight;
        finalWidth = availableHeight * imgRatio;
      }
      
      const x = (pageWidth - finalWidth) / 2;
      const y = (pageHeight - finalHeight) / 2 - 5;
      
      pdf.addImage(imgData.dataUrl, 'JPEG', x, y, finalWidth, finalHeight);
    } catch (imgErr) {
      console.error('Resim eklenemedi:', imgErr);
      pdf.setFontSize(12);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Resim yüklenemedi', pageWidth / 2, pageHeight / 2, { align: 'center' });
    }

    // Page number
    pdf.setFontSize(9);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`${i + 1} / ${images.length}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
    
    currentStep++;
    onProgress?.(Math.round((currentStep / totalSteps) * 100));
  }
  
  // Generate blob
  const blob = pdf.output('blob');
  const url = URL.createObjectURL(blob);
  
  return {
    url,
    blob,
    size: blob.size,
    formattedSize: formatFileSize(blob.size),
    pageCount: images.length + 1
  };
};

// Download PDF
export const downloadPDF = (pdfUrl, companyName) => {
  if (!pdfUrl) return;
  
  const timestamp = Date.now();
  const fileName = companyName 
    ? `${companyName.replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ]/g, '_')}_${timestamp}.pdf`
    : `pdfo_${timestamp}.pdf`;
  
  const link = document.createElement('a');
  link.href = pdfUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Share PDF (Web Share API)
export const sharePDF = async (pdfUrl, pdfBlob, companyName) => {
  const fileName = companyName 
    ? `${companyName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
    : 'pdfo.pdf';
  
  const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
  
  if (navigator.share && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'PDF Dosyası',
        text: companyName ? `${companyName} - PDF Belgesi` : 'Pdfo ile oluşturuldu'
      });
      return true;
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Paylaşım hatası:', error);
      }
      return false;
    }
  }
  
  // Fallback to download
  downloadPDF(pdfUrl, companyName);
  return true;
};
