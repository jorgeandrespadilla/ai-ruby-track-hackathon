export interface AnalysisResult {
  isComplaint: boolean;
  summary: string | null;
  product: string | null;
  sub_product: string | null;
  rating: string | null;
  company: string | null;
}

export interface ResponseData {
  transcript: string;
  fileUrl?: string;
  analysis: AnalysisResult[];
  userId: number;
}