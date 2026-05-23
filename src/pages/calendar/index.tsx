import { Box, Page, Text } from "zmp-ui";

function CalendarPage() {
  return (
    <Page>
      {/* 1. Thanh hiển thị tuần (Khóa điều hướng) */}
      <Box p={4} flex justifyContent="center" alignItems="center">
        <Text bold size="large">
          Tuần hiện tại: 18/05 - 24/05/2026
        </Text>
      </Box>

      {/* 2. Danh sách Thứ xếp theo chiều dọc (Scrollview) */}
      <Box p={4} className="scrollable-content">
        {/* VÍ DỤ CARD NGÀY THỨ HAI (CÓ CA LÀM) */}
        <Box flex flexDirection="row" alignItems="center">
          {/* Cột trái: Thứ & Ngày */}
          <Box
            width={20}
            flex
            flexDirection="column"
            alignItems="center"
            className="border-right"
          >
            <Text size="small" style={{ color: "#666" }}>
              Thứ 2
            </Text>
            <Text bold size="xLarge">
              18
            </Text>
          </Box>

          {/* Cột phải: Timeline các ca của quán */}
          <Box width={80} pl={4} flex flexDirection="column">
            {/* Nền Ca Mở (08:00 - 12:00) - Bạn KHÔNG làm */}
            <Box p={2}>
              <Text size="small" style={{ color: "#888" }}>
                Ca Mở: 08:00 - 12:00 (CN Quận 1)
              </Text>
            </Box>

            {/* Nền Ca Giữa (12:00 - 18:00) - BẠN ĐƯỢC XẾP LÀM */}
            <Box p={2}>
              <Box flex justifyContent="center" alignItems="center">
                <Text bold size="normal" style={{ color: "#1890ff" }}>
                  Ca Giữa: 12:00 - 18:00
                </Text>
              </Box>
              <Text size="xSmall" style={{ color: "#555" }} className="mt-1">
                📍 Chi nhánh: CN Quận 1
              </Text>
            </Box>

            {/* Nền Ca Đóng (18:00 - 23:00) - Bạn KHÔNG làm */}
            <Box p={2}>
              <Text size="small" style={{ color: "#888" }}>
                Ca Đóng: 18:00 - 23:00 (CN Quận 1)
              </Text>
            </Box>
          </Box>
        </Box>

        {/* VÍ DỤ CARD NGÀY THỨ BA (NGHỈ - KHÔNG CÓ LỊCH) */}
        <Box flex flexDirection="row" alignItems="center">
          <Box width={20} flex flexDirection="column" alignItems="center">
            <Text size="small">Thứ 3</Text>
            <Text bold size="xLarge">
              19
            </Text>
          </Box>
          <Box
            width={80}
            pl={4}
            flex
            justifyContent="center"
            alignItems="center"
            height={60}
          >
            <Text style={{ color: "#999", fontStyle: "italic" }}>
              🎉 Hôm nay bạn được nghỉ
            </Text>
          </Box>
        </Box>
      </Box>
    </Page>
  );
}

export default CalendarPage;