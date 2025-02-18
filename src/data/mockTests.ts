import type { MockTest, LearningResource } from '../types/test';

export const mockTests: Record<string, MockTest[]> = {
  'software-engineer': [
    {
      id: 'se-test-1',
      careerId: 'software-engineer',
      title: 'Software Engineering Fundamentals',
      description: 'Test your knowledge of basic software engineering concepts',
      questions: [
        {
          id: 'se-q1',
          text: 'What is encapsulation in object-oriented programming?',
          options: [
            'Bundling data and methods that operate on that data within a single unit',
            'Converting data from one type to another',
            'Breaking down a program into smaller components',
            'Hiding implementation details from the user'
          ],
          correctAnswer: 'Bundling data and methods that operate on that data within a single unit',
          explanation: 'Encapsulation is a fundamental principle of OOP that bundles data and the methods that operate on that data within a single unit or object, preventing unauthorized access to data.'
        },
        {
          id: 'se-q2',
          text: 'Which of the following is NOT a common software development methodology?',
          options: [
            'Waterfall',
            'Agile',
            'Circular Development',
            'Scrum'
          ],
          correctAnswer: 'Circular Development',
          explanation: 'Circular Development is not a real methodology. Common methodologies include Waterfall, Agile, Scrum, and Kanban.'
        },
        {
          id: 'se-q3',
          text: 'What is version control?',
          options: [
            'A system that records changes to files over time',
            'A method to control software versions in production',
            'A way to version APIs',
            'A technique to manage database versions'
          ],
          correctAnswer: 'A system that records changes to files over time',
          explanation: 'Version control systems like Git track changes to files over time, allowing you to recall specific versions later.'
        },
        {
          id: 'se-q4',
          text: 'What is the primary purpose of unit testing?',
          options: [
            'To test individual components or functions',
            'To test the entire application',
            'To test user interfaces',
            'To test database connections'
          ],
          correctAnswer: 'To test individual components or functions',
          explanation: 'Unit testing is used to verify that individual components or functions of a program work as expected in isolation.'
        },
        {
          id: 'se-q5',
          text: 'What does API stand for?',
          options: [
            'Application Programming Interface',
            'Advanced Programming Integration',
            'Automated Program Interface',
            'Application Process Integration'
          ],
          correctAnswer: 'Application Programming Interface',
          explanation: 'API (Application Programming Interface) defines how different software components should interact.'
        }
      ]
    }
  ],
  'data-scientist': [
    {
      id: 'ds-test-1',
      careerId: 'data-scientist',
      title: 'Data Science Fundamentals',
      description: 'Test your understanding of data science concepts',
      questions: [
        {
          id: 'ds-q1',
          text: 'What is the difference between supervised and unsupervised learning?',
          options: [
            'Supervised learning uses labeled data, unsupervised learning uses unlabeled data',
            'Supervised learning is faster than unsupervised learning',
            'Supervised learning requires more data than unsupervised learning',
            'There is no difference'
          ],
          correctAnswer: 'Supervised learning uses labeled data, unsupervised learning uses unlabeled data',
          explanation: 'Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in unlabeled data.'
        },
        {
          id: 'ds-q2',
          text: 'Which of the following is NOT a type of machine learning algorithm?',
          options: [
            'Reinforcement Learning',
            'Supervised Learning',
            'Dynamic Learning',
            'Unsupervised Learning'
          ],
          correctAnswer: 'Dynamic Learning',
          explanation: 'Dynamic Learning is not a type of machine learning. The main types are Supervised, Unsupervised, and Reinforcement Learning.'
        },
        {
          id: 'ds-q3',
          text: 'What is the purpose of data normalization?',
          options: [
            'To scale features to a similar range',
            'To remove duplicate data',
            'To convert data types',
            'To compress data'
          ],
          correctAnswer: 'To scale features to a similar range',
          explanation: 'Data normalization scales features to a similar range to prevent features with larger scales from dominating the learning process.'
        },
        {
          id: 'ds-q4',
          text: 'What is a confusion matrix used for?',
          options: [
            'Evaluating classification model performance',
            'Visualizing data distributions',
            'Calculating correlation between variables',
            'Preprocessing data'
          ],
          correctAnswer: 'Evaluating classification model performance',
          explanation: 'A confusion matrix shows the performance of a classification model by displaying true positives, false positives, true negatives, and false negatives.'
        },
        {
          id: 'ds-q5',
          text: 'What is the purpose of cross-validation?',
          options: [
            'To assess model performance on different subsets of data',
            'To validate data types',
            'To check data consistency',
            'To improve model speed'
          ],
          correctAnswer: 'To assess model performance on different subsets of data',
          explanation: 'Cross-validation helps assess how well a model will generalize to new data by testing it on different subsets of the training data.'
        }
      ]
    }
  ]
};

export const learningResources: Record<string, LearningResource[]> = {
  'software-engineer': [
    {
      id: 'se-resource-1',
      careerId: 'software-engineer',
      title: 'Introduction to Software Engineering',
      type: 'course',
      url: 'https://www.coursera.org/learn/software-engineering',
      duration: '6 weeks',
      provider: 'Coursera',
      description: 'Learn the fundamentals of software engineering, including design patterns, testing, and best practices.'
    },
    {
      id: 'se-resource-2',
      careerId: 'software-engineer',
      title: 'Clean Code: Writing Code for Humans',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=7EmboKQH8lM',
      duration: '45 minutes',
      provider: 'YouTube',
      description: 'Learn how to write clean, maintainable code that other developers can easily understand.'
    }
  ],
  'data-scientist': [
    {
      id: 'ds-resource-1',
      careerId: 'data-scientist',
      title: 'Data Science Fundamentals',
      type: 'course',
      url: 'https://www.coursera.org/specializations/data-science-fundamentals',
      duration: '3 months',
      provider: 'Coursera',
      description: 'Master the basics of data science including statistics, machine learning, and data visualization.'
    },
    {
      id: 'ds-resource-2',
      careerId: 'data-scientist',
      title: 'Python for Data Science',
      type: 'course',
      url: 'https://www.edx.org/learn/python/python-for-data-science',
      duration: '4 weeks',
      provider: 'edX',
      description: 'Learn Python programming specifically for data science applications.'
    }
  ]
};