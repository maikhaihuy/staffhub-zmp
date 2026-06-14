import React, { useState } from "react";
import { useSnackbar } from "zmp-ui";
import { chooseImage } from "zmp-sdk/apis";
import { formatVND } from "@/utils/currency";
import type { ApprovalStatus, DeliveryEarning } from "@/types/income";

interface DeliveryEarningsTabProps {
  deliveries: DeliveryEarning[];
  totalDeliveryIncome: number;
  onReceiptUploaded?: (imagePath: string, deliveryId?: string) => void;
}

// ─── Upload area ──────────────────────────────────────────────────────────────

interface UploadAreaProps {
  onUploaded: (path: string) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onUploaded }) => {
  const { openSnackbar } = useSnackbar();
  const [uploading, setUploading] = useState(false);
  const [lastUploaded, setLastUploaded] = useState<string | null>(null);

  const handleChoose = async (source: "camera" | "album") => {
    setUploading(true);
    try {
      const { tempFiles } = await chooseImage({
        count: 1,
        sourceType: [source],
      });
      if (tempFiles.length > 0) {
        const path = tempFiles[0].path;
        setLastUploaded(path);
        onUploaded(path);
        openSnackbar({
          text: "Đã tải lên thành công! Đang chờ quản lý duyệt.",
          type: "success",
          duration: 3000,
        });
      }
    } catch {
      openSnackbar({
        text: "Không thể tải ảnh lên. Vui lòng thử lại.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-xl border border-black/[.08] bg-white p-4">
      <p className="mb-3 text-[13px] font-semibold text-[#141415]">📸 Nộp chứng từ giao hàng</p>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          className="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-[1.5px] border-dashed border-[#006AF5]/40 bg-[#006AF5]/[.06] px-2 py-4 transition-opacity active:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => handleChoose("camera")}
          disabled={uploading}
          aria-label="Chụp ảnh chứng từ"
        >
          <span className="text-2xl" aria-hidden="true">📷</span>
          <span className="text-[13px] font-semibold text-[#006AF5]">Chụp ảnh</span>
        </button>

        <button
          className="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-[1.5px] border-dashed border-black/20 bg-black/[.03] px-2 py-4 transition-opacity active:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => handleChoose("album")}
          disabled={uploading}
          aria-label="Tải ảnh từ thư viện"
        >
          <span className="text-2xl" aria-hidden="true">📁</span>
          <span className="text-[13px] font-semibold text-[#767A7F]">Thư viện</span>
        </button>
      </div>

      {lastUploaded && (
        <div className="mt-2.5 flex items-center gap-2.5 rounded-lg bg-[#00C853]/[.08] px-3 py-2.5" role="status" aria-live="polite">
          <span className="text-xl" aria-hidden="true">✅</span>
          <div>
            <p className="mb-0.5 text-[13px] font-semibold text-[#007A33]">Đã tải lên thành công</p>
            <p className="text-[11px] text-[#767A7F]">Đang chờ quản lý phê duyệt</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Delivery list item ───────────────────────────────────────────────────────

interface DeliveryItemProps {
  delivery: DeliveryEarning;
}

const DeliveryItem: React.FC<DeliveryItemProps> = ({ delivery }) => (
  <div
    className={`flex items-center justify-between rounded-lg border bg-white px-3.5 py-3 ${
      delivery.status === "pending"
        ? "border-l-[3px] border-l-[#FFA000] border-y-black/[.08] border-r-black/[.08]"
        : "border-black/[.08]"
    }`}
  >
    <div>
      <p className="mb-[3px] text-sm font-semibold text-[#141415]">{delivery.orderCode}</p>
      <p className="text-xs text-[#767A7F]">{delivery.datetime}</p>
    </div>
    <div className="text-right">
      <p className="mb-1 text-[15px] font-bold text-[#141415]">{formatVND(delivery.fee)}</p>
      <StatusBadge status={delivery.status} />
    </div>
  </div>
);

// ─── Main tab component ───────────────────────────────────────────────────────

export const DeliveryEarningsTab: React.FC<DeliveryEarningsTabProps> = ({
  deliveries,
  totalDeliveryIncome,
  onReceiptUploaded,
}) => {
  const pendingCount = deliveries.filter((d) => d.status === "pending").length;

  return (
    <div className="flex min-h-full flex-col gap-3 bg-[#F4F5F6] px-4 pb-6 pt-3">
      {/* Summary card */}
      <div className="rounded-xl border border-[#FFA000]/20 bg-gradient-to-br from-white to-[#fffaf0] p-4">
        <div className="mb-1 flex items-start justify-between">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.5px] text-[#767A7F]">Tổng tiền ship</p>
            <p className="text-[26px] font-bold leading-[1.15] tracking-[-0.5px] text-[#141415]">{formatVND(totalDeliveryIncome)}</p>
            <p className="mt-[3px] text-xs text-[#767A7F]">
              {deliveries.length} đơn
              {pendingCount > 0 ? ` · ${pendingCount} chờ duyệt` : ""}
            </p>
          </div>
          <span className="shrink-0 rounded-xl bg-[#006AF5]/[.08] p-2.5 text-2xl leading-none" aria-hidden="true">🛵</span>
        </div>
      </div>

      {/* Upload area */}
      <UploadArea onUploaded={(path) => onReceiptUploaded?.(path)} />

      {/* Delivery list */}
      <div>
        <SectionHeader title="Danh sách đơn giao" />
        {deliveries.length === 0 ? (
          <EmptyState
            emoji="🛵"
            title="Chưa có đơn giao hàng"
            subtitle="Các đơn đã giao sẽ xuất hiện ở đây"
          />
        ) : (
          <div className="flex flex-col gap-2">
            {deliveries.map((delivery) => (
              <DeliveryItem key={delivery.id} delivery={delivery} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const STATUS_CONFIG: Record<ApprovalStatus, { label: string; className: string }> = {
  approved: { label: "✓ Đã duyệt", className: "bg-[#00C853]/[.12] text-[#007A33]" },
  pending: { label: "⏳ Chờ duyệt", className: "bg-[#FFA000]/[.12] text-[#7A4A00]" },
  rejected: { label: "✕ Từ chối", className: "bg-[#FF3B30]/10 text-[#CC0000]" },
};

function StatusBadge({ status }: { status: ApprovalStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  return (
    <span className={`inline-block whitespace-nowrap rounded-[20px] px-[9px] py-[3px] text-[11px] font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <p className="mb-2 px-0.5 text-[11px] font-bold uppercase tracking-[0.6px] text-[#767A7F]">
      {title}
    </p>
  );
}

function EmptyState({
  emoji,
  title,
  subtitle,
}: {
  emoji: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="px-0 pb-2 pt-4 text-center">
      <span className="mb-1.5 block text-[30px]">{emoji}</span>
      <p className="mb-1 text-sm font-semibold text-[#00C853]">{title}</p>
      {subtitle && <p className="text-xs text-[#767A7F]">{subtitle}</p>}
    </div>
  );
}
