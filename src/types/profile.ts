export type ResidenceStatus = "temporary_residence" | "temporary_absence" | "not_applicable";

export interface PersonalInfo {
  fullName: string;
  dateOfBirth?: string;
}

export interface IdentityCardInfo {
  number?: string;
  fullName?: string;
  issuedDate?: string;
  issuedPlace?: string;
  frontImageUrl?: string;
  backImageUrl?: string;
}

export interface ResidenceInfo {
  address?: string;
  ward?: string;
  district?: string;
  province?: string;
  status?: ResidenceStatus;
  notes?: string;
}

export interface BankAccountInfo {
  bankCode?: string;
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
  branch?: string;
}

export interface StaffProfile {
  id: string;
  fullName: string;
  phone?: string;
  role: "staff";
  branchName?: string;
  avatarUrl?: string;
  personalInfo: PersonalInfo;
  identityCard: IdentityCardInfo;
  residence: ResidenceInfo;
  bankAccount: BankAccountInfo;
  zaloConnected: boolean;
}

export interface BankOption {
  code: string;
  name: string;
}
