import { http } from "./client";

export interface CreateBookingRequest {
  user_id: number;
  excursion_id: number;
  selected_date: string;
  guests_count: number;
  pickup_location_text?: string;
  comment?: string;
  total_price_amount?: number;
}

export async function createBooking(body: CreateBookingRequest) {
  const { data } = await http.post("/bookings", body);
  return data;
}
