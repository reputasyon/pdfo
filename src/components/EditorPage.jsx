import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Upload,
  Phone,
  Instagram,
  Send,
  Palette,
  Type,
  Image as ImageIcon,
  Download,
  RotateCcw,
  Eye
} from 'lucide-react';
import { Button, Input, Card } from './ui';
import { useAppStore, useCoverStore } from '../store';
import CoverPreview from './CoverPreview';

const EditorPage = () => {
  const { setCurrentPage } = useAppStore();
  const { coverInfo, updateCoverField, resetCoverInfo } = useCoverStore();
  const [activeTab, setActiveTab] = useState('content');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const logoInputRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateCoverField('logo', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    updateCoverField('logo', null);
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const tabs = [
    { id: 'content', label: 'İçerik', icon: Type },
    { id: 'contact', label: 'İletişim', icon: Phone },
    { id: 'style', label: 'Stil', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage('home')}
              className="w-10 h-10 bg-slate-700/50 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-lg">Kapak Editörü</h1>
              <p className="text-xs text-slate-400">Katalog kapağı tasarla</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetCoverInfo}
              className="text-slate-400"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowPreviewModal(true)}
              className="lg:hidden"
            >
              <Eye className="w-4 h-4 mr-1" />
              Önizle
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-32">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Editor Form */}
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content Tab */}
            {activeTab === 'content' && (
              <Card className="space-y-4 animate-fade-in">
                {/* Logo Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 uppercase tracking-wider block">
                    Logo
                  </label>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />

                  {coverInfo.logo ? (
                    <div className="relative group">
                      <div className="w-full h-32 bg-slate-700/50 rounded-xl flex items-center justify-center overflow-hidden">
                        <img
                          src={coverInfo.logo}
                          alt="Logo"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => logoInputRef.current?.click()}
                        >
                          Değiştir
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={handleRemoveLogo}
                        >
                          Kaldır
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="logo-upload"
                      className="w-full h-32 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-orange-500 hover:bg-slate-700/30 transition-all"
                    >
                      <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6 text-slate-400" />
                      </div>
                      <span className="text-sm text-slate-400">Logo yükle</span>
                    </label>
                  )}
                </div>

                {/* Brand Name */}
                <Input
                  label="Marka Adı"
                  placeholder="F-MOR"
                  value={coverInfo.brandName}
                  onChange={(e) => updateCoverField('brandName', e.target.value)}
                  icon={Type}
                />

                {/* Subtitle */}
                <Input
                  label="Alt Başlık"
                  placeholder="COLLECTION CATALOGUE"
                  value={coverInfo.subtitle}
                  onChange={(e) => updateCoverField('subtitle', e.target.value)}
                  icon={ImageIcon}
                />
              </Card>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <Card className="space-y-4 animate-fade-in">
                <Input
                  label="WhatsApp 1"
                  placeholder="+90 533 451 11 75"
                  value={coverInfo.whatsapp1}
                  onChange={(e) => updateCoverField('whatsapp1', e.target.value)}
                  icon={Phone}
                />

                <Input
                  label="WhatsApp 2"
                  placeholder="+90 544 450 75 75"
                  value={coverInfo.whatsapp2}
                  onChange={(e) => updateCoverField('whatsapp2', e.target.value)}
                  icon={Phone}
                />

                <Input
                  label="Instagram"
                  placeholder="@fmorstore"
                  value={coverInfo.instagram}
                  onChange={(e) => updateCoverField('instagram', e.target.value)}
                  icon={Instagram}
                />

                <Input
                  label="Telegram"
                  placeholder="@fmorstore"
                  value={coverInfo.telegram}
                  onChange={(e) => updateCoverField('telegram', e.target.value)}
                  icon={Send}
                />
              </Card>
            )}

            {/* Style Tab */}
            {activeTab === 'style' && (
              <Card className="space-y-4 animate-fade-in">
                {/* Background Color */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 uppercase tracking-wider block">
                    Arkaplan Rengi
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={coverInfo.backgroundColor}
                      onChange={(e) => updateCoverField('backgroundColor', e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer border-2 border-slate-600"
                    />
                    <Input
                      value={coverInfo.backgroundColor}
                      onChange={(e) => updateCoverField('backgroundColor', e.target.value)}
                      className="flex-1"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>

                {/* Brand Color */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 uppercase tracking-wider block">
                    Marka Rengi
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={coverInfo.brandColor}
                      onChange={(e) => updateCoverField('brandColor', e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer border-2 border-slate-600"
                    />
                    <Input
                      value={coverInfo.brandColor}
                      onChange={(e) => updateCoverField('brandColor', e.target.value)}
                      className="flex-1"
                      placeholder="#e91e8c"
                    />
                  </div>
                </div>

                {/* Text Color */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 uppercase tracking-wider block">
                    Metin Rengi
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={coverInfo.textColor}
                      onChange={(e) => updateCoverField('textColor', e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer border-2 border-slate-600"
                    />
                    <Input
                      value={coverInfo.textColor}
                      onChange={(e) => updateCoverField('textColor', e.target.value)}
                      className="flex-1"
                      placeholder="#333333"
                    />
                  </div>
                </div>

                {/* Preset Colors */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 uppercase tracking-wider block">
                    Hazır Temalar
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { bg: '#ffffff', brand: '#e91e8c', text: '#333333', name: 'Pembe' },
                      { bg: '#1a1a2e', brand: '#eab308', text: '#ffffff', name: 'Altın' },
                      { bg: '#f5f5dc', brand: '#8b4513', text: '#333333', name: 'Klasik' },
                      { bg: '#000000', brand: '#ffffff', text: '#ffffff', name: 'Siyah' },
                    ].map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          updateCoverField('backgroundColor', preset.bg);
                          updateCoverField('brandColor', preset.brand);
                          updateCoverField('textColor', preset.text);
                        }}
                        className="p-3 rounded-xl border border-slate-600 hover:border-orange-500 transition-colors group"
                        style={{ backgroundColor: preset.bg }}
                      >
                        <div
                          className="w-full h-4 rounded mb-1"
                          style={{ backgroundColor: preset.brand }}
                        />
                        <span
                          className="text-xs font-medium"
                          style={{ color: preset.text }}
                        >
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Preview - Desktop */}
          <div className="hidden lg:block sticky top-24">
            <Card className="p-2">
              <div className="text-sm font-medium text-slate-400 mb-2 text-center">
                Önizleme
              </div>
              <CoverPreview coverInfo={coverInfo} />
            </Card>
          </div>
        </div>
      </main>

      {/* Mobile Preview Modal */}
      {showPreviewModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            className="w-full max-w-sm animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <CoverPreview coverInfo={coverInfo} />
            <Button
              fullWidth
              variant="secondary"
              className="mt-4"
              onClick={() => setShowPreviewModal(false)}
            >
              Kapat
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 safe-bottom">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button fullWidth size="lg">
            <Download className="w-5 h-5 mr-2" />
            Kapağı PDF'e Ekle
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
