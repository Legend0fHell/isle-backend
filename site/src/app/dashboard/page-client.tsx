"use client"

// Tạm thời đang như cuwts, như cuwts for real, đang tạm thời như cuwts
// Nó dùng để gọi course stacks từ database, nhưng hiện tại đang như cutws

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Course, Lesson } from "types/question"
import { getAllCourses } from "models/question"

const CourseStack = ({ courses }: { courses: Course }) => {
  const [expanded, setExpanded] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  // useEffect(() => {
  //   const fetchLessons = async () => {
  //     try {
  //       const response = await getAllCourses()
  //       const courseData = response.find((c: Course) => c.course_id === course.course_id)
  //       if (courseData) {
  //         setLessons(courseData.)
  //       }
  //     } catch (error) {
  //       console.error("Error fetching lessons:", error)
  //     }
  //   }
  //   fetchLessons()
  // }
  // , [course.course_id])

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-500">
      <div
        className="p-6 bg-gradient-to-r from-purple-800 to-purple-950 text-white cursor-pointer flex justify-between items-center"
        onClick={toggleExpand}
      >
        <div>
          <h3 className="text-2xl font-bold">{courses.course_name}</h3>
          <p className="mt-2 text-purple-200">{courses.course_desc}</p>
        </div>
        <div className="bg-white/20 p-2 rounded-full transition-transform duration-300">
          {expanded ? <ChevronUp className="h-6 w-6 text-white" /> : <ChevronDown className="h-6 w-6 text-white" />}
        </div>
      </div>

      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          maxHeight: expanded ? `${contentRef.current?.scrollHeight}px` : "0px",
          opacity: expanded ? 1 : 0,
        }}
      >
        <div className="bg-gray-50 p-4">
          <div className="space-y-4">
            <div
              key={1}
              className="bg-white p-4 rounded-md shadow border-l-4 border-purple-500 hover:shadow-md transition-all transform hover:-translate-y-1 duration-300"
            >
              <h4 className="text-lg font-semibold text-gray-800">{courses.course_name}</h4>
              <p className="mt-2 text-gray-600">{courses.course_desc}</p>
              <div className="mt-3">
                <Link
                  href={`/lessons/${1}`}
                  className="text-purple-600 hover:text-purple-800 font-medium flex items-center"
                >
                  Start Lesson
                  <ChevronDown className="h-4 w-4 ml-1 rotate-270" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CourseStacks() {
  const courses = [
    {
      course_id: "1",
      course_name: "Course 1",
      course_desc: "Introduction to the fundamentals and core concepts",
      course_difficulty: "Beginner",
      lessons: [
        {
          lesson_id: 101,
          lesson_name: "Lesson 1",
          lesson_desc: "Understanding the basic principles and getting started",
        },
        {
          lesson_id: 102,
          lesson_name: "Lesson 2",
          lesson_desc: "Building on the foundations with practical examples",
        },
        {
          lesson_id: 103,
          lesson_name: "Lesson 3",
          lesson_desc: "Advanced techniques and implementation strategies",
        },
      ],
    },
    {
      course_id: "2",
      course_name: "Course 2",
      course_desc: "Intermediate level concepts and practical applications",
      course_difficulty: "Intermediate",
      lessons: [
        {
          lesson_id: 201,
          lesson_name: "Lesson 1",
          lesson_desc: "Exploring intermediate concepts and methodologies",
        },
        {
          lesson_id: 202,
          lesson_name: "Lesson 2",
          lesson_desc: "Practical implementation of key techniques",
        },
        {
          lesson_id: 203,
          lesson_name: "Lesson 3",
          lesson_desc: "Problem-solving and optimization strategies",
        },
      ],
    },
    {
      course_id: "3",
      course_name: "Course 3",
      course_desc: "Advanced topics and professional-level techniques",
      course_difficulty: "Advanced",
      lessons: [
        {
          lesson_id: 301,
          lesson_name: "Lesson 1",
          lesson_desc: "Deep dive into advanced concepts and theories",
        },
        {
          lesson_id: 302,
          lesson_name: "Lesson 2",
          lesson_desc: "Professional techniques and industry best practices",
        },
        {
          lesson_id: 303,
          lesson_name: "Lesson 3",
          lesson_desc: "Mastering complex scenarios and edge cases",
        },
      ],
    },
    {
      course_id: "4",
      course_name: "Course 4",
      course_desc: "Specialized knowledge and expert-level content",
      course_difficulty: "Expert",
      lessons: [
        {
          lesson_id: 401,
          lesson_name: "Lesson 1",
          lesson_desc: "Specialized topics and cutting-edge approaches",
        },
        {
          lesson_id: 402,
          lesson_name: "Lesson 2",
          lesson_desc: "Expert-level techniques and advanced problem-solving",
        },
        {
          lesson_id: 403,
          lesson_name: "Lesson 3",
          lesson_desc: "Mastery and innovation in the field",
        },
      ],
    },
  ]

  return (
    <div className="space-y-16">
      {courses.map((course) => (
        <CourseStack key={course.course_id} course={course} />
      ))}
    </div>
  )
}
