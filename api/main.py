from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import các router
from api.routers import (
    detections,
    questions,
    users,
    courses,
    practice,
    asl_reference,
)

# Khởi tạo app
app = FastAPI(
    title="ASL Learning API",
    description="API backend cho hệ thống học ngôn ngữ ký hiệu ASL.",
    version="1.0.0"
)

# Cấu hình CORS (nếu cần kết nối từ frontend)
origins = [
    "http://localhost",
    "http://localhost:3000", 
 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include tất cả các routers
app.include_router(users.router)
app.include_router(courses.router)
app.include_router(questions.router)
app.include_router(practice.router)
app.include_router(detections.router)
app.include_router(asl_reference.router)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the ASL Learning API 🎉"}
