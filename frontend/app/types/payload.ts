export interface ChangePasswordPayload {
  id: string;
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface EditProfilePayload {
  id: string;
  name: string;
  email: string;
  role: String;
}
