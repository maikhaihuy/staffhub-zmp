export interface EmployeeInfo {
  id: string;
  name: string;
  role: 'staff' | 'admin' | 'manager';
  zaloId: string;
}

export interface LoginResponse {
  accessToken: string; // JWT do NestJS cấp
  employee: EmployeeInfo;
}
