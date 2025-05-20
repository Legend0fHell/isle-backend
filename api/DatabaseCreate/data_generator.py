import json
import psycopg2
# Connect to the PostgreSQL database
conn = psycopg2.connect(
    host="localhost",
    database="asl_db",
    user="postgres",
    password="minhquan0409",
    port="5432"
)

# Create a cursor object
cur = conn.cursor()


# first insert data into questions table 
# then insert data into lessons table
# then insert data into lesson_questions table
# then insert data into courses table
# then insert data into course_lessons table

questions = []
# read questions from questions.txt file
with open("api\DatabaseCreate\questions.txt", "r") as f:
    for line in f:
        question = json.loads(line)
        questions.append(question)
# insert questions into questions table
for question in questions:
    cur.execute(""" 
                insert into questions (question_id, question_type, question_target, question_choice)
                values(%s, %s, %s, %s)
                """, (question['question_id'],question['question_type'], question['question_target'], question['question_choice']))
    conn.commit() 
    
# read lessons from lessons.txt file

lessons = []
# read lessons from lessons.txt file
with open("api\DatabaseCreate\lessons.txt", "r") as f:
    for line in f:
        lesson = json.loads(line)
        lessons.append(lesson)
# insert lessons into lessons table
for lesson in lessons:
    cur.execute(""" 
                insert into lessons (lesson_id, lesson_name, lesson_desc, lesson_type)
                values(%s, %s, %s, %s)
                """, (lesson['lesson_id'], lesson['lesson_name'], lesson['lesson_desc'], lesson['lesson_type']))
    conn.commit()
    
# read lesson_questions from lesson_questions.txt file

lesson_questions = []
# read lesson_questions from lesson_questions.txt file
with open("api\DatabaseCreate\lesson_questions.txt", "r") as f:
    for line in f:
        lesson_question = json.loads(line)
        lesson_questions.append(lesson_question)
        
# insert lesson_questions into lesson_questions table

for lesson_question in lesson_questions:
    cur.execute(""" 
                insert into lesson_questions (lq_entries_id, lesson_id, question_id, index_in_lesson)
                values(%s, %s, %s, %s)
                """, (lesson_question['lq_entries_id'], lesson_question['lesson_id'], lesson_question['question_id'], lesson_question['index_in_lesson']))
    conn.commit()
# read courses from courses.txt file
courses = []
# read courses from courses.txt file
with open("api\DatabaseCreate\courses.txt", "r") as f:
    for line in f:
        course = json.loads(line)
        courses.append(course)
# insert courses into courses table
for course in courses:
    cur.execute(""" 
                insert into courses (course_id, course_name, course_desc, course_difficulty)
                values(%s, %s, %s, %s)
                """, (course['course_id'], course['course_name'], course['course_desc'], course['course_difficulty']))
    conn.commit()
# read course_lessons from course_lessons.txt file
course_lessons = []
# read course_lessons from course_lessons.txt file
with open("api\DatabaseCreate\course_lessons.txt", "r") as f:
    for line in f:
        course_lesson = json.loads(line)
        course_lessons.append(course_lesson)
# insert course_lessons into course_lessons table
for course_lesson in course_lessons:
    cur.execute(""" 
                insert into course_lessons (cl_entries_id, course_id, lesson_id, index_in_course)
                values(%s, %s, %s, %s)
                """, (course_lesson['course_lesson_id'], course_lesson['course_id'], course_lesson['lesson_id'], course_lesson['index_in_course']))
    conn.commit()
# close the connection
cur.close()
conn.close()
print("Inserted data into questions, lessons, lesson_questions, courses, course_lessons tables.")
