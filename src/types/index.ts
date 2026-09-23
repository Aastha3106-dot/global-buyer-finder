export interface Buyer {
  place_id: string;
  name: string;
  category: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  google_maps_uri?: string;
  source: string;
}

export interface SavedBuyer extends Buyer {
  id: string;
  created_at: string;
  raw_data?: Record<string, unknown> | null;
}

export interface EmailHistoryItem {
  id: string;
  buyer_name: string | null;
  recipient: string | null;
  subject: string | null;
  message: string | null;
  status: string;
  error_detail: string | null;
  created_at: string;
}

export interface RecentSearch {
  id: string;
  query: string;
  country: string | null;
  state: string | null;
  city: string | null;
  category: string | null;
  keyword: string | null;
  results_count: number;
  created_at: string;
}

export interface SearchFilters {
  country: string;
  state: string;
  city: string;
  category: string;
  keyword: string;
}

export interface ApiStatusResponse {
  googlePlacesAPI: string;
  emailAPI: string;
}

export interface FindBuyersResponse {
  buyers: Buyer[];
  configured: boolean;
  searchQuery?: string;
  totalCount?: number;
  error?: string;
  details?: string;
}

export interface SendEmailResponse {
  success: boolean;
  status: string;
  error?: string;
  messageId?: string;
  notConfigured?: boolean;
  buyer_name?: string;
  recipient?: string;
  subject?: string;
  message?: string;
}
