import React, { useState } from "react";
import { useSnackbar } from "zmp-ui";
import { chooseImage } from "zmp-sdk/apis";
import { StatusBadge, SectionHeader, EmptyState } from "./SharedComponents";
import { formatVND } from "@/utils/currency";
import type { DeliveryEarning } from "@/types/income";

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
    <div className="income-card">
      <p className="income-card__section-title">📸 Nộp chứng từ giao hàng</p>

      <div className="upload-area">
        <button
          className="upload-btn upload-btn--camera"
          onClick={() => handleChoose("camera")}
          disabled={uploading}
          aria-label="Chụp ảnh chứng từ"
        >
          <span className="upload-btn__icon" aria-hidden="true">📷</span>
          <span className="upload-btn__label">Chụp ảnh</span>
        </button>

        <button
          className="upload-btn upload-btn--gallery"
          onClick={() => handleChoose("album")}
          disabled={uploading}
          aria-label="Tải ảnh từ thư viện"
        >
          <span className="upload-btn__icon" aria-hidden="true">📁</span>
          <span className="upload-btn__label">Thư viện</span>
        </button>
      </div>

      {lastUploaded && (
        <div className="upload-success" role="status" aria-live="polite">
          <span className="upload-success__icon" aria-hidden="true">✅</span>
          <div>
            <p className="upload-success__title">Đã tải lên thành công</p>
            <p className="upload-success__sub">Đang chờ quản lý phê duyệt</p>
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
    className={`delivery-item ${
      delivery.status === "pending" ? "delivery-item--pending" : ""
    }`}
  >
    <div className="delivery-item__left">
      <p className="delivery-item__code">{delivery.orderCode}</p>
      <p className="delivery-item__datetime">{delivery.datetime}</p>
    </div>
    <div className="delivery-item__right">
      <p className="delivery-item__fee">{formatVND(delivery.fee)}</p>
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
    <div className="income-tab-content">
      {/* Summary card */}
      <div className="income-card income-card--gradient-amber">
        <div className="income-card__header">
          <div>
            <p className="income-card__eyebrow">Tổng tiền ship</p>
            <p className="income-card__total">{formatVND(totalDeliveryIncome)}</p>
            <p className="income-card__meta">
              {deliveries.length} đơn
              {pendingCount > 0 ? ` · ${pendingCount} chờ duyệt` : ""}
            </p>
          </div>
          <span className="income-card__icon" aria-hidden="true">🛵</span>
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
          <div className="delivery-list">
            {deliveries.map((delivery) => (
              <DeliveryItem key={delivery.id} delivery={delivery} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
