import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { chooseImage } from "zmp-sdk/apis";
import {
  Button,
  DatePicker,
  Icon,
  Input,
  Modal,
  Page,
  Select,
  Sheet,
  useNavigate,
  useSnackbar,
} from "zmp-ui";

import { PATHS } from "@/constants/paths";
import {
  getStaffProfile,
  logoutStaffHubSession,
  mockBankOptions,
  updateAvatar,
  updateBankAccount,
  updateIdentityCard,
  updatePersonalInfo,
  updateResidence,
} from "@/services/profile.service";
import type {
  BankAccountInfo,
  IdentityCardInfo,
  PersonalInfo,
  ResidenceInfo,
  ResidenceStatus,
  StaffProfile,
} from "@/types/profile";

const EMPTY_VALUE = "Chưa cập nhật";

const RESIDENCE_STATUS_LABELS: Record<ResidenceStatus, string> = {
  temporary_residence: "Tạm trú",
  temporary_absence: "Tạm vắng",
  not_applicable: "Không áp dụng",
};

type ActiveSheet =
  | "personal"
  | "identity"
  | "residence"
  | "bank"
  | "account"
  | null;

function ProfilePage() {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    getStaffProfile()
      .then((data) => {
        if (mounted) setProfile(data);
      })
      .catch(() => {
        openSnackbar({
          text: "Không thể tải thông tin cá nhân. Vui lòng thử lại.",
          type: "error",
          duration: 3000,
        });
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [openSnackbar]);

  async function handleAvatarUpdate() {
    if (!profile || avatarUploading) return;

    setAvatarUploading(true);
    try {
      const { tempFiles } = await chooseImage({
        count: 1,
        sourceType: ["camera", "album"],
      });
      const avatarPath = tempFiles?.[0]?.path;

      if (!avatarPath) return;

      const updated = await updateAvatar(avatarPath);
      setProfile(updated);
      openSnackbar({
        text: "Đã cập nhật thông tin",
        type: "success",
        duration: 2400,
      });
    } catch {
      openSnackbar({
        text: "Không thể cập nhật ảnh đại diện. Vui lòng thử lại.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setAvatarUploading(false);
    }
  }

  async function handleLogout() {
    try {
      await logoutStaffHubSession();
      setProfile(null);
      setLogoutOpen(false);
      navigate(PATHS.CALENDAR, { replace: true });
    } catch {
      openSnackbar({
        text: "Chưa thể đăng xuất. Vui lòng thử lại.",
        type: "error",
        duration: 3000,
      });
    }
  }

  const headerTitle = profile?.fullName || "Cá nhân";

  return (
    <Page className="h-full min-h-0 overflow-hidden bg-[#F4F5F6]">
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <header className="sticky top-0 z-20 shrink-0 border-b border-black/[.06] bg-white/95 px-4 pb-3 pt-3 backdrop-blur">
          <h1 className="text-[20px] font-bold leading-tight text-[#141415]">Cá nhân</h1>
        </header>

        <main className="flex-1 overflow-y-auto px-4 pb-8 pt-3">
          {loading ? (
            <ProfileSkeleton />
          ) : profile ? (
            <div className="flex flex-col gap-4">
              <ProfileHeroCard
                profile={profile}
                uploading={avatarUploading}
                onAvatarClick={handleAvatarUpdate}
              />

              <ProfileSection title="Thông tin cá nhân">
                <SummaryRow
                  label="Họ và tên"
                  value={profile.personalInfo.fullName || EMPTY_VALUE}
                  onClick={() => setActiveSheet("personal")}
                />
                <SummaryRow
                  label="Ngày sinh"
                  value={formatDate(profile.personalInfo.dateOfBirth)}
                  onClick={() => setActiveSheet("personal")}
                />
              </ProfileSection>

              <ProfileSection title="Giấy tờ & nơi ở">
                <SummaryRow
                  label="Căn cước công dân"
                  value={maskNumber(profile.identityCard.number)}
                  onClick={() => setActiveSheet("identity")}
                />
                <SummaryRow
                  label="Địa chỉ tạm trú"
                  value={formatResidenceSummary(profile.residence)}
                  onClick={() => setActiveSheet("residence")}
                />
              </ProfileSection>

              <ProfileSection title="Tài khoản nhận lương">
                <SummaryRow
                  label="Tài khoản ngân hàng"
                  value={formatBankSummary(profile.bankAccount)}
                  onClick={() => setActiveSheet("bank")}
                />
              </ProfileSection>

              <ProfileSection title="Tài khoản">
                <SummaryRow
                  label="Đăng nhập bằng"
                  value="Zalo"
                  onClick={() => setActiveSheet("account")}
                />
              </ProfileSection>

              <section className="rounded-xl border border-red-100 bg-white p-3">
                <Button
                  fullWidth
                  variant="tertiary"
                  type="danger"
                  prefixIcon={<Icon icon="zi-leave" />}
                  onClick={() => setLogoutOpen(true)}
                >
                  Đăng xuất
                </Button>
              </section>
            </div>
          ) : (
            <div className="rounded-xl bg-white p-5 text-center">
              <p className="text-sm font-semibold text-[#141415]">{headerTitle}</p>
              <p className="mt-1 text-xs text-[#767A7F]">
                Chưa thể hiển thị thông tin cá nhân.
              </p>
            </div>
          )}
        </main>
      </div>

      {profile && (
        <>
          <PersonalInfoSheet
            visible={activeSheet === "personal"}
            profile={profile}
            onClose={() => setActiveSheet(null)}
            onSaved={(updated) => {
              setProfile(updated);
              setActiveSheet(null);
              openSnackbar({
                text: "Đã cập nhật thông tin",
                type: "success",
                duration: 2400,
              });
            }}
            onError={() =>
              openSnackbar({
                text: "Không thể lưu thay đổi. Vui lòng thử lại.",
                type: "error",
                duration: 3000,
              })
            }
          />
          <IdentitySheet
            visible={activeSheet === "identity"}
            profile={profile}
            onClose={() => setActiveSheet(null)}
            onSaved={(updated) => {
              setProfile(updated);
              setActiveSheet(null);
              openSnackbar({
                text: "Đã cập nhật thông tin",
                type: "success",
                duration: 2400,
              });
            }}
            onError={() =>
              openSnackbar({
                text: "Không thể lưu thay đổi. Vui lòng thử lại.",
                type: "error",
                duration: 3000,
              })
            }
          />
          <ResidenceSheet
            visible={activeSheet === "residence"}
            profile={profile}
            onClose={() => setActiveSheet(null)}
            onSaved={(updated) => {
              setProfile(updated);
              setActiveSheet(null);
              openSnackbar({
                text: "Đã cập nhật thông tin",
                type: "success",
                duration: 2400,
              });
            }}
            onError={() =>
              openSnackbar({
                text: "Không thể lưu thay đổi. Vui lòng thử lại.",
                type: "error",
                duration: 3000,
              })
            }
          />
          <BankSheet
            visible={activeSheet === "bank"}
            profile={profile}
            onClose={() => setActiveSheet(null)}
            onSaved={(updated) => {
              setProfile(updated);
              setActiveSheet(null);
              openSnackbar({
                text: "Đã cập nhật thông tin",
                type: "success",
                duration: 2400,
              });
            }}
            onError={() =>
              openSnackbar({
                text: "Không thể lưu thay đổi. Vui lòng thử lại.",
                type: "error",
                duration: 3000,
              })
            }
          />
          <AccountSheet visible={activeSheet === "account"} onClose={() => setActiveSheet(null)} />
        </>
      )}

      <Modal
        visible={logoutOpen}
        title="Đăng xuất khỏi StaffHub?"
        description="Bạn sẽ cần đăng nhập lại bằng Zalo để tiếp tục sử dụng ứng dụng."
        onClose={() => setLogoutOpen(false)}
        actions={[
          {
            text: "Hủy",
            close: true,
          },
          {
            text: "Đăng xuất",
            danger: true,
            onClick: handleLogout,
          },
        ]}
      />
    </Page>
  );
}

function ProfileHeroCard({
  profile,
  uploading,
  onAvatarClick,
}: {
  profile: StaffProfile;
  uploading: boolean;
  onAvatarClick: () => void;
}) {
  return (
    <section className="rounded-xl border border-black/[.06] bg-white p-4 shadow-[0_2px_12px_rgba(20,20,21,.04)]">
      <div className="flex items-center gap-3.5">
        <button
          className="relative h-[72px] w-[72px] shrink-0 rounded-full bg-[#EAF3FF] text-[#006AF5] transition-opacity active:opacity-75 disabled:opacity-60"
          onClick={onAvatarClick}
          disabled={uploading}
          aria-label="Cập nhật ảnh đại diện"
        >
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt="Ảnh đại diện"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xl font-bold">
              {getInitials(profile.fullName)}
            </span>
          )}
          <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#006AF5] text-white shadow-sm">
            {uploading ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <Icon icon="zi-camera" size={15} />
            )}
          </span>
        </button>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[18px] font-bold leading-tight text-[#141415]">
            {profile.fullName || EMPTY_VALUE}
          </h2>
          {profile.phone ? (
            <p className="mt-1 text-sm font-medium text-[#767A7F]">{profile.phone}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#00C853]/[.12] px-2.5 py-1 text-[11px] font-bold text-[#007A33]">
              Nhân viên
            </span>
            {profile.branchName ? (
              <span className="max-w-full truncate rounded-full bg-black/[.04] px-2.5 py-1 text-[11px] font-semibold text-[#767A7F]">
                {profile.branchName}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfileSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 px-0.5 text-[11px] font-bold uppercase tracking-[0.6px] text-[#767A7F]">
        {title}
      </h2>
      <div className="overflow-hidden rounded-xl border border-black/[.06] bg-white">
        {children}
      </div>
    </section>
  );
}

function SummaryRow({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      className="flex min-h-[54px] w-full items-center gap-3 border-b border-black/[.06] px-4 py-3 text-left last:border-b-0 active:bg-black/[.03]"
      onClick={onClick}
    >
      <span className="min-w-0 flex-1 text-[14px] font-semibold text-[#141415]">{label}</span>
      <span className="max-w-[52%] truncate text-right text-[13px] font-medium text-[#767A7F]">
        {value || EMPTY_VALUE}
      </span>
      <Icon icon="zi-chevron-right" className="shrink-0 text-[#A3A6AA]" size={16} />
    </button>
  );
}

function SheetFrame({
  visible,
  title,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Sheet
      visible={visible}
      title={title}
      onClose={onClose}
      autoHeight
      height="88vh"
      handler
      maskClosable
      modalClassName="overflow-hidden"
    >
      {children}
    </Sheet>
  );
}

function PersonalInfoSheet({
  visible,
  profile,
  onClose,
  onSaved,
  onError,
}: SheetProps) {
  const [form, setForm] = useState<PersonalInfo>(profile.personalInfo);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setForm(profile.personalInfo);
      setErrors({});
    }
  }, [profile, visible]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const next: PersonalInfo = {
      fullName: form.fullName.trim(),
      dateOfBirth: form.dateOfBirth || "",
    };
    const nextErrors = validatePersonalInfo(next);

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      onSaved(await updatePersonalInfo(next));
    } catch {
      onError();
    } finally {
      setSaving(false);
    }
  }

  return (
    <SheetFrame visible={visible} title="Thông tin cá nhân" onClose={onClose}>
      <form className="flex max-h-[78vh] flex-col" onSubmit={handleSubmit}>
        <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4 pt-2">
          <Input
            label="Họ và tên"
            value={form.fullName}
            onChange={(event) => setForm({ ...form, fullName: event.target.value })}
            status={errors.fullName ? "error" : ""}
            errorText={errors.fullName}
            placeholder="Nhập họ và tên"
          />
          <DatePicker
            label="Ngày sinh"
            title="Chọn ngày sinh"
            value={parseDate(form.dateOfBirth)}
            endDate={new Date()}
            startYear={1950}
            endYear={new Date().getFullYear()}
            dateFormat="dd/mm/yyyy"
            columnsFormat="DD-MM-YYYY"
            locale="vi-VN"
            placeholder="Chưa cập nhật"
            status={errors.dateOfBirth ? "error" : ""}
            errorText={errors.dateOfBirth}
            onChange={(date) => setForm({ ...form, dateOfBirth: toDateInputValue(date) })}
          />
        </div>
        <StickySubmitButton loading={saving} />
      </form>
    </SheetFrame>
  );
}

function IdentitySheet({ visible, profile, onClose, onSaved, onError }: SheetProps) {
  const [form, setForm] = useState<IdentityCardInfo>(profile.identityCard);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setForm(profile.identityCard);
      setErrors({});
    }
  }, [profile, visible]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const next: IdentityCardInfo = {
      ...form,
      number: onlyDigits(form.number ?? ""),
      fullName: (form.fullName ?? "").trim(),
      issuedPlace: (form.issuedPlace ?? "").trim(),
      issuedDate: form.issuedDate || "",
    };
    const nextErrors = validateIdentity(next);

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      onSaved(await updateIdentityCard(next));
    } catch {
      onError();
    } finally {
      setSaving(false);
    }
  }

  return (
    <SheetFrame visible={visible} title="Giấy tờ cá nhân" onClose={onClose}>
      <form className="flex max-h-[78vh] flex-col" onSubmit={handleSubmit}>
        <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4 pt-2">
          <Input
            label="Căn cước công dân"
            type="number"
            inputMode="numeric"
            value={form.number ?? ""}
            onChange={(event) =>
              setForm({ ...form, number: onlyDigits(event.target.value).slice(0, 12) })
            }
            status={errors.number ? "error" : ""}
            errorText={errors.number}
            placeholder="12 chữ số"
          />
          <Input
            label="Họ tên trên căn cước"
            value={form.fullName ?? ""}
            onChange={(event) => setForm({ ...form, fullName: event.target.value })}
            status={errors.fullName ? "error" : ""}
            errorText={errors.fullName}
            placeholder="Nhập đúng như trên giấy tờ"
          />
          <DatePicker
            label="Ngày cấp"
            title="Chọn ngày cấp"
            value={parseDate(form.issuedDate)}
            endDate={new Date()}
            startYear={1980}
            endYear={new Date().getFullYear()}
            dateFormat="dd/mm/yyyy"
            columnsFormat="DD-MM-YYYY"
            locale="vi-VN"
            placeholder="Không bắt buộc"
            status={errors.issuedDate ? "error" : ""}
            errorText={errors.issuedDate}
            onChange={(date) => setForm({ ...form, issuedDate: toDateInputValue(date) })}
          />
          <Input
            label="Nơi cấp"
            value={form.issuedPlace ?? ""}
            onChange={(event) => setForm({ ...form, issuedPlace: event.target.value })}
            placeholder="Không bắt buộc"
          />
          <p className="rounded-lg bg-[#006AF5]/[.06] px-3 py-2.5 text-xs leading-relaxed text-[#4D647A]">
            Ảnh mặt trước và mặt sau căn cước sẽ được bổ sung ở phiên bản sau.
          </p>
        </div>
        <StickySubmitButton loading={saving} />
      </form>
    </SheetFrame>
  );
}

function ResidenceSheet({ visible, profile, onClose, onSaved, onError }: SheetProps) {
  const [form, setForm] = useState<ResidenceInfo>(profile.residence);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) setForm(profile.residence);
  }, [profile, visible]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const next: ResidenceInfo = {
      address: (form.address ?? "").trim(),
      ward: (form.ward ?? "").trim(),
      district: (form.district ?? "").trim(),
      province: (form.province ?? "").trim(),
      status: form.status,
      notes: (form.notes ?? "").trim(),
    };

    setSaving(true);
    try {
      onSaved(await updateResidence(next));
    } catch {
      onError();
    } finally {
      setSaving(false);
    }
  }

  return (
    <SheetFrame visible={visible} title="Giấy tờ & nơi ở" onClose={onClose}>
      <form className="flex max-h-[78vh] flex-col" onSubmit={handleSubmit}>
        <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4 pt-2">
          <Input
            label="Địa chỉ chi tiết"
            value={form.address ?? ""}
            onChange={(event) => setForm({ ...form, address: event.target.value })}
            placeholder="Số nhà, tên đường"
          />
          <Input
            label="Phường / Xã"
            value={form.ward ?? ""}
            onChange={(event) => setForm({ ...form, ward: event.target.value })}
            placeholder="Phường / Xã"
          />
          <Input
            label="Quận / Huyện"
            value={form.district ?? ""}
            onChange={(event) => setForm({ ...form, district: event.target.value })}
            placeholder="Quận / Huyện"
          />
          <Input
            label="Tỉnh / Thành phố"
            value={form.province ?? ""}
            onChange={(event) => setForm({ ...form, province: event.target.value })}
            placeholder="Tỉnh / Thành phố"
          />
          <Select
            label="Tình trạng cư trú"
            value={form.status ?? "not_applicable"}
            onChange={(value) =>
              setForm({ ...form, status: String(value) as ResidenceStatus })
            }
            placeholder="Chọn tình trạng"
            closeOnSelect
          >
            {Object.entries(RESIDENCE_STATUS_LABELS).map(([value, label]) => (
              <Select.Option key={value} value={value} title={label} />
            ))}
          </Select>
          <Input.TextArea
            label="Ghi chú"
            value={form.notes ?? ""}
            onChange={(event) => setForm({ ...form, notes: event.target.value })}
            placeholder="Không bắt buộc"
            rows={3}
            autoHeight
          />
        </div>
        <StickySubmitButton loading={saving} />
      </form>
    </SheetFrame>
  );
}

function BankSheet({ visible, profile, onClose, onSaved, onError }: SheetProps) {
  const [form, setForm] = useState<BankAccountInfo>(profile.bankAccount);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const selectedBankName = useMemo(
    () => mockBankOptions.find((bank) => bank.code === form.bankCode)?.name ?? form.bankName,
    [form.bankCode, form.bankName],
  );

  useEffect(() => {
    if (visible) {
      setForm(profile.bankAccount);
      setErrors({});
    }
  }, [profile, visible]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const bank = mockBankOptions.find((item) => item.code === form.bankCode);
    const next: BankAccountInfo = {
      bankCode: form.bankCode,
      bankName: bank?.name ?? selectedBankName ?? "",
      accountNumber: onlyDigits(form.accountNumber ?? ""),
      accountHolderName: (form.accountHolderName ?? "").trim(),
      branch: (form.branch ?? "").trim(),
    };
    const nextErrors = validateBank(next);

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      onSaved(await updateBankAccount(next));
    } catch {
      onError();
    } finally {
      setSaving(false);
    }
  }

  return (
    <SheetFrame visible={visible} title="Tài khoản nhận lương" onClose={onClose}>
      <form className="flex max-h-[78vh] flex-col" onSubmit={handleSubmit}>
        <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4 pt-2">
          <p className="rounded-lg bg-[#00C853]/[.08] px-3 py-2.5 text-xs leading-relaxed text-[#34664A]">
            Thông tin này được dùng để thanh toán lương và các khoản hỗ trợ.
          </p>
          <Select
            label="Ngân hàng"
            value={form.bankCode}
            onChange={(value) => {
              const bank = mockBankOptions.find((item) => item.code === String(value));
              setForm({ ...form, bankCode: bank?.code, bankName: bank?.name });
            }}
            status={errors.bankCode ? "error" : ""}
            errorText={errors.bankCode}
            placeholder="Chọn ngân hàng"
            closeOnSelect
          >
            {mockBankOptions.map((bank) => (
              <Select.Option key={bank.code} value={bank.code} title={bank.name} />
            ))}
          </Select>
          <Input
            label="Số tài khoản"
            type="number"
            inputMode="numeric"
            value={form.accountNumber ?? ""}
            onChange={(event) =>
              setForm({ ...form, accountNumber: onlyDigits(event.target.value) })
            }
            status={errors.accountNumber ? "error" : ""}
            errorText={errors.accountNumber}
            placeholder="Nhập số tài khoản"
          />
          <Input
            label="Tên chủ tài khoản"
            value={form.accountHolderName ?? ""}
            onChange={(event) => setForm({ ...form, accountHolderName: event.target.value })}
            status={errors.accountHolderName ? "error" : ""}
            errorText={errors.accountHolderName}
            placeholder="VD: NGUYEN VAN AN"
          />
          <Input
            label="Chi nhánh"
            value={form.branch ?? ""}
            onChange={(event) => setForm({ ...form, branch: event.target.value })}
            placeholder="Không bắt buộc"
          />
        </div>
        <StickySubmitButton loading={saving} />
      </form>
    </SheetFrame>
  );
}

function AccountSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <SheetFrame visible={visible} title="Tài khoản" onClose={onClose}>
      <div className="px-4 pb-6 pt-2">
        <div className="rounded-xl border border-[#006AF5]/15 bg-[#006AF5]/[.06] p-4">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#006AF5] text-white">
            <Icon icon="zi-chat" />
          </div>
          <p className="text-[15px] font-semibold text-[#141415]">
            Bạn đang đăng nhập StaffHub bằng tài khoản Zalo.
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-[#767A7F]">
            Việc xác thực và bảo mật tài khoản được quản lý bởi Zalo.
          </p>
        </div>
      </div>
    </SheetFrame>
  );
}

interface SheetProps {
  visible: boolean;
  profile: StaffProfile;
  onClose: () => void;
  onSaved: (profile: StaffProfile) => void;
  onError: () => void;
}

function StickySubmitButton({ loading }: { loading: boolean }) {
  return (
    <div className="shrink-0 border-t border-black/[.06] bg-white px-4 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] pt-3">
      <Button
        htmlType="submit"
        fullWidth
        size="large"
        loading={loading}
        disabled={loading}
      >
        Lưu thay đổi
      </Button>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4">
      <div className="rounded-xl bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="h-[72px] w-[72px] rounded-full bg-black/[.08]" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-2/3 rounded bg-black/[.08]" />
            <div className="h-4 w-1/2 rounded bg-black/[.08]" />
            <div className="h-6 w-24 rounded-full bg-black/[.08]" />
          </div>
        </div>
      </div>
      {[0, 1, 2, 3].map((item) => (
        <div key={item}>
          <div className="mb-2 h-3 w-32 rounded bg-black/[.08]" />
          <div className="rounded-xl bg-white p-4">
            <div className="h-4 rounded bg-black/[.08]" />
            <div className="mt-5 h-4 rounded bg-black/[.08]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function validatePersonalInfo(input: PersonalInfo): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!input.fullName) errors.fullName = "Vui lòng nhập họ và tên.";
  if (input.dateOfBirth && isFutureDate(input.dateOfBirth)) {
    errors.dateOfBirth = "Ngày sinh không được ở tương lai.";
  }
  return errors;
}

function validateIdentity(input: IdentityCardInfo): Record<string, string> {
  const errors: Record<string, string> = {};
  if (input.number && !/^\d{12}$/.test(input.number)) {
    errors.number = "Căn cước công dân cần đủ 12 chữ số.";
  }
  if (input.number && !input.fullName) {
    errors.fullName = "Vui lòng nhập họ tên trên căn cước.";
  }
  if (input.issuedDate && isFutureDate(input.issuedDate)) {
    errors.issuedDate = "Ngày cấp không được ở tương lai.";
  }
  return errors;
}

function validateBank(input: BankAccountInfo): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!input.bankCode) errors.bankCode = "Vui lòng chọn ngân hàng.";
  if (!input.accountNumber) errors.accountNumber = "Vui lòng nhập số tài khoản.";
  if (!input.accountHolderName) {
    errors.accountHolderName = "Vui lòng nhập tên chủ tài khoản.";
  }
  return errors;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0]?.[0];
  return (initials || "S").toUpperCase();
}

function maskNumber(value?: string) {
  if (!value) return EMPTY_VALUE;
  const digits = onlyDigits(value);
  if (digits.length <= 4) return `**** ${digits}`;
  return `**** ${digits.slice(-4)}`;
}

function formatBankSummary(bank: BankAccountInfo) {
  if (!bank.bankName && !bank.accountNumber) return EMPTY_VALUE;
  if (!bank.accountNumber) return bank.bankName || EMPTY_VALUE;
  return `${bank.bankName || "Ngân hàng"} • ${maskNumber(bank.accountNumber)}`;
}

function formatResidenceSummary(residence: ResidenceInfo) {
  const parts = [residence.district, residence.province].filter(Boolean);
  if (parts.length > 0) return parts.join(", ");
  return residence.address || EMPTY_VALUE;
}

function formatDate(value?: string) {
  const date = parseDate(value);
  if (!date) return EMPTY_VALUE;
  return date.toLocaleDateString("vi-VN");
}

function parseDate(value?: string) {
  if (!value) return undefined;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isFutureDate(value: string) {
  const date = parseDate(value);
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() > today.getTime();
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export default ProfilePage;
