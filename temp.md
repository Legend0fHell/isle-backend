
<h1 align="center">
  ISLE
</h1>

<h4 align="center">Hệ thống Nhận diện, hỗ trợ học tập Ký hiệu ngôn ngữ</h4>

<p align="center">
  <a href="">
    <img src="https://img.shields.io/badge/GitHub-%23121011.svg?logo=github&logoColor=white">
  </a>
  <a href="">
    <img src="https://img.shields.io/badge/backend-docker-blue?logo=docker">
  </a>
  <a href="">
    <img src="https://img.shields.io/badge/services-docker-blue?logo=docker">
  </a>
  <a href="">
    <img src="https://img.shields.io/badge/frontend-docker-blue?logo=docker">
  </a>
</p>

<p align="center">
  <a href="#mô-tả-dự-án"> Mô tả dự án</a> •
  <a href="#tính-năng">Tính năng</a> •
  <a href="#hướng-dẫn-cài-đặt">Hướng dẫn cài đặt</a> •
  <a href="#cấu-trúc-dự-án">Cấu trúc dự án</a> •
  <a href="#thành-viên-phát-triển">Thành viên phát triển</a>
</p>

---

<img src='site\public\ISLE Introduce.png'>

---

## Mô tả dự án

Để xem tài liệu chi tiết, vui lòng truy cập vào [Báo cáo chi tiết](https://drive.google.com/drive/folders/1B0yyAqPAsDNpzQCYAhXn3jDZxAe6x6kL?usp=sharing) của dự án trong Github hoặc có thể lick vào đường link đã được gắn vào.

### Tóm tắt chung

ISLE là một webapp đột phá, mang đến trải nghiệm mới lạ và độc đáo cho người dùng trong việc trải nghiệm nhận diện ngôn ngữ ASL, giúp đỡ việc học tập ngôn ngữ này không còn nhàm chán, đồng thời giúp đỡ xóa bỏ rào cản ngôn ngữ và gắn kết những người bị khiếm khuyết với cộng đồng. Với mục tiêu cao cả như vậy, hệ thống của ISLE vô cùng kì công và phức tạp với 3 thành phần chính:
- **Backend (FastAPI + PostgreSQL + Socket.io)**: Xử lý API, quản lý dữ liệu người dùng, dữ liệu ngôn ngữ, dữ liệu nhận diện tay, dữ liệu lớp học.
- **AI (LSTM + Deep Learning)**: Nhận diện ngôn ngữ theo thời gian thực với độ chính xác vượt trội, mô hình gợi ý cho người dùng thông minh.
- **Frontend (NextJS + TailwindCSS)**: Giao diện web thân thiện và dễ làm quan cho người dùng.

Các thành phần giao tiếp với nhau qua API và WebSocket, hỗ trợ triển khai nhanh chóng bằng Docker.

---

## Tính năng

- Nhận diện ngôn ngữ ASL thời gian thực bằng mô hình trí tuệ nhân tạo.
- Quản lý phiên đăng nhập, dữ liệu người dùng, dữ liệu lớp học và câu hỏi.
- Giao diện web trực quan cho người dùng và quản trị viên.
- Tích hợp WebSocket cho truyền dữ liệu camera và kết quả nhận diện.
- Dễ dàng triển khai với Docker Compose.
- Triển khai lớp học và hướng dẫn sử dụng ngôn ngữ ASL cho người dùng.

---

## Hướng dẫn cài đặt

### 1. Yêu cầu

- [Docker](https://www.docker.com/products/docker-desktop) và [Docker Compose](https://docs.docker.com/compose/).

### 2. Tải docker-compose.yml

File đã được nộp trên hệ thống UET-LMS
  
### 3. Chạy hệ thống

```bash
docker-compose up -d
```
Hướng dẫn sử dụng website (vui lòng đọc kĩ trước khi sử dụng): [`Tài liệu hướng dẫn sử dụng`](https://drive.google.com/drive/folders/12BjFiZTVHgaokd36Genj_v1ltk5Jyqiw?usp=drive_link) 

Truy cập các phần của website:
- **Trang chính**: http://localhost hoặc http://localhost:3000
- **Đăng nhập**: http://localhost:3000/login
- **Đăng kí**: http://localhost:3000/signup
- **Khóa học**: http://localhost:3000/courses
- **Trang nhận diện tay**: http://localhost:3000/detecting-mode
---

## Cấu trúc dự án

```
park-scan/
├── api/
├── ml/
├── nginx/
├── site/
├── docker-compose.yml
└── README.md
```
---

## Thành viên phát triển
- Phan Quang Trường
- Bùi Minh Quân
- Phạm Nhật Quang
---
> © 2025 ISLE Team
