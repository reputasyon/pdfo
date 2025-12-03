import React, { useState, useRef } from 'react';
import {
  ArrowLeft, Plus, Trash2, Save, Download, Image as ImageIcon,
  X, Edit2, FileText, Palette, RectangleVertical, RectangleHorizontal
} from 'lucide-react';
import { Button, Input, Card, Modal, IconButton } from './ui';
import { useAppStore, useProductDesignStore } from '../store';
import { generateProductPDF, downloadPDF } from '../utils/pdf';

const ProductDesignerPage = () => {
  const { setCurrentPage } = useAppStore();
  const {
    currentDesign,
    savedDesigns,
    updateCurrentDesign,
    updateColorRow,
    addImageToDesign,
    removeImageFromDesign,
    saveCurrentDesign,
    loadDesign,
    deleteDesign,
    createNewDesign
  } = useProductDesignStore();

  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'list'
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const fileInputRef = useRef(null);

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          addImageToDesign(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
    e.target.value = '';
  };

  // Generate and download PDF
  const handleGeneratePDF = async () => {
    if (currentDesign.images.length === 0) {
      alert('En az bir fotoğraf ekleyin');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateProductPDF(currentDesign);
      downloadPDF(result.url, currentDesign.modelCode || 'urun');
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      alert('PDF oluşturulurken bir hata oluştu');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle save
  const handleSave = () => {
    saveCurrentDesign();
    alert('Tasarım kaydedildi!');
  };

  // Handle delete confirmation
  const handleDelete = (id) => {
    deleteDesign(id);
    setShowDeleteModal(null);
    if (currentDesign.id === id) {
      createNewDesign();
    }
  };

  // Color presets
  const colorPresets = [
    { bg: '#ffffff', header: '#000000', text: '#333333', name: 'Klasik' },
    { bg: '#f8f4f0', header: '#8b4513', text: '#5d3a1a', name: 'Kahve' },
    { bg: '#fff5f5', header: '#e91e8c', text: '#333333', name: 'Pembe' },
    { bg: '#f0f0f0', header: '#1a1a1a', text: '#333333', name: 'Siyah' }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconButton
              icon={ArrowLeft}
              onClick={() => setCurrentPage('home')}
              aria-label="Geri"
            />
            <h1 className="font-bold text-lg">Sayfa Tasarımcısı</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === 'editor' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('editor')}
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Editör
            </Button>
            <Button
              variant={activeTab === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('list')}
            >
              <FileText className="w-4 h-4 mr-1" />
              Kayıtlı ({savedDesigns.length})
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'editor' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Form */}
            <div className="space-y-4">
              {/* Design Name & Orientation */}
              <Card>
                <h3 className="font-semibold mb-3">Tasarım Bilgileri</h3>
                <Input
                  placeholder="Tasarım adı (opsiyonel)"
                  value={currentDesign.name}
                  onChange={(e) => updateCurrentDesign('name', e.target.value)}
                  className="mb-3"
                />

                {/* Orientation Selector */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Sayfa Yönü</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateCurrentDesign('orientation', 'portrait')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${
                        currentDesign.orientation === 'portrait'
                          ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <RectangleVertical className="w-5 h-5" />
                      <span className="font-medium">Dikey</span>
                    </button>
                    <button
                      onClick={() => updateCurrentDesign('orientation', 'landscape')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${
                        currentDesign.orientation === 'landscape'
                          ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <RectangleHorizontal className="w-5 h-5" />
                      <span className="font-medium">Yatay</span>
                    </button>
                  </div>
                </div>
              </Card>

              {/* Images */}
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Ürün Fotoğrafları ({currentDesign.images.length}/4)</h3>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  {currentDesign.images.length < 4 && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ekle
                    </Button>
                  )}
                </div>

                {currentDesign.images.length === 0 ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-orange-500 transition-colors"
                  >
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 text-slate-500" />
                    <p className="text-slate-400">Fotoğraf eklemek için tıklayın</p>
                    <p className="text-sm text-slate-500">Max 4 fotoğraf</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {currentDesign.images.map((img, index) => (
                      <div key={index} className="relative group aspect-square">
                        <img
                          src={img}
                          alt={`Ürün ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImageFromDesign(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <span className="absolute bottom-1 left-1 bg-black/70 px-2 py-0.5 rounded text-xs">
                          {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Product Info */}
              <Card>
                <h3 className="font-semibold mb-3">Ürün Bilgileri</h3>
                <div className="space-y-3">
                  <Input
                    label="Model Kodu"
                    placeholder="46356"
                    value={currentDesign.modelCode}
                    onChange={(e) => updateCurrentDesign('modelCode', e.target.value)}
                  />
                  <Input
                    label="Beden Seçenekleri"
                    placeholder="36/38/40/42/44"
                    value={currentDesign.sizes}
                    onChange={(e) => updateCurrentDesign('sizes', e.target.value)}
                  />
                  <Input
                    label="Materyal"
                    placeholder="275 GR ZR FABRIC"
                    value={currentDesign.material}
                    onChange={(e) => updateCurrentDesign('material', e.target.value)}
                  />
                  <Input
                    label="Yan Yazı (Watermark)"
                    placeholder="F-MOR"
                    value={currentDesign.brandWatermark}
                    onChange={(e) => updateCurrentDesign('brandWatermark', e.target.value)}
                  />
                </div>
              </Card>

              {/* Colors Table */}
              <Card>
                <h3 className="font-semibold mb-3">Renk Tablosu</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm font-medium text-slate-400 px-2">
                    <span>COLOR</span>
                    <span>PIECES</span>
                  </div>
                  {currentDesign.colors.map((row, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder={`Renk ${index + 1}`}
                        value={row.left}
                        onChange={(e) => updateColorRow(index, 'left', e.target.value)}
                        className="text-sm"
                      />
                      <Input
                        placeholder={`Parça ${index + 1}`}
                        value={row.right}
                        onChange={(e) => updateColorRow(index, 'right', e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Color Settings */}
              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-5 h-5" />
                  <h3 className="font-semibold">Renk Ayarları</h3>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {colorPresets.map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        updateCurrentDesign('backgroundColor', preset.bg);
                        updateCurrentDesign('headerColor', preset.header);
                        updateCurrentDesign('textColor', preset.text);
                      }}
                      className="px-3 py-1.5 rounded-lg text-sm border border-slate-600 hover:border-orange-500 transition-colors"
                      style={{ backgroundColor: preset.bg, color: preset.text }}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Arkaplan</label>
                    <input
                      type="color"
                      value={currentDesign.backgroundColor}
                      onChange={(e) => updateCurrentDesign('backgroundColor', e.target.value)}
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Başlık</label>
                    <input
                      type="color"
                      value={currentDesign.headerColor}
                      onChange={(e) => updateCurrentDesign('headerColor', e.target.value)}
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Metin</label>
                    <input
                      type="color"
                      value={currentDesign.textColor}
                      onChange={(e) => updateCurrentDesign('textColor', e.target.value)}
                      className="w-full h-10 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Right: Preview */}
            <div className="space-y-4">
              <Card className="sticky top-24">
                <h3 className="font-semibold mb-3">Önizleme</h3>
                <ProductPreview design={currentDesign} />

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={handleSave}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Kaydet
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={handleGeneratePDF}
                    disabled={isGenerating || currentDesign.images.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Oluşturuluyor...' : 'PDF İndir'}
                  </Button>
                </div>
              </Card>

              <Button
                variant="ghost"
                className="w-full"
                onClick={createNewDesign}
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Tasarım Başlat
              </Button>
            </div>
          </div>
        ) : (
          /* Saved Designs List */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Kayıtlı Tasarımlar</h2>
              <Button onClick={() => { createNewDesign(); setActiveTab('editor'); }}>
                <Plus className="w-4 h-4 mr-2" />
                Yeni Tasarım
              </Button>
            </div>

            {savedDesigns.length === 0 ? (
              <Card className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 text-slate-500" />
                <p className="text-slate-400">Henüz kayıtlı tasarım yok</p>
                <Button
                  className="mt-4"
                  onClick={() => setActiveTab('editor')}
                >
                  İlk Tasarımını Oluştur
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedDesigns.map((design) => (
                  <Card key={design.id} className="overflow-hidden">
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="w-24 h-24 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                        {design.images[0] ? (
                          <img
                            src={design.images[0]}
                            alt={design.name || 'Tasarım'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-slate-500" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">
                          {design.name || design.modelCode || 'İsimsiz Tasarım'}
                        </h3>
                        {design.modelCode && (
                          <p className="text-sm text-slate-400">Model: {design.modelCode}</p>
                        )}
                        <p className="text-xs text-slate-500 mt-1">
                          {design.images.length} fotoğraf
                        </p>

                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => { loadDesign(design.id); setActiveTab('editor'); }}
                          >
                            <Edit2 className="w-3 h-3 mr-1" />
                            Düzenle
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowDeleteModal(design.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal !== null}
        onClose={() => setShowDeleteModal(null)}
        title="Tasarımı Sil"
      >
        <p className="text-slate-400 mb-4">
          Bu tasarımı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={() => setShowDeleteModal(null)}>
            İptal
          </Button>
          <Button variant="danger" onClick={() => handleDelete(showDeleteModal)}>
            Sil
          </Button>
        </div>
      </Modal>
    </div>
  );
};

// Preview Component
const ProductPreview = ({ design }) => {
  const bgStyle = { backgroundColor: design.backgroundColor };
  const headerStyle = { backgroundColor: design.headerColor, color: '#ffffff' };
  const textStyle = { color: design.textColor };

  const isLandscape = design.orientation === 'landscape';
  const aspectClass = isLandscape ? 'aspect-[297/210]' : 'aspect-[210/297]';

  return (
    <div
      className={`${aspectClass} rounded-lg overflow-hidden border border-slate-600 relative`}
      style={bgStyle}
    >
      {/* Side Watermark */}
      {design.brandWatermark && (
        <div
          className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-around items-center py-4"
          style={{ backgroundColor: design.headerColor + '20' }}
        >
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="text-[8px] font-bold transform -rotate-90 whitespace-nowrap"
              style={{ color: design.headerColor }}
            >
              {design.brandWatermark}
            </span>
          ))}
        </div>
      )}

      <div className="p-3 pl-10 h-full flex">
        {/* Left: Images */}
        <div className="flex-1 flex flex-col gap-1">
          {design.images.length > 0 ? (
            <>
              {/* Main Image */}
              <div className="flex-1 bg-slate-200 rounded overflow-hidden">
                <img
                  src={design.images[0]}
                  alt="Ana"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Secondary Images */}
              {design.images.length > 1 && (
                <div className="flex gap-1 h-16">
                  {design.images.slice(1, 4).map((img, i) => (
                    <div key={i} className="flex-1 bg-slate-200 rounded overflow-hidden">
                      <img src={img} alt={`Ürün ${i + 2}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 bg-slate-200 rounded flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-slate-400" />
            </div>
          )}
        </div>

        {/* Right: Info Panel */}
        <div className="w-28 ml-2 flex flex-col text-[6px]">
          {/* Model Code */}
          <div className="mb-1 p-1 border rounded" style={{ borderColor: design.headerColor }}>
            <span style={textStyle}>Model Code : </span>
            <span className="font-bold" style={textStyle}>{design.modelCode || '-----'}</span>
          </div>

          {/* Color Table */}
          <div className="border rounded overflow-hidden mb-1" style={{ borderColor: design.headerColor }}>
            <div className="grid grid-cols-2" style={headerStyle}>
              <span className="p-0.5 font-bold text-center border-r" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>COLOR</span>
              <span className="p-0.5 font-bold text-center">PIECES</span>
            </div>
            {design.colors.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-2 border-t"
                style={{ borderColor: design.headerColor + '40' }}
              >
                <span className="p-0.5 text-center border-r" style={{ ...textStyle, borderColor: design.headerColor + '40' }}>
                  {row.left || '-'}
                </span>
                <span className="p-0.5 text-center" style={textStyle}>
                  {row.right || '-'}
                </span>
              </div>
            ))}
          </div>

          {/* Sizes */}
          <div className="p-1 border rounded text-center mb-1" style={{ borderColor: design.headerColor }}>
            <span className="font-bold" style={textStyle}>{design.sizes || '-----'}</span>
          </div>

          {/* Material */}
          {design.material && (
            <div className="p-1 rounded text-center" style={headerStyle}>
              <div className="font-bold">MATERIAL</div>
              <div className="mt-0.5">{design.material}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDesignerPage;
