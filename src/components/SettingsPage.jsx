import React, { useState, useRef } from 'react';
import {
  ArrowLeft, Building2, Phone, Mail, MapPin, Globe,
  Save, Camera, Trash2, CheckCircle, Instagram, Send,
  Type, Palette, Image as ImageIcon
} from 'lucide-react';
import { Button, Input, TextArea, IconButton, Card } from './ui';
import { useCompanyStore, useAppStore, useCoverStore } from '../store';
import CoverPreview from './CoverPreview';

// WhatsApp Icon
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const SettingsPage = () => {
  const { companyInfo, setCompanyInfo } = useCompanyStore();
  const { coverInfo, updateCoverField, resetCoverInfo } = useCoverStore();
  const { setCurrentPage } = useAppStore();

  const logoInputRef = useRef(null);
  const coverLogoInputRef = useRef(null);
  const [localInfo, setLocalInfo] = useState(companyInfo);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('company');
  const [showPreview, setShowPreview] = useState(false);

  // Company logo handlers
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, logo: 'Logo 2MB\'den küçük olmalı' }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setLocalInfo(prev => ({ ...prev, logo: e.target.result }));
        setErrors(prev => ({ ...prev, logo: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLocalInfo(prev => ({ ...prev, logo: null }));
  };

  // Cover logo handlers
  const handleCoverLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateCoverField('logo', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCoverLogo = () => {
    updateCoverField('logo', null);
    if (coverLogoInputRef.current) {
      coverLogoInputRef.current.value = '';
    }
  };

  const updateField = (field, value) => {
    setLocalInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (localInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localInfo.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }

    if (localInfo.phone && !/^[\d\s\+\-\(\)]+$/.test(localInfo.phone)) {
      newErrors.phone = 'Geçerli bir telefon numarası girin';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (activeTab === 'company' && !validateForm()) return;

    if (activeTab === 'company') {
      setCompanyInfo(localInfo);
    }

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 1500);
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  const tabs = [
    { id: 'company', label: 'Firma', icon: Building2 },
    { id: 'cover', label: 'Kapak Tasarımı', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
          <IconButton
            icon={ArrowLeft}
            onClick={handleBack}
            aria-label="Geri dön"
          />
          <h1 className="font-bold text-lg">Ayarlar</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 pb-32">
        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl mb-6">
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

        {/* Company Tab */}
        {activeTab === 'company' && (
          <div className="animate-fade-in">
            {/* Logo Upload */}
            <div className="mb-6">
              <label className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3 block">
                Firma Logosu
              </label>

              <div
                onClick={() => logoInputRef.current?.click()}
                className="relative group cursor-pointer"
              >
                <div
                  className={`
                    w-full h-40
                    bg-slate-800/50 border-2 border-dashed
                    ${errors.logo ? 'border-red-500' : 'border-slate-600 group-hover:border-orange-500'}
                    rounded-2xl flex items-center justify-center
                    transition-all overflow-hidden
                  `}
                >
                  {localInfo.logo ? (
                    <img
                      src={localInfo.logo}
                      alt="Firma logosu"
                      className="max-h-full max-w-full object-contain p-4"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      <Camera className="w-10 h-10" />
                      <span className="text-sm">Logo Yükle</span>
                      <span className="text-xs text-slate-600">Max 2MB</span>
                    </div>
                  )}
                </div>

                {localInfo.logo && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLogo();
                    }}
                    className="
                      absolute top-2 right-2
                      w-8 h-8 bg-red-500/90 rounded-full
                      flex items-center justify-center
                      opacity-0 group-hover:opacity-100
                      transition-opacity
                    "
                    aria-label="Logoyu kaldır"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>

              {errors.logo && (
                <p className="text-red-400 text-sm mt-2">{errors.logo}</p>
              )}

              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                aria-label="Logo dosyası seç"
              />
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <Input
                label="Firma Adı"
                icon={Building2}
                type="text"
                value={localInfo.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Firma adınız"
                maxLength={100}
              />

              <Input
                label="Telefon"
                icon={Phone}
                type="tel"
                value={localInfo.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+90 555 123 4567"
                error={errors.phone}
                maxLength={20}
              />

              <Input
                label="E-posta"
                icon={Mail}
                type="email"
                value={localInfo.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="info@firma.com"
                error={errors.email}
                maxLength={100}
              />

              <Input
                label="Web Sitesi"
                icon={Globe}
                type="url"
                value={localInfo.website}
                onChange={(e) => updateField('website', e.target.value)}
                placeholder="www.firma.com"
                maxLength={100}
              />

              <TextArea
                label="Adres"
                icon={MapPin}
                value={localInfo.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="Firma adresi"
                rows={3}
                maxLength={200}
              />
            </div>

            <p className="text-slate-500 text-sm mt-6 text-center">
              Bu bilgiler PDF'in kapak sayfasında görünecektir.
            </p>
          </div>
        )}

        {/* Cover Design Tab */}
        {activeTab === 'cover' && (
          <div className="animate-fade-in space-y-6">
            {/* Preview Button */}
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowPreview(true)}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Önizleme
            </Button>

            {/* Content Section */}
            <Card className="space-y-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Type className="w-4 h-4 text-orange-400" />
                İçerik
              </h3>

              {/* Cover Logo Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 uppercase tracking-wider block">
                  Kapak Logosu
                </label>
                <input
                  ref={coverLogoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverLogoUpload}
                  className="hidden"
                  id="cover-logo-upload"
                />

                {coverInfo.logo ? (
                  <div className="relative group">
                    <div className="w-full h-24 bg-slate-700/50 rounded-xl flex items-center justify-center overflow-hidden">
                      <img
                        src={coverInfo.logo}
                        alt="Logo"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => coverLogoInputRef.current?.click()}
                      >
                        Değiştir
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={removeCoverLogo}
                      >
                        Kaldır
                      </Button>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="cover-logo-upload"
                    className="w-full h-24 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-orange-500 hover:bg-slate-700/30 transition-all"
                  >
                    <Camera className="w-6 h-6 text-slate-400" />
                    <span className="text-sm text-slate-400">Logo yükle</span>
                  </label>
                )}
              </div>

              <Input
                label="Marka Adı"
                placeholder="F-MOR"
                value={coverInfo.brandName}
                onChange={(e) => updateCoverField('brandName', e.target.value)}
                icon={Type}
              />

              <Input
                label="Alt Başlık"
                placeholder="COLLECTION CATALOGUE"
                value={coverInfo.subtitle}
                onChange={(e) => updateCoverField('subtitle', e.target.value)}
                icon={ImageIcon}
              />
            </Card>

            {/* Contact Section */}
            <Card className="space-y-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400" />
                İletişim Bilgileri
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 uppercase tracking-wider block">
                  WhatsApp 1
                </label>
                <div className="relative">
                  <WhatsAppIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  <input
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="+90 533 451 11 75"
                    value={coverInfo.whatsapp1}
                    onChange={(e) => updateCoverField('whatsapp1', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 uppercase tracking-wider block">
                  WhatsApp 2
                </label>
                <div className="relative">
                  <WhatsAppIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  <input
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="+90 544 450 75 75"
                    value={coverInfo.whatsapp2}
                    onChange={(e) => updateCoverField('whatsapp2', e.target.value)}
                  />
                </div>
              </div>

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

            {/* Style Section */}
            <Card className="space-y-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-orange-400" />
                Stil
              </h3>

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
                      className="p-3 rounded-xl border border-slate-600 hover:border-orange-500 transition-colors"
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

              {/* Reset Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={resetCoverInfo}
                className="text-slate-400 w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Sıfırla
              </Button>
            </Card>
          </div>
        )}
      </main>

      {/* Preview Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowPreview(false)}
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
              onClick={() => setShowPreview(false)}
            >
              Kapat
            </Button>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={handleSave}
            fullWidth
            size="lg"
            variant={saved ? 'secondary' : 'primary'}
            className={saved ? 'bg-green-500 hover:bg-green-500' : ''}
          >
            {saved ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Kaydedildi!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Kaydet
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
