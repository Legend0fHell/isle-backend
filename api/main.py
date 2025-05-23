from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import individual router modules from the .routers package (api/routers/)
# Ensure api/routers/__init__.py exists.
# Example: if you have api/routers/users.py containing a router named 'router'
from routers import users, questions, lessons, courses, asl_characters, progress
# You might need to adjust these imports based on the exact filenames and 
# how you expose the router object within each file (e.g., is it always named 'router'?).
# Or, your api/routers/__init__.py could import and expose them, e.g.:
# # In api/routers/__init__.py:
# from .users import router as users_router
# from .courses import router as courses_router
# # Then in main.py: from .routers import users_router, courses_router

app = FastAPI(
    title="ASL Learning API",
    description="API backend cho hệ thống học ngôn ngữ ký hiệu ASL.",
    version="1.0.0"
)

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

# Include routers from the imported modules
# This assumes each imported module (users, courses, etc.) has an attribute 'router'
app.include_router(users.router, tags=["Users"])
app.include_router(questions.router, tags=["Questions"])
app.include_router(lessons.router, tags=["Lessons"])
app.include_router(courses.router, tags=['Courses'])
app.include_router(progress.router, tags=["Progress"])
app.include_router(asl_characters.router, tags=["ASL Characters"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the ASL Learning API 🎉"}
