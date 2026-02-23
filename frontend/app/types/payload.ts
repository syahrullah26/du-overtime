export interface ChangePasswordPayload {
  id: number;
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface EditProfilePayload {
  id: number;
  name: string;
  email: string;
  role: String;
  avatar?: File | string | null;
  profile_picture?: File | string | null;
  signature?: File | string | null;
}
