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

// Convert hex color to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 255, b: 255 };
};

// Generate PDF with cover page and images
export const generatePDF = async (images, coverInfo, quality, onProgress) => {
  const { jsPDF } = await loadJsPDF();

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;

  const totalSteps = images.length + 1; // +1 for cover page
  let currentStep = 0;

  // Get colors from coverInfo
  const bgColor = hexToRgb(coverInfo.backgroundColor || '#ffffff');
  const brandColor = hexToRgb(coverInfo.brandColor || '#e91e8c');
  const textColor = hexToRgb(coverInfo.textColor || '#333333');

  // === COVER PAGE ===
  onProgress?.(0);

  // Background
  pdf.setFillColor(bgColor.r, bgColor.g, bgColor.b);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  let yPos = pageHeight * 0.35; // Start at ~35% from top

  // Company Logo
  if (coverInfo.logo) {
    try {
      const logoData = await loadImageAsDataUrl(coverInfo.logo, 'high');
      const maxLogoWidth = 80;
      const maxLogoHeight = 50;

      const ratio = Math.min(maxLogoWidth / logoData.width, maxLogoHeight / logoData.height);
      const logoW = logoData.width * ratio;
      const logoH = logoData.height * ratio;

      const logoX = (pageWidth - logoW) / 2;
      pdf.addImage(logoData.dataUrl, 'JPEG', logoX, yPos - logoH - 10, logoW, logoH);
    } catch (e) {
      console.warn('Logo eklenemedi:', e);
    }
  }

  // Brand Name (like F-MOR)
  if (coverInfo.brandName) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(48);
    pdf.setTextColor(brandColor.r, brandColor.g, brandColor.b);
    pdf.text(coverInfo.brandName, pageWidth / 2, yPos, { align: 'center' });
    yPos += 12;
  }

  // Subtitle (like COLLECTION CATALOGUE)
  if (coverInfo.subtitle) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(14);
    pdf.setTextColor(brandColor.r, brandColor.g, brandColor.b);
    // Add letter spacing effect by splitting and rejoining with spaces
    const spacedSubtitle = coverInfo.subtitle.toUpperCase().split('').join(' ');
    pdf.text(spacedSubtitle, pageWidth / 2, yPos + 5, { align: 'center' });
    yPos += 20;
  }

  // Contact Info at bottom
  const contactY = pageHeight - 35;
  const hasContactInfo = coverInfo.whatsapp1 || coverInfo.whatsapp2 || coverInfo.instagram || coverInfo.telegram;

  if (hasContactInfo) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(textColor.r, textColor.g, textColor.b);

    let contactX = margin + 20;
    const contactSpacing = 55;

    // Calculate how many contact items we have
    const contacts = [];
    if (coverInfo.whatsapp1 || coverInfo.whatsapp2) {
      const phones = [coverInfo.whatsapp1, coverInfo.whatsapp2].filter(Boolean);
      contacts.push({ type: 'whatsapp', values: phones });
    }
    if (coverInfo.instagram) {
      contacts.push({ type: 'instagram', value: coverInfo.instagram });
    }
    if (coverInfo.telegram) {
      contacts.push({ type: 'telegram', value: coverInfo.telegram });
    }

    // Center the contacts
    const totalWidth = contacts.length * contactSpacing;
    contactX = (pageWidth - totalWidth) / 2 + contactSpacing / 2;

    contacts.forEach((contact, index) => {
      const x = contactX + (index * contactSpacing);

      // Draw colored circle for icon
      if (contact.type === 'whatsapp') {
        pdf.setFillColor(37, 211, 102); // WhatsApp green
        pdf.circle(x - 15, contactY, 5, 'F');
        pdf.setTextColor(textColor.r, textColor.g, textColor.b);
        contact.values.forEach((phone, i) => {
          pdf.text(phone, x - 5, contactY + 1 + (i * 5), { align: 'left' });
        });
      } else if (contact.type === 'instagram') {
        pdf.setFillColor(225, 48, 108); // Instagram pink
        pdf.circle(x - 15, contactY, 5, 'F');
        pdf.setTextColor(textColor.r, textColor.g, textColor.b);
        pdf.text(contact.value, x - 5, contactY + 1, { align: 'left' });
      } else if (contact.type === 'telegram') {
        pdf.setFillColor(0, 136, 204); // Telegram blue
        pdf.circle(x - 15, contactY, 5, 'F');
        pdf.setTextColor(textColor.r, textColor.g, textColor.b);
        pdf.text(contact.value, x - 5, contactY + 1, { align: 'left' });
      }
    });
  }

  currentStep++;
  onProgress?.(Math.round((currentStep / totalSteps) * 100));

  // === PHOTO PAGES ===
  for (let i = 0; i < images.length; i++) {
    pdf.addPage();

    // White background for photos
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

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
export const downloadPDF = (pdfUrl, brandName) => {
  if (!pdfUrl) return;

  const timestamp = Date.now();
  const fileName = brandName
    ? `${brandName.replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ]/g, '_')}_${timestamp}.pdf`
    : `pdfo_${timestamp}.pdf`;

  const link = document.createElement('a');
  link.href = pdfUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Share PDF (Web Share API)
export const sharePDF = async (pdfUrl, pdfBlob, brandName) => {
  const fileName = brandName
    ? `${brandName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
    : 'pdfo.pdf';

  const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

  if (navigator.share && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'PDF Dosyası',
        text: brandName ? `${brandName} - PDF Belgesi` : 'Pdfo ile oluşturuldu'
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
  downloadPDF(pdfUrl, brandName);
  return true;
};
