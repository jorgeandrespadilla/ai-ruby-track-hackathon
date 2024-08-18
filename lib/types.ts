export interface AnalysisResult {
  isComplaint: boolean;
  summary: string | null;
  product: string | null;
  sub_product: string | null;
  rating: string | null;
  company: string | null;
}

export interface SimilarComplaint {
  complaintId: string;
  complaintSummary: string;
}
