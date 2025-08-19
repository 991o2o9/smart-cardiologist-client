export interface ActivateAccountData {
  activation_code: string;
  email: string;
}

export interface ResendCodeData {
  email: string;
}

export interface ApiResponse {
  message: string;
  success: boolean;
}
