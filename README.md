# Pdfo - Fotoğraftan PDF Oluşturucu

Fotoğraflarınızı anında profesyonel PDF'e dönüştürün. Firma logonuz ve bilgilerinizle özelleştirilmiş kapak sayfası oluşturun.

![Pdfo](./public/og-image.png)

## Özellikler

- 📸 **Çoklu Fotoğraf Yükleme** - Sürükle-bırak veya dosya seçici ile
- 🏢 **Firma Bilgileri** - Logo, ad, telefon, e-posta, adres
- 📄 **Profesyonel Kapak Sayfası** - Otomatik oluşturulan
- ⚡ **3 Kalite Seçeneği** - Düşük, Orta, Yüksek
- 📊 **Boyut Gösterimi** - PDF oluşturmadan önce tahmini boyut
- 💾 **Otomatik Kayıt** - Firma bilgileri tarayıcıda saklanır
- 📱 **PWA Desteği** - Mobil cihazlara yüklenebilir
- 🌐 **Çevrimdışı Çalışma** - İnternet olmadan kullanılabilir

## Kurulum

### Gereksinimler

- Node.js 18+
- npm veya yarn

### Adımlar

```bash
# Projeyi klonla
git clone https://github.com/yourusername/pdfo.git
cd pdfo

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Build'i önizle
npm run preview
```

## Proje Yapısı

```
pdfo/
├── public/
│   ├── favicon.svg
│   ├── pwa-192x192.png
│   └── pwa-512x512.png
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── ErrorBoundary.jsx
│   │   ├── Header.jsx
│   │   ├── HomePage.jsx
│   │   ├── ImageUpload.jsx
│   │   ├── QualitySelector.jsx
│   │   ├── SettingsPage.jsx
│   │   └── SplashScreen.jsx
│   ├── hooks/
│   │   └── index.js         # Custom React hooks
│   ├── utils/
│   │   ├── image.js         # Image processing utilities
│   │   └── pdf.js           # PDF generation utilities
│   ├── styles/
│   │   └── index.css        # Global styles
│   ├── App.jsx
│   ├── main.jsx
│   └── store.js             # Zustand state management
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Teknolojiler

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **jsPDF** - PDF generation
- **Lucide React** - Icons
- **PWA** - Progressive Web App support

## Kullanım

1. **Firma Bilgilerini Girin** (opsiyonel)
   - Sağ üstteki ayarlar ikonuna tıklayın
   - Logo, firma adı ve iletişim bilgilerini girin
   - Kaydedin

2. **Fotoğrafları Yükleyin**
   - Yükleme alanına tıklayın veya sürükleyip bırakın
   - Maksimum 50 fotoğraf ekleyebilirsiniz

3. **PDF Oluşturun**
   - "PDF Oluştur" butonuna tıklayın
   - Kalite seçeneğini belirleyin (Düşük/Orta/Yüksek)
   - Tahmini boyutu görün
   - Oluşturun

4. **Paylaşın veya İndirin**
   - "Paylaş" ile cihazınızın paylaşım menüsünü açın
   - Veya direkt indirin

## Kalite Seçenekleri

| Kalite | Sıkıştırma | Boyut | Kullanım |
|--------|------------|-------|----------|
| Düşük | %40 | ~30% | WhatsApp, hızlı paylaşım |
| Orta | %70 | ~60% | E-posta, genel kullanım |
| Yüksek | %95 | ~100% | Baskı, arşiv |

## Tarayıcı Desteği

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## Lisans

MIT License - detaylar için [LICENSE](LICENSE) dosyasına bakın.

## Geliştirici

Pdfo - [pdfo.app](https://pdfo.app)

---

Made with ❤️ and ☕
