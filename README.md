# Hệ thống Quản lý Sự kiện - SDN Project

Một ứng dụng web đơn giản để quản lý sự kiện và lịch trình, được xây dựng với MongoDB, Express.js và React.

## Tính năng

### Quản lý Sự kiện
- ✅ Thêm, sửa, xóa sự kiện
- ✅ Tìm kiếm sự kiện theo tên và mô tả
- ✅ Lọc sự kiện theo trạng thái (Đang diễn ra, Đã hủy, Đã hoàn thành)
- ✅ Hiển thị thông tin chi tiết: tiêu đề, mô tả, ngày bắt đầu/kết thúc, địa điểm, danh mục

### Quản lý Lịch trình
- ✅ Thêm, sửa, xóa lịch trình cho từng sự kiện
- ✅ Hiển thị lịch trình theo timeline với thời gian
- ✅ Lọc lịch trình theo loại (Phiên thảo luận, Nghỉ giải lao, Hội thảo, Thuyết trình, Khác)
- ✅ Sắp xếp lịch trình theo thời gian và thứ tự

## Cấu trúc Database

### Collections MongoDB

#### 1. Events
```javascript
{
  _id: ObjectId,
  title: String,           // Tên sự kiện
  description: String,     // Mô tả sự kiện
  startDate: Date,         // Ngày bắt đầu
  endDate: Date,          // Ngày kết thúc
  location: String,       // Địa điểm
  status: String,         // Trạng thái (active, cancelled, completed)
  category: String,       // Danh mục sự kiện
  createdBy: ObjectId,    // Reference đến User
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. Schedules
```javascript
{
  _id: ObjectId,
  eventId: ObjectId,      // Reference đến Event
  title: String,          // Tên lịch trình
  description: String,    // Mô tả lịch trình
  startTime: Date,        // Thời gian bắt đầu
  endTime: Date,          // Thời gian kết thúc
  location: String,       // Địa điểm
  type: String,           // Loại lịch trình (session, break, workshop, presentation, other)
  order: Number,          // Thứ tự trong lịch trình
  createdBy: ObjectId,    // Reference đến User
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. Users
```javascript
{
  _id: ObjectId,
  username: String,       // Tên đăng nhập
  email: String,          // Email
  password: String,       // Mật khẩu (hashed)
  fullName: String,       // Họ tên đầy đủ
  role: String,           // Vai trò (admin, user)
  createdAt: Date,
  updatedAt: Date
}
```

## Cài đặt và Chạy

### Yêu cầu hệ thống
- Node.js (v14 trở lên)
- MongoDB (v4.4 trở lên)
- npm hoặc yarn

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd sdnproject
```

### Bước 2: Cài đặt dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### Bước 3: Cấu hình MongoDB
Đảm bảo MongoDB đang chạy trên máy local hoặc cập nhật connection string trong file `.env`:

```bash
# Backend/.env
MONGODB_URI=mongodb://localhost:27017/sdn_event_management
JWT_SECRET=your_jwt_secret_key_here
PORT=9999
```

### Bước 4: Import dữ liệu mẫu
```bash
# Import events
mongoimport --db sdn_event_management --collection events --file events.json --jsonArray

# Import schedules
mongoimport --db sdn_event_management --collection schedules --file schedules.json --jsonArray
```

### Bước 5: Chạy ứng dụng

#### Terminal 1 - Backend
```bash
cd backend
npm start
```
Backend sẽ chạy trên http://localhost:9999

#### Terminal 2 - Frontend
```bash
cd frontend
npm start
```
Frontend sẽ chạy trên http://localhost:3000

## API Endpoints

### Events
- `GET /api/events` - Lấy danh sách sự kiện
- `GET /api/events/:id` - Lấy chi tiết sự kiện
- `POST /api/events` - Tạo sự kiện mới
- `PUT /api/events/:id` - Cập nhật sự kiện
- `DELETE /api/events/:id` - Xóa sự kiện

### Schedules
- `GET /api/schedules` - Lấy danh sách lịch trình
- `GET /api/schedules/event/:eventId` - Lấy lịch trình theo sự kiện
- `GET /api/schedules/:id` - Lấy chi tiết lịch trình
- `POST /api/schedules` - Tạo lịch trình mới
- `PUT /api/schedules/:id` - Cập nhật lịch trình
- `DELETE /api/schedules/:id` - Xóa lịch trình

## Công nghệ sử dụng

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM cho MongoDB
- **bcryptjs** - Mã hóa mật khẩu
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Axios** - HTTP client
- **date-fns** - Date utility library
- **react-datepicker** - Date picker component
- **lucide-react** - Icon library

## Cấu trúc thư mục

```
sdnproject/
├── backend/
│   ├── config/
│   │   └── db.js
│   │   └── middleware/
│   │   └── auth.js
│   │   └── models/
│   │   └── routes/
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EventList.js
│   │   │   ├── EventList.css
│   │   │   ├── EventForm.js
│   │   │   ├── EventForm.css
│   │   │   ├── ScheduleList.js
│   │   │   ├── ScheduleList.css
│   │   │   ├── ScheduleForm.js
│   │   │   └── ScheduleForm.css
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── events.json
├── schedules.json
├── import_guide.md
└── README.md
```

## Tính năng bổ sung có thể phát triển

- [ ] Hệ thống đăng nhập/đăng ký
- [ ] Phân quyền người dùng
- [ ] Upload hình ảnh cho sự kiện
- [ ] Gửi email thông báo
- [ ] Export lịch trình ra PDF/Excel
- [ ] Calendar view
- [ ] Push notifications
- [ ] Mobile app

## Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

MIT License
