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
        textColor: '#333333',
        orientation: 'portrait' // 'portrait' or 'landscape'
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
          textColor: '#333333',
          orientation: 'portrait'
        }
      })
    }),
    {
      name: 'pdfo-cover-storage',
      version: 1,
    }
  )
);

// Product Designer store with persistence
export const useProductDesignStore = create(
  persist(
    (set, get) => ({
      // Current design being edited
      currentDesign: {
        id: null,
        name: '',
        modelCode: '',
        orientation: 'portrait', // 'portrait' or 'landscape'
        images: [], // Array of image data URLs (max 4)
        colors: [
          { left: '', right: '' },
          { left: '', right: '' },
          { left: '', right: '' },
          { left: '', right: '' },
          { left: '', right: '' }
        ],
        sizes: '36/38/40/42/44',
        material: '',
        brandWatermark: '', // Side watermark text like F-MOR
        backgroundColor: '#ffffff',
        headerColor: '#000000',
        textColor: '#333333'
      },

      // Saved designs list
      savedDesigns: [],

      // Actions for current design
      updateCurrentDesign: (field, value) =>
        set((state) => ({
          currentDesign: { ...state.currentDesign, [field]: value }
        })),

      updateColorRow: (index, side, value) =>
        set((state) => {
          const newColors = [...state.currentDesign.colors];
          newColors[index] = { ...newColors[index], [side]: value };
          return { currentDesign: { ...state.currentDesign, colors: newColors } };
        }),

      addImageToDesign: (imageDataUrl) =>
        set((state) => {
          if (state.currentDesign.images.length >= 4) return state;
          return {
            currentDesign: {
              ...state.currentDesign,
              images: [...state.currentDesign.images, imageDataUrl]
            }
          };
        }),

      removeImageFromDesign: (index) =>
        set((state) => ({
          currentDesign: {
            ...state.currentDesign,
            images: state.currentDesign.images.filter((_, i) => i !== index)
          }
        })),

      // Save current design
      saveCurrentDesign: () =>
        set((state) => {
          const { currentDesign, savedDesigns } = state;
          const newDesign = {
            ...currentDesign,
            id: currentDesign.id || Date.now().toString(),
            updatedAt: new Date().toISOString()
          };

          const existingIndex = savedDesigns.findIndex(d => d.id === newDesign.id);
          let newSavedDesigns;

          if (existingIndex >= 0) {
            newSavedDesigns = [...savedDesigns];
            newSavedDesigns[existingIndex] = newDesign;
          } else {
            newSavedDesigns = [...savedDesigns, newDesign];
          }

          return {
            savedDesigns: newSavedDesigns,
            currentDesign: newDesign
          };
        }),

      // Load a saved design for editing
      loadDesign: (designId) =>
        set((state) => {
          const design = state.savedDesigns.find(d => d.id === designId);
          if (design) {
            return { currentDesign: { ...design } };
          }
          return state;
        }),

      // Delete a saved design
      deleteDesign: (designId) =>
        set((state) => ({
          savedDesigns: state.savedDesigns.filter(d => d.id !== designId)
        })),

      // Create new design (reset current)
      createNewDesign: () =>
        set({
          currentDesign: {
            id: null,
            name: '',
            modelCode: '',
            orientation: 'portrait',
            images: [],
            colors: [
              { left: '', right: '' },
              { left: '', right: '' },
              { left: '', right: '' },
              { left: '', right: '' },
              { left: '', right: '' }
            ],
            sizes: '36/38/40/42/44',
            material: '',
            brandWatermark: '',
            backgroundColor: '#ffffff',
            headerColor: '#000000',
            textColor: '#333333'
          }
        }),

      // Reset store
      resetProductDesignStore: () =>
        set({
          currentDesign: {
            id: null,
            name: '',
            modelCode: '',
            orientation: 'portrait',
            images: [],
            colors: [
              { left: '', right: '' },
              { left: '', right: '' },
              { left: '', right: '' },
              { left: '', right: '' },
              { left: '', right: '' }
            ],
            sizes: '36/38/40/42/44',
            material: '',
            brandWatermark: '',
            backgroundColor: '#ffffff',
            headerColor: '#000000',
            textColor: '#333333'
          },
          savedDesigns: []
        })
    }),
    {
      name: 'pdfo-product-design-storage',
      version: 1,
    }
  )
);
