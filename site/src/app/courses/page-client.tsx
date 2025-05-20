"use client"

// Tạm thời cx tam tam, test sau, khi da co db

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Course, CourseLesson } from "types/question"


const CourseStack = () => {
  // Changed to track expanded state for each course
  const [expandedCourses, setExpandedCourses] = useState<{ [key: string]: boolean }>({})
  // Changed to track refs for each course
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const [courseslessons, setCoursesLessons] = useState<CourseLesson[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const toggleExpand = (courseId: string) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }))
  }

  const fetchCourses = async () => {
    setLoading(true)

    fetch(`https://8694-171-224-181-214.ngrok-free.app/api/course/list/`, {
      method: "GET",
      redirect: "follow"
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("Raw API response:", responseData);

        // Kiểm tra cấu trúc response và lấy mảng courses đúng cách
        let courseData;
        if (responseData && responseData.data) {
          // Nếu API trả về cấu trúc { msg, data }
          courseData = responseData.data
        } else {
          // Trường hợp khác, có thể cần xử lý thêm
          console.error("Unexpected API response format:", responseData);
          setError("Định dạng dữ liệu không đúng");
          courseData = [];
        }

        console.log("Processed courses:", courseData);
        setCourses(courseData);

        // Initialize expanded state for all courses
        const initialExpandedState: { [key: string]: boolean } = {};
        courseData.forEach((course: Course) => {
          initialExpandedState[course.course_id] = false;
        });
        setExpandedCourses(initialExpandedState);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setError("Lỗi khi tải dữ liệu khóa học");
        setLoading(false);
      })
  }

  const getLessons = async () => {
    // Reset courseslessons trước khi thêm mới để tránh trùng lặp
    setCoursesLessons([]);

    // use courses state directly
    courses.forEach((course) => {
      if (course.course_lessons && course.course_lessons.length > 0) {
        setCoursesLessons(prev => [...prev, ...course.course_lessons])
      }
    })
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    if (courses.length > 0) {
      getLessons()
    }
  }, [courses])

  if (loading) {
    return <div className="p-4 text-center">Loading courses...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (courses.length === 0) {
    return <div className="p-4 text-center">Không có khóa học nào.</div>;
  }

  return (
    <div className="space-y-8">
      {courses.map((course) => (
        <div
          key={course.course_id}
          className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-500"
        >
          <div
            className="p-6 bg-gradient-to-r from-purple-800 to-purple-950 text-white cursor-pointer flex justify-between items-center"
            onClick={() => toggleExpand(course.course_id)}
          >
            <div>
              <h3 className="text-2xl font-bold">{course.course_name || course.course_id}</h3>
              <p className="mt-2 text-purple-200">{course.course_desc || "No description available"}</p>
            </div>
            <div className="bg-white/20 p-2 rounded-full transition-transform duration-300">
              {expandedCourses[course.course_id] ?
                <ChevronUp className="h-6 w-6 text-white" /> :
                <ChevronDown className="h-6 w-6 text-white" />
              }
            </div>
          </div>

          <div
            ref={(el) => { contentRefs.current[course.course_id] = el; }}
            className="overflow-hidden transition-all duration-500 ease-in-out"
            style={{
              maxHeight: expandedCourses[course.course_id] ?
                `${contentRefs.current[course.course_id]?.scrollHeight || 1000}px` : "0px",
              opacity: expandedCourses[course.course_id] ? 1 : 0,
            }}
          >
            <div className="bg-gray-50 p-4">
              <div className="space-y-4">
                {course.course_lessons && course.course_lessons.length > 0 ? (
                  course.course_lessons.map((lesson) => (
                    <div
                      key={lesson.lesson_id}
                      className="bg-white p-4 rounded-md shadow border-l-4 border-purple-500 hover:shadow-md transition-all transform hover:-translate-y-1 duration-300"
                    >
                      <h4 className="text-lg font-semibold text-gray-800">{lesson.lesson_id}</h4>
                      <p className="mt-2 text-gray-600">Click to start the lesson!</p>
                      <div className="mt-3">
                        <Link
                          href={`/lessons/${lesson.lesson_id}`}
                          className="text-purple-600 hover:text-purple-800 font-medium flex items-center"
                        >
                          Start Lesson
                          <ChevronDown className="h-4 w-4 ml-1 rotate-90" />
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">No lessons available for this course.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CourseStack;