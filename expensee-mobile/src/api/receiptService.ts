import apiClient from './client';
import {API} from '../constants';

export interface OCRItem {
  name: string;
  quantity: number;
  unit_price: number | string;
  total_price: number | string;
}

export interface AcceptOCRRequest {
  merchant_name: string | null;
  total_amount: number | string | null;
  transaction_date: string | null;
  payment_method: string | null;
  category_id: string | null;
  user_category_id: string | null;
  items: OCRItem[];
  notes: string | null;
}

export interface OCRFeedbackItem {
  field_name: string;
  original_value: string;
  corrected_value: string;
}

export interface OCRFeedbackRequest {
  corrections: OCRFeedbackItem[];
}

const receiptService = {
  uploadReceipt: async (formData: FormData, userNotes?: string) => {
    if (userNotes) {
      formData.append('user_notes', userNotes);
    }

    const response = await apiClient.post(
      API.ENDPOINTS.RECEIPTS.UPLOAD_GEMINI,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          // Calculate and track upload progress if needed
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      },
    );

    return response.data;
  },

  getReceiptStatus: async (ocrId: string) => {
    const response = await apiClient.get(API.ENDPOINTS.RECEIPTS.STATUS(ocrId));
    return response.data;
  },

  getOCRResults: async (ocrId: string) => {
    const response = await apiClient.get(
      API.ENDPOINTS.RECEIPTS.OCR_RESULTS(ocrId),
    );
    return response.data;
  },

  submitOCRFeedback: async (ocrId: string, data: OCRFeedbackRequest) => {
    const response = await apiClient.post(
      API.ENDPOINTS.RECEIPTS.FEEDBACK(ocrId),
      data,
    );
    return response.data;
  },

  acceptOCRResults: async (ocrId: string, data: AcceptOCRRequest) => {
    const response = await apiClient.post(
      API.ENDPOINTS.RECEIPTS.ACCEPT(ocrId),
      data,
    );
    return response.data;
  },
};

export default receiptService;
