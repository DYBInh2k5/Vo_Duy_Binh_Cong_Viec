# Hướng dẫn Phát triển Tiếp nối với Antigravity (Local Development)

Chào coDY (Võ Duy Bình), đây là hướng dẫn chi tiết để bạn có thể tải mã nguồn này về máy cá nhân và tiếp tục phát triển ứng dụng bằng các công cụ AI (như Antigravity agent hoặc các assistant khác).

## 1. Yêu cầu Hệ thống
Trước khi bắt đầu, hãy đảm bảo máy bạn đã cài đặt:
- **Node.js**: Phiên bản 18 trở lên (Khuyên dùng v20+).
- **npm**: Thường đi kèm với Node.js.
- **Git**: Để quản lý mã nguồn.

## 2. Thiết lập Môi trường Local
Sau khi bạn tải file ZIP hoặc clone từ GitHub:

1. **Cài đặt Dependencies**:
   Mở terminal trong thư mục dự án và chạy:
   ```bash
   npm install
   ```

2. **Cấu hình biến môi trường (.env)**:
   - Copy file `.env.example` thành `.env`.
   - Điền các API Key cần thiết (như `GEMINI_API_KEY` nếu bạn dùng các tính năng AI).
   ```bash
   cp .env.example .env
   ```

3. **Cấu hình Firebase**:
   - Dự án này sử dụng Firebase (Firestore, Auth).
   - Bạn cần tạo một dự án trên [Firebase Console](https://console.firebase.google.com/).
   - Tải file cấu hình web và cập nhật vào `firebase-applet-config.json` nếu cần (hoặc dùng các biến môi trường).
   - Triển khai rules: `npx firebase deploy --only firestore:rules` (nếu đã có Firebase CLI).

## 3. Cách chạy Ứng dụng
Để bắt đầu môi trường phát triển:
```bash
npm run dev
```
Ứng dụng sẽ chạy tại `http://localhost:3000` (hoặc cổng khác nếu 3000 đã bị chiếm).

## 4. Phát triển tiếp với AI (Antigravity Flow)
Để một AI Agent (những công cụ như Cursor, Windsurf, hoặc Antigravity nội bộ) hiểu và hỗ trợ bạn tốt nhất, dự án này đã bao gồm các file "chỉ dẫn":

### a. File `AGENTS.md` (Bạn nên tạo thêm nếu chưa có)
Đây là nơi bạn lưu trữ các "luật chơi" cho AI. Khi bạn dùng một công cụ AI gõ code, hãy bảo nó đọc file này trước. Ví dụ:
- Quy tắc thiết kế Bauhaus (Đỏ/Xanh/Vàng/Đen).
- Cấu trúc thư mục `/src/pages` và `/src/components`.

### b. File `ARCHITECTURE.md`
Hãy nhắc AI đọc file này để nó biết flow dữ liệu giữa React và Express (Backend).

### c. Câu lệnh mẫu cho AI (Prompting):
Khi bắt đầu một turn mới với AI, bạn có thể copy đoạn này:
> "Tôi là Võ Duy Bình. Tôi muốn tiếp tục phát triển dự án Portfolio Bauhaus này. Hãy đọc `README.md` và `ARCHITECTURE.md` để hiểu phong cách thiết kế và cấu trúc kỹ thuật. Luôn tuân thủ hệ màu Bauhaus trong `tailwind.config.js`. Bây giờ hãy giúp tôi [Tính năng bạn muốn làm...]"

## 5. Cấu trúc quan trọng cần lưu ý
- **`src/constants.ts`**: Đây là "trái tim" chứa dữ liệu cá nhân của bạn. Thay đổi thông tin tại đây sẽ cập nhật toàn bộ web.
- **`server.ts`**: Backend chạy Express, xử lý các API như gửi Email qua Nodemailer.
- **`src/index.css`**: Chứa các biến CSS cho theme Bauhaus.

## 6. Triển khai (Deployment)
Dự án có sẵn cấu hình `vercel.json`. Bạn có thể dễ dàng đẩy lên Vercel bằng cách kết nối GitHub hoặc dùng lệnh `vercel deploy`.

---
**Chúc bạn phát triển dự án thành công! Nếu cần hỏi gì về code, hãy cứ hỏi tôi (Antigravity) tại đây trước khi tải về nhé.**
