export interface SelectOption {
  value: string;
  label: string;
}
export const roleOptions: SelectOption[] = [
  { value: "EMPLOYEE", label: "Employee" },
  { value: "PIC", label: "PIC" },
  { value: "HRD", label: "HRD" },
  { value: "C-LEVEL", label: "C Level Executive" },
] as const;
