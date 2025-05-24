# Ý tưởng chung
- Nên xem phần Luồng, và phần Tables song song.
- Lưu ý: Table != Class. Các lớp thì backend và frontend tự thiết kế cho phù hợp. Tuy nhiên trong này, tôi sẽ cố gắng để đầu ra (response) gần với Table nhất.
- Đơn giản, nhưng có thể vẽ thêm để cho phức tạp :))
- Thiết kế bài học dưới dạng Course (khóa học) -> Lesson (bài học) -> Question (câu hỏi).

# Tables

## User
Lưu thông tin người dùng.

- user_id: PK
- email
- password
- name

## Course
Lưu thông tin khóa học.

- course_id: PK
- course_name
- course_desc
- course_difficulty: từ 1 dễ -> 5 khó

## Lesson
Lưu thông tin bài học.

- lesson_id: PK
- lesson_name
- lesson_desc
- lesson_type: Cái này có thể:
    1. "learn": Học một chữ cái (nhiều về lý thuyết), sau đó luyện tạo dáng tay để detect ở cuối. Cho dùng "hint".
    2. "practice": Luyện tạo dáng tay detect (vẫn là 1 chữ), có trắc nghiệm để phân biệt 2 chiều giữa "chữ <-> dáng tay". Cho dùng "hint"
    3. "test": Kết thúc 1 phần khóa học, hoặc toàn bộ khóa học. Luyện tạo dáng tay detect với nhiều chữ hơn, trắc nghiệm phân biệt, cụm từ dài. không dùng "hint".

## Question
Lưu thông tin câu hỏi.

- question_id: PK
- question_type: Vài loại như trên:
    1. "learn": "Dạy" ký tự. (tương đương bật cửa sổ hint).
    2. "detect": Tạo dáng tay thành ký tự (dãy ký tự) phù hợp.
    3. "choice_to_char": Trắc nghiệm từ ảnh -> ký hiệu
    4. "choice_to_image": Trắc nghiệm từ ký hiệu -> ảnh
- question_target: Đáp án của câu:
    1. Với type="learn", đây là chữ mà câu này muốn dạy
    2. type="detect", đây là ký tự (dãy ký tự) đc yêu cầu.
    3. type="choices_to_char" hoặc "to_image", đây là nội dung của đáp án đúng (sẽ chỉ có 1 ký tự).
- question_choice: Lựa chọn trong câu 
    1. Chỉ có nếu type = "choices...", còn lại, ta có giá trị của nó bằng với giá trị của "question_target" (QUAN TRỌNG).
    2. Là 1 string, tối đa 4 ký tự tương ứng 4 lựa chọn có thể.

## CourseLesson
Lưu danh sách Bài học trong Khóa học.

- cl_entries_id: PK
- course_id: FK -> course
- lesson_id: FK -> lesson
- index_in_course: Chỉ số của bài học trong khóa học tg ứng.

## LessonQuestion
Lưu danh sách Câu hỏi trong Bài học.

- lq_entries_id: PK
- lesson_id: FK -> lesson
- question_id: FK -> question
- index_in_lesson: Chỉ số của câu hỏi trong bài học.

## UserLessonProgress
Lưu tiến độ Bài học của người dùng. Khi ng dùng xong 1 câu hỏi, cái này sẽ được cập nhật bởi backend.

- progress_id: PK
- user_id: FK -> user
- lesson_id: FK -> lesson
- last_activity_at: Dạng thời gian (timestamp), lưu thời gian đụng chạm lần cuối vô đây.
- correct_question: Đếm số câu hỏi đã hoàn thành.

## UserQuestionAnswer
Lưu nội dung câu trả lời câu hỏi của người dùng. Khi ng dùng nhấn Next (hoặc gì đó), gửi đáp án cho backend, backend sẽ cập nhật bảng này.

Lưu ý rằng trong này có 2 PK, do bảng này liên tục bị ghi đè.

- progress_id: PK -> progress
- question_id: PK -> question
- user_choice: Nội dung câu trả lời của ng dùng. 
    1. Nếu câu hỏi dạng "choices..", nó lưu NỘI DUNG của lựa chọn ng dùng đã chọn. dài tối đa 1 ký tự.
    2. Nếu câu hỏi dạng "detect", nó lưu kết quả detect của ng dùng. đảm bảo độ dài không dài hơn đáp án trong câu. Nếu lỡ dài hơn, ta chỉ lấy phần cuối của dãy.
- is_correct: Trả lời đúng hay sai.

## ASLCharacter
Lưu thông tin về ký tự trong ngôn ngữ ký hiệu ASL.

- char_name: PK
- char_image_url: Địa chỉ ảnh minh họa (hoặc cái này mình nên cho vô public frontend :)))
- char_tutorial_text: Hướng dẫn bằng chữ cách tạo dáng tay
- char_tutorial_url: Hướng dẫn dạng video (link youtube..) cách tạo dáng tay.

# Luồng

## Luồng đăng nhập
1. Client gửi mail/pass cho server
2.1. Nếu juan, server gửi thông tin ng dùng đó cho client
2.2. Nếu sai, server gửi null

## Luồng xét câu trả lời câu hỏi
1. Client gửi câu trả lời của câu hỏi cho server
2. Server sẽ phản hồi đúng hay sai cho client
3. Server sẽ cập nhật trạng thái làm bài trong class UserLessonProgress và class UserQuestionAnswer.

# API
## Lưu ý
- Mọi đầu vào sẽ được gửi dưới dạng JSON, từ client gửi tới server.
- Mọi đầu ra sẽ có dạng JSON:
```
{
    "msg": <status>
    "data": {}
}
```
- Trong đó:
    1. "msg" sẽ có giá trị "ok" nếu lệnh không gặp lỗi, còn lại BUỘC PHẢI có dạng "error ", sau đó ghi thêm lỗi. Ví dụ "msg" = "error Invalid credentials", msg = "error Internal error", msg = "ok", ...
    2. "data" là nội dung mà client đã yêu cầu/server sẽ trả về. Nếu không trả về gì (không cần trả về gì), PHẢI TRẢ VỀ {} (object rỗng, không được trả về null).

## User module
### Đăng nhập
- Request (JSON, POST `/user/login`)
```
    "email": <email>
    "password": <text>
```
- Response (JSON) -- Table: `User`
```
{
    "msg": <status>
    "data": {
        "user_id": <user_id>,
        "email": <email>,       
        "name": <name>
    }
}
```

### Đăng ký
- Request (JSON, POST `/user/register`)
```
    "name": <name>
    "email": <email>
    "password": <text>
```
- Response (JSON) -- Table: `User`
```
{
    "msg": <status>
    "data": {
        "user_id": <user_id>,
        "email": <email>,       
        "name": <name>
    }
}
```

### Đọc thông tin
- Request (JSON, GET `/user/info`)
```
    "user_id": <user_id>
```
- Response (JSON) -- Table: `User`
```
{
    "msg": <status>
    "data": {
        "user_id": <user_id>,
        "email": <email>,       
        "name": <name>
    }
}
```

## Course module
### Đọc danh sách các Bài học trong toàn bộ Khóa học
- Request (JSON, GET `/course/list`)
```
    <không có gì>
```
- Response (JSON) -- `List<Course>`
```
{
    "msg": <status>
    "data": [                                   # Lưu ý: Đây là Mảng các Khóa học.
        {
            "course_id": <course_id>
            "course_name": <tên>
            "course_desc": <mô tả>
            "course_difficulty": <int>
            "course_lessons": [                 # Mảng các bài học, Phần tử đầu tiên = bài học đầu tiên, phần tử thứ 2 = ...
                {
                    "lesson_id": <lesson_id>,
                    "lesson_name"
                    "lesson_desc"
                    "lesson_type"
                    "lesson_num_question": <int> # Số lượng câu hỏi trong bài học. Lưu ý cái này không có trong database, backend tự tính.
                },
                {
                    "lesson_id": <lesson_id>,
                    ...
                }
            ]
        }, 
        {
            "course_id": <course_id>
            "course_name": <tên>
            "course_desc": <mô tả>
            ...
        }, 
        ...
    ]
}
```

### Lấy tiến độ làm bài của người dùng
- Request (JSON, GET `/course/progress`)
```
    "user_id": <user_id>
```
- Response (JSON) -- `List<UserLessonProgress>`
```
{
    "msg": <status>
    "data": [                                   # Lưu ý: Đây là Mảng tiến độ các bài học
        {
            "progress_id": <progress_id>
            "lesson_id": <lesson_id>
            "last_activity_at": <timestamp>
            "correct_question": <int>           # Số lượng câu hỏi đã trả lời ĐÚNG
        }, 
        {
            "progress_id": <progress_id>
            "lesson_id": <lesson_id>
            ...
        }, 
        ...
    ]
}
```

## Lesson module
### Đọc nội dung các Câu hỏi trong một Bài học
- Request (JSON, GET `/lesson/list`)
```
    "lesson_id": <lesson_id>
```
- Response (JSON) -- `List<Question>`
```
{
    "msg": <status>
    "data": [                                   # Lưu ý: Đây là Mảng các Câu hỏi. Phần tử đầu tiên = câu hỏi đầu tiên, phần tử thứ 2 = ...
        {
            "question_id": <question_id>
            "question_type": <loại câu hỏi>     # Lưu ý: Không đưa ra đáp án câu hỏi đó ở đây.
            "question_choice": <dãy lựa chọn>
        }, 
        {
            "question_id": <question_id>
            "question_type": <loại câu hỏi>
            ...
        }, 
        ...
    ]
}
```

### Lấy ID tiến độ của bài làm của người dùng
- Request (JSON, GET `/lesson/recent_progress`)
```
    "user_id": <user_id>    
    "lesson_id": <lesson_id>     # ID bài học
```
- Response (JSON) -- `List<UserQuestionAnswer>`
```
{
    "msg": <status>
    "data": {
        "progress_id": <progress_id>,    # Tiến độ tương ứng
        [                                   # Lưu ý: Đây là Mảng tiến độ các câu hỏi của progress_id trên
            {
                "question_id": <question_id>
                "user_choice": <lựa chọn>           # Lựa chọn hiện tại của người dùng
                "is_correct": <true/false>          # Hiện tại đang trả lời đúng hay sai?
            }, 
            {
                "question_id": <question_id>
                "user_choice": <lựa chọn>           
                "is_correct": <true/false>          
            }, 
            ...
        ]
    }
}
```

### Lấy tiến độ từng câu hỏi của người dùng
- Request (JSON, GET `/lesson/progress`)
```
    "progress_id": <progress_id>    # ID tiến độ, cái này sẽ có nếu gọi `/lesson/list`.
```
- Response (JSON) -- `List<UserQuestionAnswer>`
```
{
    "msg": <status>
    "data": [                                   # Lưu ý: Đây là Mảng tiến độ các câu hỏi
        {
            "question_id": <question_id>
            "user_choice": <lựa chọn>           # Lựa chọn hiện tại của người dùng
            "is_correct": <true/false>          # Hiện tại đang trả lời đúng hay sai?
        }, 
        {
            "question_id": <question_id>
            "user_choice": <lựa chọn>           
            "is_correct": <true/false>          
        }, 
        ...
    ]
}
```

### Kiểm tra đáp án câu hỏi
- Request (JSON, POST `/lesson/check`)
```
    "progress_id": <id của tiến độ>
    "question_id": <id câu hỏi cần check>
    "user_choice": <đáp án người dùng>
```
- Response (JSON)
```
{
    "msg": <status>                           # Nếu kiểm tra được, in ra "ok". "msg" không mang ý nghĩa đáp án đúng/sai.
    "data": <true/false>                      # Đáp án này đúng hay sai?
}
```

## ASL module

### Lấy thông tin của TOÀN BỘ ký tự ASL
- Request (JSON, GET `/asl`)
```
    <không có gì>
```
- Response (JSON) -- `List<ASLCharacter>`
```
{
    "msg": <status>                             # "ok"
    "data": [                                   # Lưu ý: Đây là mảng các ASLCharacter. Phần tử đầu là ký tự A, phần tử 2 là ký tự B,...
        {
            "char_name": <ký tự>                # Ký tự A. Lưu ý: char_name viết in hoa.
            "char_image_url": <link ảnh>        # Link ảnh minh họa, (hay là bỏ nhỉ, lấy ảnh từ public bên frontend nhanh hơn)
            "char_tutorial_text": <mô tả>       # Hướng dẫn bằng chữ
            "char_tutorial_url": <link video>   # Hướng dẫn bằng video.
        }
    ]
}
```
