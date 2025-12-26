export interface ExamDetails {
  date?: string;
  time?: string;
  location?: string;
}

export interface AdmissionEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  toEmail: string;
  admissionLetterUrl?: string;
  qrCodeFile?: string;
  examDetails?: ExamDetails;
}

export interface EmailResponse {
  message?: string;
  error?: string;
}
