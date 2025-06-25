# Hướng dẫn Test API trong Postman

## 🚀 Khởi động Backend
```bash
cd backend
npm start
```
Backend sẽ chạy trên: `http://localhost:9999`

## 📋 Collection Postman

### 1. **Events API**

#### GET - Lấy tất cả sự kiện
```
GET http://localhost:9999/api/events
```

**Headers:**
```
Content-Type: application/json
```

**Response mẫu:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Hội thảo Công nghệ 2024",
    "description": "Sự kiện công nghệ lớn nhất năm 2024...",
    "startDate": "2024-07-10T08:00:00.000Z",
    "endDate": "2024-07-10T17:00:00.000Z",
    "location": "Hội trường A, Đại học FPT",
    "status": "active",
    "category": "Công nghệ"
  }
]
```

#### GET - Lấy sự kiện theo ID
```
GET http://localhost:9999/api/events/507f1f77bcf86cd799439011
```

#### POST - Tạo sự kiện mới
```
POST http://localhost:9999/api/events
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "title": "Sự kiện mới",
  "description": "Mô tả sự kiện mới",
  "startDate": "2024-12-25T08:00:00.000Z",
  "endDate": "2024-12-25T17:00:00.000Z",
  "location": "Hội trường C",
  "category": "Giáo dục",
  "status": "active"
}
```

#### PUT - Cập nhật sự kiện
```
PUT http://localhost:9999/api/events/507f1f77bcf86cd799439011
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "title": "Hội thảo Công nghệ 2024 - Cập nhật",
  "description": "Mô tả đã được cập nhật",
  "startDate": "2024-07-10T08:00:00.000Z",
  "endDate": "2024-07-10T17:00:00.000Z",
  "location": "Hội trường A, Đại học FPT",
  "category": "Công nghệ",
  "status": "active"
}
```

#### DELETE - Xóa sự kiện
```
DELETE http://localhost:9999/api/events/507f1f77bcf86cd799439011
```

### 2. **Schedules API**

#### GET - Lấy tất cả lịch trình
```
GET http://localhost:9999/api/schedules
```

#### GET - Lấy lịch trình theo sự kiện
```
GET http://localhost:9999/api/schedules/event/507f1f77bcf86cd799439011
```

#### GET - Lấy lịch trình theo ID
```
GET http://localhost:9999/api/schedules/507f1f77bcf86cd799439021
```

#### POST - Tạo lịch trình mới
```
POST http://localhost:9999/api/schedules
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "eventId": "507f1f77bcf86cd799439011",
  "title": "Lịch trình mới",
  "description": "Mô tả lịch trình mới",
  "startTime": "2024-07-10T09:00:00.000Z",
  "endTime": "2024-07-10T10:00:00.000Z",
  "location": "Phòng Lab 3",
  "type": "workshop",
  "order": 5
}
```

#### PUT - Cập nhật lịch trình
```
PUT http://localhost:9999/api/schedules/507f1f77bcf86cd799439021
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "title": "Khai mạc Hội thảo - Cập nhật",
  "description": "Mô tả đã được cập nhật",
  "startTime": "2024-07-10T08:00:00.000Z",
  "endTime": "2024-07-10T08:30:00.000Z",
  "location": "Hội trường A",
  "type": "presentation",
  "order": 1
}
```

#### DELETE - Xóa lịch trình
```
DELETE http://localhost:9999/api/schedules/507f1f77bcf86cd799439021
```

## 🔍 Test Cases

### 1. **Test Events**

#### ✅ Test Case 1: Lấy danh sách sự kiện
1. Gửi `GET http://localhost:9999/api/events`
2. Kiểm tra response có 5 sự kiện
3. Kiểm tra status code = 200

#### ✅ Test Case 2: Tạo sự kiện mới
1. Gửi `POST http://localhost:9999/api/events` với body JSON
2. Kiểm tra response có _id mới
3. Kiểm tra status code = 201

#### ✅ Test Case 3: Cập nhật sự kiện
1. Gửi `PUT http://localhost:9999/api/events/{id}` với body JSON
2. Kiểm tra response có title đã được cập nhật
3. Kiểm tra status code = 200

#### ✅ Test Case 4: Xóa sự kiện
1. Gửi `DELETE http://localhost:9999/api/events/{id}`
2. Kiểm tra response có message "Event deleted successfully"
3. Kiểm tra status code = 200

### 2. **Test Schedules**

#### ✅ Test Case 1: Lấy lịch trình theo sự kiện
1. Gửi `GET http://localhost:9999/api/schedules/event/507f1f77bcf86cd799439011`
2. Kiểm tra response có 4 lịch trình cho sự kiện "Hội thảo Công nghệ"
3. Kiểm tra status code = 200

#### ✅ Test Case 2: Tạo lịch trình mới
1. Gửi `POST http://localhost:9999/api/schedules` với body JSON
2. Kiểm tra response có _id mới
3. Kiểm tra status code = 201

## 🚨 Lỗi thường gặp

### 1. **Connection refused**
- Kiểm tra backend có đang chạy không
- Kiểm tra port 9999 có bị block không

### 2. **404 Not Found**
- Kiểm tra URL có đúng không
- Kiểm tra ID có tồn tại trong database không

### 3. **500 Internal Server Error**
- Kiểm tra MongoDB có đang chạy không
- Kiểm tra connection string có đúng không

### 4. **400 Bad Request**
- Kiểm tra JSON body có đúng format không
- Kiểm tra các trường bắt buộc có đầy đủ không

## 📊 Expected Results

### Events Collection: 5 documents
- Hội thảo Công nghệ 2024
- Ngày hội việc làm
- Workshop Phát triển Web
- Cuộc thi Hackathon
- Hội thảo Khởi nghiệp

### Schedules Collection: 14 documents
- 4 lịch trình cho Hội thảo Công nghệ
- 3 lịch trình cho Ngày hội việc làm
- 4 lịch trình cho Workshop Web
- 2 lịch trình cho Hackathon
- 2 lịch trình cho Hội thảo Khởi nghiệp 