import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface OCRConfidence {
  field_name: string;
  confidence_score: string;
}

export interface OCRItem {
  name: string;
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface OCRResult {
  ocr_id: string;
  merchant_name: string | null;
  total_amount: string | null;
  transaction_date: string | null;
  payment_method: string | null;
  items: OCRItem[];
  confidence_scores: OCRConfidence[] | null;
  image_url: string;
  receipt_status: 'pending' | 'processed' | 'accepted' | 'rejected';
}

export interface ReceiptState {
  currentOCRId: string | null;
  ocrResult: OCRResult | null;
  uploadProgress: number;
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
  scanActive: boolean;
}

const initialState: ReceiptState = {
  currentOCRId: null,
  ocrResult: null,
  uploadProgress: 0,
  isLoading: false,
  isUploading: false,
  error: null,
  scanActive: false,
};

export const receiptSlice = createSlice({
  name: 'receipts',
  initialState,
  reducers: {
    startUpload: state => {
      state.isUploading = true;
      state.uploadProgress = 0;
      state.error = null;
    },
    updateUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    uploadSuccess: (state, action: PayloadAction<{ocr_id: string}>) => {
      state.isUploading = false;
      state.currentOCRId = action.payload.ocr_id;
      state.uploadProgress = 100;
    },
    uploadFailure: (state, action: PayloadAction<string>) => {
      state.isUploading = false;
      state.error = action.payload;
    },
    fetchOCRResultStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    fetchOCRResultSuccess: (state, action: PayloadAction<OCRResult>) => {
      state.isLoading = false;
      state.ocrResult = action.payload;
    },
    fetchOCRResultFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearOCRResult: state => {
      state.ocrResult = null;
      state.currentOCRId = null;
    },
    setScanActive: (state, action: PayloadAction<boolean>) => {
      state.scanActive = action.payload;
    },
  },
});

export const {
  startUpload,
  updateUploadProgress,
  uploadSuccess,
  uploadFailure,
  fetchOCRResultStart,
  fetchOCRResultSuccess,
  fetchOCRResultFailure,
  clearOCRResult,
  setScanActive,
} = receiptSlice.actions;

export default receiptSlice.reducer;
