import sys 
import os 
import psycopg2
import json
from urllib.parse import urlparse
from dotenv import load_dotenv
from datetime import datetime, UTC

# Load environment variables
load_dotenv()
db_url = os.getenv("DATABASE_URL")
parsed_url = urlparse(db_url)

# Connect to default postgres database to drop/create asl_db
conn_psql = psycopg2.connect(
    database="postgres",
    user=parsed_url.username,
    password=parsed_url.password,
    host=parsed_url.hostname,
    port=parsed_url.port
)
conn_psql.autocommit = True
cur_psql = conn_psql.cursor()

# Drop database if exists
cur_psql.execute("DROP DATABASE IF EXISTS asl_db")

# Create new database
cur_psql.execute("CREATE DATABASE asl_db")

# Close connection
cur_psql.close()
conn_psql.close()

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.question import Question, LessonQuestion 
from models.alphabet import ASLCharacter 
from models.user import User, UserLessonProgress, UserQuestionAnswer
from database import Base, engine

print("Creating all tables if not exist...")
Base.metadata.create_all(bind=engine)
print("Done.")


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR,"data_loader")

# Parse DATABASE_URL
db_url = os.getenv("DATABASE_URL")
parsed_url = urlparse(db_url)

# Kết nối đến cơ sở dữ liệu
conn = psycopg2.connect(
    database=parsed_url.path[1:],  # remove leading '/'
    user=parsed_url.username,
    password=parsed_url.password,
    host=parsed_url.hostname,
    port=parsed_url.port
)
cur = conn.cursor()

# ------------------------------
# Đọc và chèn dữ liệu vào bảng
# ------------------------------

# 0. Users
cur.execute("""
            INSERT INTO users (user_id, email, name, password, created_at, last_login)
            VALUES (%s, %s, %s, %s, %s, %s)
            """, ("0faa0486-dac5-4c84-8bd8-13e6fc65c666", 
                  "test@gmail.com", 
                  "Test User", 
                  "testtest", 
                  datetime.now(UTC), 
                  datetime.now(UTC)))

# 1. Questions
questions = []
with open(os.path.join(DATA_DIR, "questions.txt"), "r", encoding="utf-8") as f:
    for line in f:
        questions.append(json.loads(line))

for q in questions:
    cur.execute("""
        INSERT INTO questions (question_id, question_type, question_target, question_choice)
        VALUES (%s, %s, %s, %s)
    """, (q['question_id'], q['question_type'], q['question_target'], q['question_choice']))
    
# 2. Lessons
lessons = []
with open(os.path.join(DATA_DIR, "lessons.txt"), "r", encoding="utf-8") as f:
    for line in f:
        lessons.append(json.loads(line))

for l in lessons:
    cur.execute("""
        INSERT INTO lessons (lesson_id, lesson_name, lesson_desc, lesson_type)
        VALUES (%s, %s, %s, %s)
    """, (l['lesson_id'], l['lesson_name'], l['lesson_desc'], l['lesson_type']))

# 3. Lesson Questions
lesson_questions = []
with open(os.path.join(DATA_DIR, "lesson_questions.txt"), "r", encoding="utf-8") as f:
    for line in f:
        lesson_questions.append(json.loads(line))

for lq in lesson_questions:
    cur.execute("""
        INSERT INTO lesson_questions (lq_entries_id, lesson_id, question_id, index_in_lesson)
        VALUES (%s, %s, %s, %s)
    """, (lq['lq_entries_id'], lq['lesson_id'], lq['question_id'], lq['index_in_lesson']))

# 4. Courses
courses = []
with open(os.path.join(DATA_DIR, "courses.txt"), "r", encoding="utf-8") as f:
    for line in f:
        courses.append(json.loads(line))

for c in courses:
    cur.execute("""
        INSERT INTO courses (course_id, course_name, course_desc, course_difficulty)
        VALUES (%s, %s, %s, %s)
    """, (c['course_id'], c['course_name'], c['course_desc'], c['course_difficulty']))

# 5. Course Lessons
course_lessons = []
with open(os.path.join(DATA_DIR, "course_lessons.txt"), "r", encoding="utf-8") as f:
    for line in f:
        course_lessons.append(json.loads(line))

for cl in course_lessons:
    cur.execute("""
        INSERT INTO course_lessons (cl_entries_id, course_id, lesson_id, index_in_course)
        VALUES (%s, %s, %s, %s)
    """, (cl['course_lesson_id'], cl['course_id'], cl['lesson_id'], cl['index_in_course']))

# 6. ASL
asl = []
with open(os.path.join(DATA_DIR, "asl.txt"), "r", encoding="utf-8") as f:
    for line in f:
        asl.append(json.loads(line))

for a in asl:
    cur.execute("""
        INSERT INTO asl_characters (char_name, char_image_url, char_tutorial_text, char_tutorial_url)
        VALUES (%s, %s, %s, %s)
    """, (a['char_name'], a['char_image_url'], a['char_tutorial_text'], a['char_tutorial_url']))

conn.commit()
# Đóng kết nối
cur.close()
conn.close()
print("Load data successfully into: questions, lessons, lesson_questions, courses, course_lessons, asl_characters.")
print("Test user created successfully.\nEmail: test@gmail.com\nPassword: testtest")
