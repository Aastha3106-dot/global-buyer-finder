import { EDGE_FUNCTION_BASE } from "@/lib/supabase";
import type {
  SearchFilters,
  FindBuyersResponse,
  SendEmailResponse,
  ApiStatusResponse,
} from "@/types";

export async function findBuyers(
  filters: SearchFilters
): Promise<FindBuyersResponse> {
  const response = await fetch(`${EDGE_FUNCTION_BASE}/find-buyers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filters),
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  const data = (await response.json()) as FindBuyersResponse;
  return data;
}

export async function sendEmail(
  recipient: string,
  subject: string,
  message: string,
  buyerName?: string
): Promise<SendEmailResponse> {
  const response = await fetch(`${EDGE_FUNCTION_BASE}/send-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient,
      subject,
      message,
      buyer_name: buyerName || "",
    }),
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  const data = (await response.json()) as SendEmailResponse;
  return data;
}

export async function getApiStatus(): Promise<ApiStatusResponse> {
  const response = await fetch(`${EDGE_FUNCTION_BASE}/api-status`);
  if (!response.ok) {
    return { googlePlacesAPI: "Not Configured", emailAPI: "Not Configured" };
  }
  return (await response.json()) as ApiStatusResponse;
}
