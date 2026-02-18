export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "EMPLOYEE" | "PIC" | "C_LEVEL" | "HRD" | "FINANCE" | "SUPERADMIN";
  dept_id: string;
  department?: Department;
  created_at?: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  created_at?: string;
  updated_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
  message: string;
}

export interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface OvertimeSubmission {
  id: string;
  employee_id: string;
  employee?: User;
  date: string;
  start_time: string;
  end_time: string;
  duration_min: number;
  status: OvertimeStatus;
  signature_pic: string | null;
  signature_clevel: string | null;
  signature_hrd: string | null;
  applied_rate: number;
  total_pay: number;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export type OvertimeStatus =
  | "PENDING_PIC"
  | "PENDING_C_LEVEL"
  | "PENDING_HRD"
  | "COMPLETED"
  | "REJECTED";

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

export interface OvertimeLog {
  id: string;
  submission_id: string;
  action_by: string;
  action_by_user?: User;
  action: string;
  old_status: string | null;
  new_status: string;
  note: string | null;
  created_at: string;
}

export interface GlobalSetting {
  id: number;
  key: string;
  value: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}
