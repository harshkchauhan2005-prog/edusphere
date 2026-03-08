# 08. Scoring Engine Specifications

## 1. Overview
The EduSphere scoring engine is responsible for automatically evaluating student submissions for Multiple Choice Question (MCQ) quizzes. Since the MVP explicitly rules out descriptive quizzes and manual grading workflows, the scoring engine operates instantly upon submission.

## 2. Quiz Configuration
When a Faculty member creates a quiz, the payload defines the structure:
- `isTimed` (boolean): Defines if the quiz auto-submits.
- `durationInMinutes` (number): The allocated time.
- `questions` (array of objects):
  - `questionText`: The actual question.
  - `options`: An array of possible answers (e.g., `["A", "B", "C", "D"]`).
  - `correctOptionIndex`: An integer (e.g., `2` indicating option "C") pointing to the correct answer.

## 3. Submission Protocol
When a Student completes a quiz, the client sends an array of selected indices back to the server.
- **Payload Structure:** `{ "answers": [0, 2, 1, 3] }`  
  *(Index corresponds sequentially to the questions array defined in the quiz).*

### Timed Quiz Handling
- For timed quizzes, the client-side React app enforces the timer and triggers an auto-submit when time expires.
- **Server Validation:** (Optional enhancement) The backend can store the start time of the attempt and validate if the submission timestamp loosely aligns with the `durationInMinutes` (with a slight grace period for latency).

## 4. Evaluation Algorithm
The backend `Quiz Evaluation Service` processes the array:
```javascript
let score = 0;
const totalQuestions = quiz.questions.length;

quiz.questions.forEach((question, index) => {
  const studentAnswerIndex = submission.answers[index];
  
  // If the student answered and it matches the correct index
  if (studentAnswerIndex !== undefined && studentAnswerIndex === question.correctOptionIndex) {
    score += 1;
  }
});
```

## 5. Result Storage & Return
After calculation:
1. The integer score is saved to the `results` array within the specific `Quiz` document alongside the `studentId`.
2. The server responds with the evaluated score:
   - Example UI response: `"You scored 4 out of 5!"`
3. Subsequent requests for the quiz by the student will yield the completed status and their stored score instead of allowing a retake (unless retakes are explicitly configured, though MVP currently dictates a simple take-and-view flow). 
