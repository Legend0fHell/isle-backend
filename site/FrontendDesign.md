# Frontend Design Documentation

This document outlines key design decisions, interfaces, and functionalities implemented in the frontend application.

## Recent Major Changes & Implementations

### 1. API Request Modification (GET with Body)
- **Change**: Modified several API fetching functions to send parameters as a JSON object in the request body for GET requests, instead of query parameters.
- **Affected Model Files**:
    - `site/models/user.ts` (e.g., `getUser`)
    - `site/models/questions.ts` (e.g., `getLessonQuestions`)
    - `site/models/progress.ts` (e.g., `getUserProgress`, `getRecentLessonProgress`, `getLessonProgress`)
- **Note**: This is an unconventional pattern and requires the backend (FastAPI) to be specifically configured to handle JSON bodies for these GET requests.

### 2. Detecting Mode Refactor (`site/src/app/detecting-mode/page.tsx`)
- **Landmark Processing**: Extracted landmark processing logic into a `useCallback`-memoized function `handleLandmarkProcessing`.
- **`onResultsCallback`**: Refined to use `useCallback`, manage drawing utilities via `useRef`, and call `handleLandmarkProcessing`.
- **Drawing Utilities**: Loaded once in `setupHands` and stored in `drawingUtilsRef.current` for stable access.
- **`isConnected` State**: Improved WebSocket connection state handling to accurately update the `isConnected` state and reflect in the UI.
- **Type Safety**: Addressed various type annotations and MediaPipe type alignments.

### 3. Course and Lesson Management
- **Courses Page (`site/src/app/courses/page.tsx`)**:
    - Created to display available courses.
    - Fetches and displays course data.
    - Shows user progress on courses if the user is logged in.
- **Lesson View Page (`site/src/app/lessons/[lesson_id]/page.tsx`)**:
    - Dynamically handles lesson rendering based on `lesson_id`.
    - Fetches lesson details, questions, and user's recent progress for the lesson.
    - Manages states for current question, user answers, loading, and errors.
    - Implements navigation between questions ("Previous", "Next Question").
    - Implements "Submit Lesson" functionality for test-type lessons.
    - Implements "Next Lesson" navigation if a `next_lesson_id` is provided in lesson details.
    - Displays hints for learn/practice questions.

### 4. Question Handling System
- **`QuestionDisplay.tsx` (`site/src/components/QuestionComponents/QuestionDisplay.tsx`)**:
    - Conditionally renders different question type components based on `question.question_type`.
    - Manages display of feedback (correct/incorrect).
- **`LearnQuestionComponent.tsx` (`site/src/components/QuestionComponents/LearnQuestionComponent.tsx`)**:
    - Displays content for 'learn' type questions.
    - Shows character image (local), tutorial text, and embedded YouTube video.
    - Includes a "Mark as Reviewed" button.
- **`ChoiceQuestionComponent.tsx` (`site/src/components/QuestionComponents/ChoiceQuestionComponent.tsx`)**:
    - Handles 'choice_to_char' (image prompt, character choices) and 'choice_to_image' (character prompt, image choices) questions.
    - Manages selection, submission, and feedback display for choices.
    - Uses local images for prompts and choices.

### 5. Hint System
- **`HintPopup.tsx` (`site/src/components/HintPopup.tsx`)**:
    - Displays hints for ASL characters.
    - Shows character image (local), tutorial text, and embedded YouTube video.
    - Triggered from the `LessonPage`.

### 6. Image Handling Refactor
- **Local Images**: Updated components to use local images stored in `site/public/asl_example/` (e.g., `A.jpg`, `R.jpg`). All images are 200x200.
- **`next/image`**: Replaced standard `<img>` tags with the `next/image` component for optimized image loading and performance.
- **Affected Components**:
    - `HintPopup.tsx`
    - `LearnQuestionComponent.tsx`
    - `ChoiceQuestionComponent.tsx`

## New/Updated Interfaces and Types

### In `site/models/course.ts`:
- **`LessonSummary`** (New Interface):
  ```typescript
  export interface LessonSummary {
      lesson_id: UUID;
      name: string;
      lesson_type: LessonType;
      // Potentially other summary fields like order in course, completion status from user progress
  }
  ```
- **`Course`** (Interface Updated):
  ```typescript
  export interface Course {
      course_id: UUID;
      name: string;
      description: string;
      // lessons: LessonSummary[]; // Array of lesson summaries
      // Temp: Using LessonDetails[] until backend provides LessonSummary structure for courses
      lessons: LessonDetails[]; 
  }
  ```
- **`LessonDetails`** (Interface Updated):
  ```typescript
  export interface LessonDetails {
      lesson_id: UUID;
      name: string;
      description: string;
      lesson_type: LessonType; // 'learn', 'practice', 'test'
      estimated_duration: number; // in minutes
      next_lesson_id?: string; // Optional ID of the next lesson
      // video_url?: string; // Retained if used by ASLCharacterContext for tutorial videos
  }
  ```

### In `site/models/progress.ts`:
- **`completeLessonProgress`** (New Model Function):
  - Added function to mark lesson progress as complete via a `POST` request to `/progress/{progress_id}/complete`.
  - `async (progress_id: string): Promise<void>`

### In `site/src/app/detecting-mode/page.tsx` (Local Type):
- **`DrawingUtils`** (Interface for refs, specific to this component):
  ```typescript
  interface DrawingUtils {
    drawConnectors: typeof drawConnectors;
    drawLandmarks: typeof drawLandmarks;
  }
  ```
  (Note: `drawConnectors` and `drawLandmarks` are from `@mediapipe/drawing_utils`)

## Key API Endpoints Interacted With (Frontend Perspective)

- **User:**
    - `GET /user/{user_id}` (Modified to accept body)
- **Courses & Lessons:**
    - `GET /courses`
    - `GET /course/{course_id}`
    - `GET /lesson/{lesson_id}/details`
    - `GET /lesson/{lesson_id}/questions` (Modified to accept body)
- **Progress & Answers:**
    - `GET /course/progress` (user_id in body)
    - `GET /lesson/recent_progress` (user_id, lesson_id in body)
    - `GET /lesson/progress` (progress_id in body)
    - `POST /answer/submit` (to submit individual answers)
    - `POST /progress/{progress_id}/complete` (to mark a test lesson as complete)

---
This summary reflects the state after recent development efforts.

