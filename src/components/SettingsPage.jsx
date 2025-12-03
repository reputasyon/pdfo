import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, Building2, Phone, Mail, MapPin, Globe, 
  Save, Camera, Trash2, CheckCircle 
} from 'lucide-react';
import { Button, Input, TextArea, IconButton } from './ui';
import { useCompanyStore, useAppStore } from '../store';

const SettingsPage = () => {
  const { companyInfo, setCompanyInfo } = useCompanyStore();
  const { setCurrentPage } = useAppStore();
  
  const logoInputRef = useRef(null);
  const [localInfo, setLocalInfo] = useState(companyInfo);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB for logo)
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

  const updateField = (field, value) => {
    setLocalInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
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
    if (!validateForm()) return;
    
    setCompanyInfo(localInfo);
    setSaved(true);
    
    setTimeout(() => {
      setSaved(false);
      setCurrentPage('home');
    }, 1000);
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

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
          <h1 className="font-bold text-lg">Firma Ayarları</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 pb-32">
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

        {/* Preview hint */}
        <p className="text-slate-500 text-sm mt-6 text-center">
          Bu bilgiler PDF'in kapak sayfasında görünecektir.
        </p>
      </main>

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
