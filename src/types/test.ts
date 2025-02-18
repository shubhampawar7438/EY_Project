export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface MockTest {
  id: string;
  careerId: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface TestResult {
  id: string;
  userId: string;
  testId: string;
  careerId: string;
  score: number;
  answers: Record<string, string>;
  completedAt: string;
}

export interface LearningResource {
  id: string;
  careerId: string;
  title: string;
  type: 'video' | 'article' | 'course';
  url: string;
  duration: string;
  provider: string;
  description: string;
}