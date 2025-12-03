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

// Create social media icon as canvas image
const createSocialIcon = (type, size = 64) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2;

    // Draw circle background
    ctx.beginPath();
    if (type === 'whatsapp') {
      ctx.fillStyle = '#25D366';
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      // Draw WhatsApp phone icon
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${size * 0.5}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('📞', centerX, centerY);
    } else if (type === 'instagram') {
      // Instagram gradient
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#f09433');
      gradient.addColorStop(0.25, '#e6683c');
      gradient.addColorStop(0.5, '#dc2743');
      gradient.addColorStop(0.75, '#cc2366');
      gradient.addColorStop(1, '#bc1888');
      ctx.fillStyle = gradient;
      // Rounded square for Instagram
      const cornerRadius = size * 0.2;
      ctx.beginPath();
      ctx.moveTo(cornerRadius, 0);
      ctx.lineTo(size - cornerRadius, 0);
      ctx.quadraticCurveTo(size, 0, size, cornerRadius);
      ctx.lineTo(size, size - cornerRadius);
      ctx.quadraticCurveTo(size, size, size - cornerRadius, size);
      ctx.lineTo(cornerRadius, size);
      ctx.quadraticCurveTo(0, size, 0, size - cornerRadius);
      ctx.lineTo(0, cornerRadius);
      ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
      ctx.fill();
      // Draw camera icon
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = size * 0.06;
      const inset = size * 0.2;
      // Outer rounded rect
      ctx.beginPath();
      ctx.roundRect(inset, inset, size - inset * 2, size - inset * 2, size * 0.1);
      ctx.stroke();
      // Center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.2, 0, Math.PI * 2);
      ctx.stroke();
      // Small circle top right
      ctx.beginPath();
      ctx.arc(size - inset - size * 0.12, inset + size * 0.12, size * 0.05, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    } else if (type === 'telegram') {
      ctx.fillStyle = '#0088cc';
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      // Draw paper plane
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      const planeSize = size * 0.5;
      const startX = centerX - planeSize * 0.4;
      const startY = centerY;
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + planeSize, startY - planeSize * 0.3);
      ctx.lineTo(startX + planeSize * 0.4, startY + planeSize * 0.4);
      ctx.lineTo(startX + planeSize * 0.5, startY);
      ctx.closePath();
      ctx.fill();
    }

    resolve(canvas.toDataURL('image/png'));
  });
};

// Generate PDF with cover page and images
export const generatePDF = async (images, coverInfo, quality, onProgress) => {
  const { jsPDF } = await loadJsPDF();

  // Determine orientation from coverInfo
  const orientation = coverInfo.orientation === 'landscape' ? 'l' : 'p';
  const pdf = new jsPDF(orientation, 'mm', 'a4');
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

  let yPos = pageHeight * 0.4; // Start at ~40% from top

  // Company Logo
  if (coverInfo.logo) {
    try {
      const logoData = await loadImageAsDataUrl(coverInfo.logo, 'high');
      const maxLogoWidth = orientation === 'l' ? 100 : 80;
      const maxLogoHeight = orientation === 'l' ? 40 : 50;

      const ratio = Math.min(maxLogoWidth / logoData.width, maxLogoHeight / logoData.height);
      const logoW = logoData.width * ratio;
      const logoH = logoData.height * ratio;

      const logoX = (pageWidth - logoW) / 2;
      pdf.addImage(logoData.dataUrl, 'JPEG', logoX, yPos - logoH - 15, logoW, logoH);
    } catch (e) {
      console.warn('Logo eklenemedi:', e);
    }
  }

  // Brand Name (like F-MOR)
  if (coverInfo.brandName) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(orientation === 'l' ? 56 : 48);
    pdf.setTextColor(brandColor.r, brandColor.g, brandColor.b);
    pdf.text(coverInfo.brandName, pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;
  }

  // Subtitle (like COLLECTION CATALOGUE)
  if (coverInfo.subtitle) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(orientation === 'l' ? 16 : 14);
    pdf.setTextColor(brandColor.r, brandColor.g, brandColor.b);
    // Add letter spacing effect
    const spacedSubtitle = coverInfo.subtitle.toUpperCase().split('').join(' ');
    pdf.text(spacedSubtitle, pageWidth / 2, yPos + 5, { align: 'center' });
    yPos += 20;
  }

  // Contact Info at bottom with proper icons
  const contactY = pageHeight - (orientation === 'l' ? 25 : 30);
  const hasContactInfo = coverInfo.whatsapp1 || coverInfo.whatsapp2 || coverInfo.instagram || coverInfo.telegram;

  if (hasContactInfo) {
    const iconSize = orientation === 'l' ? 12 : 10;
    const contactSpacing = orientation === 'l' ? 70 : 60;

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
    let contactX = (pageWidth - totalWidth) / 2 + iconSize;

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const x = contactX + (i * contactSpacing);

      // Draw social media icon
      try {
        const iconDataUrl = await createSocialIcon(contact.type, 128);
        pdf.addImage(iconDataUrl, 'PNG', x - iconSize / 2, contactY - iconSize / 2, iconSize, iconSize);
      } catch (e) {
        // Fallback to colored circle
        if (contact.type === 'whatsapp') {
          pdf.setFillColor(37, 211, 102);
        } else if (contact.type === 'instagram') {
          pdf.setFillColor(225, 48, 108);
        } else if (contact.type === 'telegram') {
          pdf.setFillColor(0, 136, 204);
        }
        pdf.circle(x, contactY, iconSize / 2, 'F');
      }

      // Draw text
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(orientation === 'l' ? 11 : 10);
      pdf.setTextColor(textColor.r, textColor.g, textColor.b);

      if (contact.type === 'whatsapp' && contact.values) {
        contact.values.forEach((phone, idx) => {
          pdf.text(phone, x + iconSize / 2 + 3, contactY + 1 + (idx * 5), { align: 'left' });
        });
      } else if (contact.value) {
        pdf.text(contact.value, x + iconSize / 2 + 3, contactY + 1, { align: 'left' });
      }
    }
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

// Generate Product Design PDF
export const generateProductPDF = async (design, onProgress) => {
  const { jsPDF } = await loadJsPDF();

  // Determine orientation: 'p' for portrait, 'l' for landscape
  const orientation = design.orientation === 'landscape' ? 'l' : 'p';
  const pdf = new jsPDF(orientation, 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth(); // 297mm for landscape, 210mm for portrait
  const pageHeight = pdf.internal.pageSize.getHeight(); // 210mm for landscape, 297mm for portrait

  onProgress?.(10);

  // Get colors
  const bgColor = hexToRgb(design.backgroundColor || '#ffffff');
  const headerColor = hexToRgb(design.headerColor || '#000000');
  const textColor = hexToRgb(design.textColor || '#333333');

  // Background
  pdf.setFillColor(bgColor.r, bgColor.g, bgColor.b);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Side watermark
  if (design.brandWatermark) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(headerColor.r, headerColor.g, headerColor.b);

    // Draw rotated watermark text along left side
    const watermarkX = 8;
    const watermarkSpacing = 40;
    for (let i = 0; i < 7; i++) {
      const y = 30 + (i * watermarkSpacing);
      pdf.text(design.brandWatermark, watermarkX, y, { angle: 90 });
    }
  }

  onProgress?.(30);

  // Content area starts after watermark
  const contentX = 20;
  const contentWidth = pageWidth - contentX - 10;

  // Image area
  const imageAreaWidth = contentWidth * 0.55;
  const imageAreaHeight = pageHeight - 30;
  const imageX = contentX;
  const imageY = 15;

  // Load and place images
  if (design.images && design.images.length > 0) {
    try {
      // Main image (large)
      const mainImgData = await loadImageAsDataUrl(design.images[0], 'high');
      const mainImgHeight = design.images.length > 1 ? imageAreaHeight * 0.75 : imageAreaHeight;

      // Calculate aspect ratio
      const mainRatio = mainImgData.width / mainImgData.height;
      let mainW = imageAreaWidth;
      let mainH = mainW / mainRatio;

      if (mainH > mainImgHeight) {
        mainH = mainImgHeight;
        mainW = mainH * mainRatio;
      }

      const mainCenterX = imageX + (imageAreaWidth - mainW) / 2;
      pdf.addImage(mainImgData.dataUrl, 'JPEG', mainCenterX, imageY, mainW, mainH);

      onProgress?.(50);

      // Secondary images (thumbnails at bottom)
      if (design.images.length > 1) {
        const thumbY = imageY + mainH + 5;
        const thumbCount = Math.min(design.images.length - 1, 3);
        const thumbWidth = (imageAreaWidth - (thumbCount - 1) * 3) / thumbCount;
        const thumbHeight = imageAreaHeight - mainH - 10;

        for (let i = 1; i <= thumbCount; i++) {
          if (design.images[i]) {
            try {
              const thumbData = await loadImageAsDataUrl(design.images[i], 'medium');
              const thumbRatio = thumbData.width / thumbData.height;
              let tw = thumbWidth;
              let th = tw / thumbRatio;

              if (th > thumbHeight) {
                th = thumbHeight;
                tw = th * thumbRatio;
              }

              const thumbX = imageX + (i - 1) * (thumbWidth + 3) + (thumbWidth - tw) / 2;
              pdf.addImage(thumbData.dataUrl, 'JPEG', thumbX, thumbY, tw, th);
            } catch (e) {
              console.warn('Thumbnail yüklenemedi:', e);
            }
          }
        }
      }
    } catch (e) {
      console.error('Ana görsel yüklenemedi:', e);
    }
  }

  onProgress?.(70);

  // Right panel - Info area
  const infoPanelX = imageX + imageAreaWidth + 8;
  const infoPanelWidth = contentWidth - imageAreaWidth - 8;
  let infoY = imageY;

  // Model Code Box
  pdf.setDrawColor(headerColor.r, headerColor.g, headerColor.b);
  pdf.setLineWidth(0.5);
  pdf.rect(infoPanelX, infoY, infoPanelWidth, 12);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(textColor.r, textColor.g, textColor.b);
  pdf.text('Model Code :', infoPanelX + 3, infoY + 7);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text(design.modelCode || '', infoPanelX + 28, infoY + 7);

  infoY += 16;

  // Color Table
  const tableHeight = 8;
  const colWidth = infoPanelWidth / 2;

  // Table Header
  pdf.setFillColor(headerColor.r, headerColor.g, headerColor.b);
  pdf.rect(infoPanelX, infoY, infoPanelWidth, tableHeight, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(255, 255, 255);
  pdf.text('COLOR', infoPanelX + colWidth / 2, infoY + 5.5, { align: 'center' });
  pdf.text('PIECES', infoPanelX + colWidth + colWidth / 2, infoY + 5.5, { align: 'center' });

  // Vertical line in header
  pdf.setDrawColor(200, 200, 200);
  pdf.line(infoPanelX + colWidth, infoY, infoPanelX + colWidth, infoY + tableHeight);

  infoY += tableHeight;

  // Table Rows
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(textColor.r, textColor.g, textColor.b);
  pdf.setDrawColor(headerColor.r, headerColor.g, headerColor.b);

  const filledColors = design.colors.filter(c => c.left || c.right);
  const rowsToShow = filledColors.length > 0 ? filledColors : design.colors;

  rowsToShow.forEach((row, index) => {
    pdf.rect(infoPanelX, infoY, infoPanelWidth, tableHeight);
    pdf.line(infoPanelX + colWidth, infoY, infoPanelX + colWidth, infoY + tableHeight);

    if (row.left) {
      pdf.text(row.left.toUpperCase(), infoPanelX + colWidth / 2, infoY + 5.5, { align: 'center' });
    }
    if (row.right) {
      pdf.text(row.right.toUpperCase(), infoPanelX + colWidth + colWidth / 2, infoY + 5.5, { align: 'center' });
    }

    infoY += tableHeight;
  });

  infoY += 5;

  // Sizes Box
  pdf.setDrawColor(headerColor.r, headerColor.g, headerColor.b);
  pdf.rect(infoPanelX, infoY, infoPanelWidth, 12);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(textColor.r, textColor.g, textColor.b);
  pdf.text(design.sizes || '', infoPanelX + infoPanelWidth / 2, infoY + 7.5, { align: 'center' });

  infoY += 18;

  // Material Box
  if (design.material) {
    pdf.setFillColor(headerColor.r, headerColor.g, headerColor.b);
    pdf.rect(infoPanelX, infoY, infoPanelWidth, 20, 'F');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(255, 255, 255);
    pdf.text('MATERIAL', infoPanelX + infoPanelWidth / 2, infoY + 8, { align: 'center' });

    pdf.setFontSize(8);
    pdf.text(design.material.toUpperCase(), infoPanelX + infoPanelWidth / 2, infoY + 15, { align: 'center' });
  }

  onProgress?.(100);

  // Generate blob
  const blob = pdf.output('blob');
  const url = URL.createObjectURL(blob);

  return {
    url,
    blob,
    size: blob.size,
    formattedSize: formatFileSize(blob.size),
    pageCount: 1
  };
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
