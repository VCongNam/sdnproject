# Hướng dẫn Import dữ liệu vào MongoDB

## 📋 Yêu cầu
- MongoDB đã được cài đặt và đang chạy
- MongoDB Compass hoặc MongoDB Shell (mongosh)

## 🗄️ Database và Collections
- **Database**: `sdn_event_management`
- **Collections**: 
  - `events` (5 documents)
  - `schedules` (14 documents)

## 📥 Import dữ liệu

### 1. **Import Events**
```bash
# Sử dụng mongosh
mongosh "mongodb://localhost:27017/sdn_event_management" --eval "db.events.drop()"
mongoimport --db sdn_event_management --collection events --file events.json --jsonArray

# Hoặc sử dụng MongoDB Compass
# 1. Mở MongoDB Compass
# 2. Kết nối đến localhost:27017
# 3. Tạo database "sdn_event_management"
# 4. Tạo collection "events"
# 5. Import file events.json
```

### 2. **Import Schedules**
```bash
# Sử dụng mongosh
mongosh "mongodb://localhost:27017/sdn_event_management" --eval "db.schedules.drop()"
mongoimport --db sdn_event_management --collection schedules --file schedules.json --jsonArray

# Hoặc sử dụng MongoDB Compass
# 1. Trong database "sdn_event_management"
# 2. Tạo collection "schedules"
# 3. Import file schedules.json
```

## 📊 Dữ liệu mẫu

### Events Collection (5 documents)
1. **Hội thảo Công nghệ 2024** - ID: `507f1f77bcf86cd799439011`
2. **Ngày hội việc làm** - ID: `507f1f77bcf86cd799439012`
3. **Workshop Phát triển Web** - ID: `507f1f77bcf86cd799439013`
4. **Cuộc thi Hackathon** - ID: `507f1f77bcf86cd799439014`
5. **Hội thảo Khởi nghiệp** - ID: `507f1f77bcf86cd799439015`

### Schedules Collection (14 documents)
- **Hội thảo Công nghệ**: 4 lịch trình (Khai mạc, AI/ML, Nghỉ giải lao, Blockchain Workshop)
- **Ngày hội việc làm**: 3 lịch trình (Đăng ký, Giao lưu, Phỏng vấn)
- **Workshop Web**: 4 lịch trình (React, Nghỉ trưa, Node.js, MongoDB)
- **Hackathon**: 2 lịch trình (Khai mạc, Lập trình 24h)
- **Hội thảo Khởi nghiệp**: 2 lịch trình (Chia sẻ kinh nghiệm, Q&A)

## 🔍 Kiểm tra dữ liệu

### Sử dụng mongosh
```javascript
// Kết nối database
use sdn_event_management

// Đếm số documents
db.events.countDocuments()
db.schedules.countDocuments()

// Xem dữ liệu
db.events.find().pretty()
db.schedules.find().pretty()

// Tìm lịch trình theo event
db.schedules.find({eventId: ObjectId("507f1f77bcf86cd799439011")})
```

### Sử dụng MongoDB Compass
1. Mở collection `events` - sẽ thấy 5 documents
2. Mở collection `schedules` - sẽ thấy 14 documents
3. Sử dụng filter để tìm lịch trình theo eventId

## 🚨 Troubleshooting

### Lỗi "Invalid JSON"
- Kiểm tra file JSON có đúng format không
- Đảm bảo file được lưu với encoding UTF-8

### Lỗi "Connection refused"
- Kiểm tra MongoDB có đang chạy không
- Kiểm tra port 27017 có bị block không

### Lỗi "Database not found"
- Tạo database trước khi import
- Hoặc sử dụng `--db` flag để tự động tạo

### Lỗi "Collection already exists"
- Sử dụng `--drop` flag để xóa collection cũ
- Hoặc xóa collection thủ công trước khi import

## ✅ Verification

Sau khi import thành công, bạn sẽ có:
- ✅ 5 events trong collection `events`
- ✅ 14 schedules trong collection `schedules`
- ✅ Tất cả ObjectId đều hợp lệ
- ✅ Timestamps đều đúng format
- ✅ Relationships giữa events và schedules đều chính xác

## 🔗 Test API

Sau khi import xong, test API:
```bash
# Test lấy tất cả events
curl http://localhost:9999/api/events

# Test lấy schedules theo event
curl http://localhost:9999/api/schedules/event/507f1f77bcf86cd799439011
```