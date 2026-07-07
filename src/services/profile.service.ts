import { nativeStorage } from "zmp-sdk";

import type {
  BankAccountInfo,
  BankOption,
  IdentityCardInfo,
  PersonalInfo,
  ResidenceInfo,
  StaffProfile,
} from "@/types/profile";

const delay = (ms = 450) => new Promise((resolve) => window.setTimeout(resolve, ms));

let mockProfile: StaffProfile = {
  id: "emp_an",
  fullName: "Nguyễn Văn An",
  phone: "0901 234 567",
  role: "staff",
  branchName: "Chi nhánh Quận 7",
  avatarUrl: "",
  personalInfo: {
    fullName: "Nguyễn Văn An",
    dateOfBirth: "2000-08-12",
  },
  identityCard: {
    number: "",
    fullName: "",
    issuedDate: "",
    issuedPlace: "",
  },
  residence: {
    address: "48 Nguyễn Thị Thập",
    ward: "Tân Phú",
    district: "Quận 7",
    province: "TP.HCM",
    status: "temporary_residence",
    notes: "",
  },
  bankAccount: {
    bankCode: "VCB",
    bankName: "Vietcombank",
    accountNumber: "0123456789",
    accountHolderName: "NGUYEN VAN AN",
    branch: "",
  },
  zaloConnected: true,
};

export const mockBankOptions: BankOption[] = [
  { code: "VCB", name: "Vietcombank" },
  { code: "TCB", name: "Techcombank" },
  { code: "ACB", name: "ACB" },
  { code: "BIDV", name: "BIDV" },
  { code: "VTB", name: "VietinBank" },
  { code: "MB", name: "MB Bank" },
  { code: "VPB", name: "VPBank" },
  { code: "TPB", name: "TPBank" },
];

export async function getStaffProfile(): Promise<StaffProfile> {
  await delay();
  return cloneProfile(mockProfile);
}

export async function updatePersonalInfo(input: PersonalInfo): Promise<StaffProfile> {
  await delay();
  mockProfile = {
    ...mockProfile,
    fullName: input.fullName,
    personalInfo: { ...input },
  };
  return cloneProfile(mockProfile);
}

export async function updateIdentityCard(input: IdentityCardInfo): Promise<StaffProfile> {
  await delay();
  mockProfile = {
    ...mockProfile,
    identityCard: { ...mockProfile.identityCard, ...input },
  };
  return cloneProfile(mockProfile);
}

export async function updateResidence(input: ResidenceInfo): Promise<StaffProfile> {
  await delay();
  mockProfile = {
    ...mockProfile,
    residence: { ...input },
  };
  return cloneProfile(mockProfile);
}

export async function updateBankAccount(input: BankAccountInfo): Promise<StaffProfile> {
  await delay();
  mockProfile = {
    ...mockProfile,
    bankAccount: { ...input },
  };
  return cloneProfile(mockProfile);
}

export async function updateAvatar(avatarUrl: string): Promise<StaffProfile> {
  await delay(650);
  mockProfile = {
    ...mockProfile,
    avatarUrl,
  };
  return cloneProfile(mockProfile);
}

export async function logoutStaffHubSession(): Promise<void> {
  nativeStorage.removeItem("jwt_token");
}

function cloneProfile(profile: StaffProfile): StaffProfile {
  return {
    ...profile,
    personalInfo: { ...profile.personalInfo },
    identityCard: { ...profile.identityCard },
    residence: { ...profile.residence },
    bankAccount: { ...profile.bankAccount },
  };
}
