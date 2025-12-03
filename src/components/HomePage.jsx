import React from 'react';
import {
  FileImage, Share2, Download, Image as ImageIcon,
  ArrowRight, CheckCircle, HardDrive, Loader2,
  Smartphone, Monitor
} from 'lucide-react';
import Header from './Header';
import { UploadArea, ImageGrid } from './ImageUpload';
import QualitySelector from './QualitySelector';
import { Button, Card, Alert, Modal, ProgressBar } from './ui';
import { useAppStore, useCoverStore } from '../store';
import { useImages, usePdfGenerator, useJsPDF } from '../hooks';
import { downloadPDF } from '../utils/pdf';

const HomePage = () => {
  const {
    pdfReady,
    pdfUrl,
    pdfSize,
    selectedQuality,
    isConverting,
    conversionProgress,
    showQualityModal,
    showShareMenu,
    errorMessage,
    setSelectedQuality,
    setShowQualityModal,
    setShowShareMenu,
    setCurrentPage,
    clearError
  } = useAppStore();

  const { coverInfo, updateCoverField } = useCoverStore();
  const { images, addImages, removeImage } = useImages();
  const { generatePdf, estimatedSize, isReady: jsPdfReady } = usePdfGenerator();
  const { loading: jsPdfLoading } = useJsPDF();

  const hasCoverInfo = coverInfo.brandName || coverInfo.logo || coverInfo.whatsapp1;

  const handleDownload = () => {
    downloadPDF(pdfUrl, coverInfo.brandName);
  };

  // Native share function
  const handleNativeShare = async () => {
    if (!pdfUrl) return;

    try {
      // Convert blob URL to blob
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const fileName = coverInfo.brandName
        ? `${coverInfo.brandName.replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ\s]/g, '')}_katalog.pdf`
        : 'katalog.pdf';
      const file = new File([blob], fileName, { type: 'application/pdf' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: fileName,
          text: coverInfo.brandName ? `${coverInfo.brandName} Kataloğu` : 'PDF Kataloğu'
        });
        setShowShareMenu(false);
      } else {
        // Fallback: download
        handleDownload();
        setShowShareMenu(false);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share failed:', error);
        handleDownload();
      }
      setShowShareMenu(false);
    }
  };

  // WhatsApp share
  const handleWhatsAppShare = async () => {
    // First download the file
    handleDownload();

    // Open WhatsApp with a message
    const message = coverInfo.brandName
      ? `${coverInfo.brandName} Kataloğu - PDF dosyası indirildi, lütfen ekleyin.`
      : 'PDF Kataloğu - Dosya indirildi, lütfen ekleyin.';

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setShowShareMenu(false);
  };

  // Telegram share
  const handleTelegramShare = async () => {
    handleDownload();

    const message = coverInfo.brandName
      ? `${coverInfo.brandName} Kataloğu`
      : 'PDF Kataloğu';

    const telegramUrl = `https://t.me/share/url?text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
    setShowShareMenu(false);
  };

  // Email share
  const handleEmailShare = () => {
    handleDownload();

    const subject = coverInfo.brandName
      ? `${coverInfo.brandName} Kataloğu`
      : 'PDF Kataloğu';
    const body = 'PDF kataloğu ekte bulunmaktadır.';

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setShowShareMenu(false);
  };

  const shareOptions = [
    { name: 'Paylaş', color: 'bg-orange-500', icon: '📤', action: handleNativeShare },
    { name: 'WhatsApp', color: 'bg-green-500', icon: '💬', action: handleWhatsAppShare },
    { name: 'Telegram', color: 'bg-sky-500', icon: '📨', action: handleTelegramShare },
    { name: 'E-posta', color: 'bg-blue-500', icon: '✉️', action: handleEmailShare },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <Header />

      <main className="max-w-lg mx-auto px-4 py-6 pb-32">
        {/* Error Alert */}
        {errorMessage && (
          <Alert
            type="error"
            message={errorMessage}
            onClose={clearError}
            className="mb-4"
          />
        )}

        {/* jsPDF Loading */}
        {jsPdfLoading && (
          <Alert
            type="warning"
            message="PDF kütüphanesi yükleniyor..."
            className="mb-4"
          />
        )}

        {/* Cover Info Banner */}
        {hasCoverInfo ? (
          <Card
            variant="brand"
            className="mb-6 flex items-center gap-3"
            onClick={() => setCurrentPage('settings')}
          >
            {coverInfo.logo ? (
              <img
                src={coverInfo.logo}
                alt="Kapak logosu"
                className="w-12 h-12 object-contain rounded-lg bg-white p-1"
              />
            ) : (
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-orange-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">
                {coverInfo.brandName || 'Kapak'}
              </p>
              <p className="text-slate-400 text-sm truncate">
                {coverInfo.subtitle || coverInfo.whatsapp1 || 'Kapak tasarımı hazır'}
              </p>
            </div>
            <span className="text-orange-400 text-sm hover:text-orange-300 whitespace-nowrap">
              Düzenle
            </span>
          </Card>
        ) : (
          <Card
            variant="warning"
            className="mb-6 flex items-center gap-3"
            onClick={() => setCurrentPage('settings')}
          >
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <ImageIcon className="w-6 h-6 text-orange-400" />
            </div>
            <div className="flex-1">
              <p className="text-orange-300 font-medium">Kapak Tasarımını Ayarla</p>
              <p className="text-orange-400/70 text-sm">Marka adı, logo ve iletişim bilgileri</p>
            </div>
            <ArrowRight className="w-5 h-5 text-orange-400 flex-shrink-0" />
          </Card>
        )}

        {/* Orientation Selector */}
        <Card className="mb-6">
          <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
            PDF Sayfa Yönü
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updateCoverField('orientation', 'portrait')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                coverInfo.orientation === 'portrait'
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              <div className={`w-10 h-14 rounded border-2 ${
                coverInfo.orientation === 'portrait'
                  ? 'border-orange-400 bg-orange-500/20'
                  : 'border-slate-500'
              }`}>
                <Smartphone className={`w-full h-full p-1 ${
                  coverInfo.orientation === 'portrait' ? 'text-orange-400' : 'text-slate-500'
                }`} />
              </div>
              <span className={`text-sm font-medium ${
                coverInfo.orientation === 'portrait' ? 'text-orange-400' : 'text-slate-400'
              }`}>
                Dikey
              </span>
            </button>
            <button
              onClick={() => updateCoverField('orientation', 'landscape')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                coverInfo.orientation === 'landscape'
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              <div className={`w-14 h-10 rounded border-2 ${
                coverInfo.orientation === 'landscape'
                  ? 'border-orange-400 bg-orange-500/20'
                  : 'border-slate-500'
              }`}>
                <Monitor className={`w-full h-full p-1 ${
                  coverInfo.orientation === 'landscape' ? 'text-orange-400' : 'text-slate-500'
                }`} />
              </div>
              <span className={`text-sm font-medium ${
                coverInfo.orientation === 'landscape' ? 'text-orange-400' : 'text-slate-400'
              }`}>
                Yatay
              </span>
            </button>
          </div>
        </Card>

        {/* Upload Area */}
        <UploadArea
          onUpload={addImages}
          disabled={isConverting}
        />

        {/* Image Grid */}
        <ImageGrid
          images={images}
          onRemove={removeImage}
          onAddMore={addImages}
        />

        {/* PDF Ready State */}
        {pdfReady && (
          <Card variant="success" className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-green-300 font-medium">PDF Hazır!</p>
                <p className="text-green-400/70 text-sm">
                  Kapak + {images.length} fotoğraf
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-slate-400" />
                <span className="text-slate-400 text-sm">Dosya Boyutu:</span>
              </div>
              <span className="font-bold text-white">{pdfSize}</span>
            </div>
          </Card>
        )}

        {/* Converting Progress */}
        {isConverting && (
          <Card className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Loader2 className="w-6 h-6 text-orange-400 animate-spin" />
              <div>
                <p className="text-white font-medium">PDF Oluşturuluyor...</p>
                <p className="text-slate-400 text-sm">
                  {conversionProgress < 10
                    ? 'Kapak sayfası hazırlanıyor'
                    : `Fotoğraflar işleniyor`
                  }
                </p>
              </div>
            </div>
            <ProgressBar value={conversionProgress} showLabel />
          </Card>
        )}
      </main>

      {/* Bottom Action Bar */}
      {images.length > 0 && !isConverting && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent">
          <div className="max-w-lg mx-auto flex gap-3">
            {!pdfReady ? (
              <Button
                onClick={() => setShowQualityModal(true)}
                disabled={!jsPdfReady}
                fullWidth
                size="lg"
              >
                <FileImage className="w-5 h-5" />
                PDF Oluştur
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => setShowShareMenu(true)}
                  fullWidth
                  size="lg"
                >
                  <Share2 className="w-5 h-5" />
                  Paylaş
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="secondary"
                  size="lg"
                  aria-label="PDF'i indir"
                >
                  <Download className="w-5 h-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Quality Selection Modal */}
      <Modal
        isOpen={showQualityModal}
        onClose={() => setShowQualityModal(false)}
        title="PDF Kalitesi Seçin"
      >
        <div className="space-y-6">
          <QualitySelector
            selectedQuality={selectedQuality}
            onSelectQuality={setSelectedQuality}
            estimatedSize={estimatedSize}
          />

          <Button
            onClick={generatePdf}
            fullWidth
            size="lg"
          >
            <FileImage className="w-5 h-5" />
            PDF Oluştur
          </Button>

          <Button
            onClick={() => setShowQualityModal(false)}
            variant="secondary"
            fullWidth
          >
            İptal
          </Button>
        </div>
      </Modal>

      {/* Share Menu Modal */}
      <Modal
        isOpen={showShareMenu}
        onClose={() => setShowShareMenu(false)}
        title="PDF'i Paylaş"
      >
        <p className="text-slate-400 text-sm text-center mb-6 -mt-4">
          Boyut: {pdfSize}
        </p>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={option.action}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-slate-700/50 transition-colors"
            >
              <div className={`w-14 h-14 ${option.color} rounded-2xl flex items-center justify-center text-2xl`}>
                {option.icon}
              </div>
              <span className="text-xs text-slate-300">{option.name}</span>
            </button>
          ))}
        </div>

        <Button
          onClick={() => setShowShareMenu(false)}
          variant="secondary"
          fullWidth
        >
          İptal
        </Button>
      </Modal>
    </div>
  );
};

export default HomePage;
