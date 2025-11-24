# Daily Basic English — 10 phút mỗi ngày

Ứng dụng luyện từ vựng tiếng Anh hàng ngày, tối ưu cho điện thoại, dùng danh sách từ Basic English (Operations / Things / Picturable / Qualities) làm nội dung học chính, kèm SRS, mini-quiz và hình ảnh minh họa.

## 🚀 Cài đặt & Chạy

### Backend (API Server)

```bash
cd backend
npm install
npm run dev
```

Backend sẽ chạy tại `http://localhost:4000`

### Mobile App (Expo)

```bash
cd mobile
npm install
npm start
```

Sau đó:
- Nhấn `a` để mở trên Android emulator
- Nhấn `i` để mở trên iOS simulator
- Nhấn `w` để mở trên web browser
- Quét QR code bằng Expo Go app trên điện thoại thật

## 📱 Tính năng chính

### Core Features
- ✅ Onboarding: Chọn mục tiêu (10/20/30 từ/ngày) và bộ từ ban đầu
- ✅ Daily Sessions: Flashcards với audio, hình ảnh, ví dụ
- ✅ SRS (Spaced Repetition): Thuật toán Leitner với intervals 1-3-7-14-30 ngày
- ✅ Micro-exercises:
  - Multiple choice quiz (mỗi 3 từ)
  - Match exercise (word ↔ meaning)
  - Type-in exercise (gõ từ theo nghĩa)
  - Listen & Pick (nghe và chọn hình đúng)
- ✅ Gamification: XP, streak, badges (7 ngày, 30 ngày, 500 từ)
- ✅ Offline Mode: Tải bộ từ về máy, học không cần mạng
- ✅ Offline Sync: Đồng bộ kết quả khi có mạng lại
- ✅ Reminders: Nhắc học hàng ngày
- ✅ Progress Export: Xuất CSV tiến độ học tập

### Import & Content Management
- ✅ Import CSV/JSON/PDF từ file "850 BASIC ENGLISH OPERATIONS"
- ✅ Auto-generate audio (TTS) và placeholder images
- ✅ Phân loại tự động: Operations, Things, Picturable, Qualities

## 📂 Cấu trúc Project

```
english/
├── backend/          # Express API server
│   ├── src/
│   │   ├── routes/   # API endpoints
│   │   ├── services/ # SRS, gamification, dataStore
│   │   └── index.ts  # Server entry
│   └── data/         # JSON database
└── mobile/           # React Native (Expo)
    ├── src/
    │   ├── screens/  # UI screens
    │   ├── components/ # Reusable components
    │   ├── services/ # API client, offline
    │   └── stores/   # Zustand state
    └── App.tsx       # App entry
```

## 🔧 Configuration

### Backend
- Port mặc định: `4000`
- Database: JSON file tại `backend/data/db.json`
- TTS API: Có thể config qua `TTS_API_URL` env variable

### Mobile
- API URL: Config trong `mobile/app.json` → `extra.apiUrl`
- Mặc định: `http://localhost:4000` (cho emulator)
- Điện thoại thật: Dùng IP máy tính (ví dụ: `http://192.168.1.100:4000`)

## 📊 API Endpoints

- `GET /health` - Health check
- `GET /decks` - Danh sách bộ từ
- `GET /decks/:id/words?all=true` - Lấy tất cả từ (cho offline)
- `POST /sessions` - Tạo session mới
- `POST /sessions/:id/answer/:wordId` - Gửi kết quả
- `POST /sessions/:id/complete` - Hoàn thành session
- `GET /progress/:userId/summary` - Tóm tắt tiến độ
- `GET /progress/:userId/export` - Xuất CSV
- `POST /imports` - Upload file CSV/JSON/PDF

## 🎯 Roadmap

### Phase 1 (✅ Hoàn thành)
- Flashcards, SRS cơ bản, import CSV/JSON/PDF
- Audio TTS, offline mode, gamification

### Phase 2 (🔄 Đang phát triển)
- Teacher dashboard
- Advanced analytics
- Share badges

### Phase 3 (📋 Kế hoạch)
- Group study
- LMS API integration
- Multi-user sync

## 📝 Notes

- Backend dùng JSON file storage (có thể nâng cấp lên PostgreSQL sau)
- Mobile app hỗ trợ offline với AsyncStorage
- TTS audio được generate tự động khi import từ mới
- Badges được award tự động khi đạt milestones

## 🐛 Troubleshooting

**Backend không start:**
- Kiểm tra port 4000 có bị chiếm không
- Chạy `npm install` lại trong `backend/`

**Mobile app không kết nối API:**
- Kiểm tra `app.json` → `extra.apiUrl`
- Điện thoại thật: Dùng IP máy tính thay vì `localhost`
- Kiểm tra firewall/network

**Offline mode không hoạt động:**
- Đảm bảo đã tải bộ từ trong Settings
- Kiểm tra AsyncStorage permissions

## 📄 License

Private project

