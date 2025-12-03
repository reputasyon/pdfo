import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Company settings store with persistence
export const useCompanyStore = create(
  persist(
    (set) => ({
      companyInfo: {
        logo: null,
        name: '',
        phone: '',
        email: '',
        website: '',
        address: ''
      },
      setCompanyInfo: (info) => set({ companyInfo: info }),
      updateCompanyField: (field, value) => 
        set((state) => ({
          companyInfo: { ...state.companyInfo, [field]: value }
        })),
      resetCompanyInfo: () => set({
        companyInfo: {
          logo: null,
          name: '',
          phone: '',
          email: '',
          website: '',
          address: ''
        }
      })
    }),
    {
      name: 'pdfo-company-storage',
      version: 1,
    }
  )
);

// App state store
export const useAppStore = create((set, get) => ({
  // Images
  images: [],
  addImages: (newImages) => set((state) => ({
    images: [...state.images, ...newImages],
    pdfReady: false,
    pdfUrl: null,
    pdfSize: null
  })),
  removeImage: (id) => set((state) => ({
    images: state.images.filter(img => img.id !== id),
    pdfReady: false,
    pdfUrl: null,
    pdfSize: null
  })),
  reorderImages: (fromIndex, toIndex) => set((state) => {
    const newImages = [...state.images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    return { images: newImages, pdfReady: false, pdfUrl: null, pdfSize: null };
  }),
  clearImages: () => set({ 
    images: [], 
    pdfReady: false, 
    pdfUrl: null, 
    pdfSize: null 
  }),

  // PDF State
  pdfReady: false,
  pdfUrl: null,
  pdfSize: null,
  selectedQuality: 'medium',
  isConverting: false,
  conversionProgress: 0,
  
  setPdfReady: (ready) => set({ pdfReady: ready }),
  setPdfUrl: (url) => set({ pdfUrl: url }),
  setPdfSize: (size) => set({ pdfSize: size }),
  setSelectedQuality: (quality) => set({ selectedQuality: quality }),
  setIsConverting: (converting) => set({ isConverting: converting }),
  setConversionProgress: (progress) => set({ conversionProgress: progress }),

  // UI State
  currentPage: 'home',
  showQualityModal: false,
  showShareMenu: false,
  errorMessage: null,
  
  setCurrentPage: (page) => set({ currentPage: page }),
  setShowQualityModal: (show) => set({ showQualityModal: show }),
  setShowShareMenu: (show) => set({ showShareMenu: show }),
  setErrorMessage: (message) => set({ errorMessage: message }),
  clearError: () => set({ errorMessage: null }),

  // Reset all state
  resetAll: () => set({
    images: [],
    pdfReady: false,
    pdfUrl: null,
    pdfSize: null,
    isConverting: false,
    conversionProgress: 0,
    currentPage: 'home',
    showQualityModal: false,
    showShareMenu: false,
    errorMessage: null
  })
}));

// Settings store
export const useSettingsStore = create(
  persist(
    (set) => ({
      defaultQuality: 'medium',
      autoDownload: false,
      showTutorial: true,

      setDefaultQuality: (quality) => set({ defaultQuality: quality }),
      setAutoDownload: (auto) => set({ autoDownload: auto }),
      setShowTutorial: (show) => set({ showTutorial: show })
    }),
    {
      name: 'pdfo-settings-storage',
      version: 1,
    }
  )
);

// Cover Editor store with persistence
export const useCoverStore = create(
  persist(
    (set) => ({
      coverInfo: {
        logo: null,
        brandName: '',
        subtitle: '',
        whatsapp1: '',
        whatsapp2: '',
        instagram: '',
        telegram: '',
        backgroundColor: '#ffffff',
        brandColor: '#e91e8c',
        textColor: '#333333'
      },
      setCoverInfo: (info) => set({ coverInfo: info }),
      updateCoverField: (field, value) =>
        set((state) => ({
          coverInfo: { ...state.coverInfo, [field]: value }
        })),
      resetCoverInfo: () => set({
        coverInfo: {
          logo: null,
          brandName: '',
          subtitle: '',
          whatsapp1: '',
          whatsapp2: '',
          instagram: '',
          telegram: '',
          backgroundColor: '#ffffff',
          brandColor: '#e91e8c',
          textColor: '#333333'
        }
      })
    }),
    {
      name: 'pdfo-cover-storage',
      version: 1,
    }
  )
);
