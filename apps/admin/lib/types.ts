type AuthPayload = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role?: string;
  };
};

export interface AuthResponse {
  data?: {
    signup?: AuthPayload;
    login?: AuthPayload;
  };
  errors?: Array<{ message: string }>;
}
export type SignupInput = {
  email: string;
  password: string;
}