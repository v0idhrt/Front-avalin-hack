export interface UserDto {
  id: number;
  email: string;
  role: "tourist" | "vendor" | "admin";
  created_at?: string;
  updated_at?: string;
  fullName?: string;
  avatar?: string;
  organizerId?: string;
  stats?: {
    subscriptions: number;
    routes: number;
    likes: number;
    reviews: number;
    bookings: number;
  };
}

export interface AuthResponseDto {
  token?: string;
  access_token?: string;
  user: UserDto;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface RegisterDto {
  email: string;
  password?: string;
  role: "tourist" | "vendor";
}
