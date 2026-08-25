export const defaultUsers = [
  { id: 'admin_001', name: 'Quiz Administrator', email: 'admin@quiz.com', password: 'admin123', role: 'admin' },
  { id: 'user_001', name: 'Bharath Kumar', email: 'student@quiz.com', password: 'student123', role: 'student' },
  { id: 'user_002', name: 'Arun Sharma', email: 'arun@quiz.com', password: 'arun123', role: 'student' },
  { id: 'user_003', name: 'Priya Patel', email: 'priya@quiz.com', password: 'priya123', role: 'student' },
];

const mkQ = (id, text, options, correctAnswer, marks, explanation) => ({
  id, text, options, correctAnswer, marks: marks || 2, explanation: explanation || '',
});

export const defaultQuizzes = [
  {
    id: 'quiz_001', title: 'Java Programming', description: 'Master Java fundamentals and object-oriented concepts',
    subject: 'Java', difficulty: 'Medium', duration: 30, totalMarks: 20, passingPercentage: 50, published: true,
    questions: [
      mkQ('q1', 'Which keyword is used to inherit a class in Java?', ['implements', 'extends', 'inherits', 'super'], 'extends', 2, 'The extends keyword is used for class inheritance in Java.'),
      mkQ('q2', 'What does JVM stand for?', ['Java Variable Machine', 'Java Virtual Machine', 'Java Verified Machine', 'Java Visual Machine'], 'Java Virtual Machine', 2, 'JVM stands for Java Virtual Machine.'),
      mkQ('q3', 'Which of the following is not an OOP principle?', ['Encapsulation', 'Inheritance', 'Compilation', 'Polymorphism'], 'Compilation', 2, 'The four OOP principles are Encapsulation, Inheritance, Polymorphism, and Abstraction.'),
      mkQ('q4', 'Which keyword is used to implement an interface?', ['extends', 'implements', 'interface', 'abstract'], 'implements', 2, 'The implements keyword is used to implement an interface in Java.'),
      mkQ('q5', 'What is the default access modifier in Java?', ['public', 'private', 'protected', 'package-private'], 'package-private', 2, 'When no modifier is specified, the default is package-private.'),
      mkQ('q6', 'Which collection allows duplicate elements?', ['Set', 'HashSet', 'List', 'TreeSet'], 'List', 2, 'List interface allows duplicate elements.'),
      mkQ('q7', 'What is the size of int in Java?', ['2 bytes', '4 bytes', '8 bytes', 'Depends on platform'], '4 bytes', 2, 'In Java, int is always 4 bytes (32 bits).'),
      mkQ('q8', 'Which method is called when an object is created?', ['main', 'constructor', 'init', 'create'], 'constructor', 2, 'A constructor is called automatically when an object is instantiated.'),
      mkQ('q9', 'Which keyword prevents method overriding?', ['static', 'final', 'private', 'abstract'], 'final', 2, 'The final keyword prevents method overriding.'),
      mkQ('q10', 'What is autoboxing in Java?', ['Converting primitive to wrapper class', 'Converting wrapper to primitive', 'Creating automatic boxes', 'Automatic memory allocation'], 'Converting primitive to wrapper class', 2, 'Autoboxing converts primitive types to wrapper classes automatically.'),
    ],
  },
  {
    id: 'quiz_002', title: 'Python Fundamentals', description: 'Test your knowledge of Python basics and core concepts',
    subject: 'Python', difficulty: 'Easy', duration: 25, totalMarks: 20, passingPercentage: 50, published: true,
    questions: [
      mkQ('q1', 'What is the correct file extension for Python files?', ['.python', '.py', '.pt', '.pyt'], '.py', 2, 'Python files use the .py extension.'),
      mkQ('q2', 'How do you create a variable with the numeric value 5?', ['x = 5', 'x := 5', 'int x = 5', 'var x = 5'], 'x = 5', 2, 'Python uses dynamic typing with =.'),
      mkQ('q3', 'What is the correct way to create a function in Python?', ['function myFunc():', 'def myFunc():', 'create myFunc():', 'func myFunc():'], 'def myFunc():', 2, 'Python uses the def keyword to define functions.'),
      mkQ('q4', 'Which of these is not a Python data type?', ['list', 'tuple', 'array', 'dict'], 'array', 2, 'Python has list, tuple, dict, and set, but not a built-in array type.'),
      mkQ('q5', 'What does the len() function do?', ['Returns the length', 'Returns the last item', 'Returns the largest', 'Returns the lowest'], 'Returns the length', 2, 'len() returns the number of items in an object.'),
      mkQ('q6', 'How do you start a for loop in Python?', ['for(i=0; i<10; i++)', 'for i in range(10):', 'foreach i in 10:', 'loop i from 0 to 10'], 'for i in range(10):', 2, 'Python for loops use "for x in" syntax.'),
      mkQ('q7', 'What is the output of 2 ** 3 in Python?', ['6', '8', '23', 'Error'], '8', 2, 'The ** operator performs exponentiation: 2^3 = 8.'),
      mkQ('q8', 'Which keyword is used for exception handling?', ['catch', 'except', 'handle', 'rescue'], 'except', 2, 'Python uses try/except for exception handling.'),
      mkQ('q9', 'What is a dictionary in Python?', ['A list of numbers', 'Key-value pairs', 'A sequence of characters', 'A set of tuples'], 'Key-value pairs', 2, 'A dictionary stores data as key-value pairs.'),
      mkQ('q10', 'What does pip stand for?', ['Python Install Package', 'Preferred Installer Program', 'Python Package', 'Package Installer for Python'], 'Preferred Installer Program', 2, 'pip stands for Preferred Installer Program.'),
    ],
  },
  {
    id: 'quiz_003', title: 'Data Structures', description: 'Test your understanding of fundamental data structures',
    subject: 'DSA', difficulty: 'Hard', duration: 35, totalMarks: 20, passingPercentage: 50, published: true,
    questions: [
      mkQ('q1', 'What is the time complexity of binary search?', ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], 'O(log n)', 2, 'Binary search halves the search space each step.'),
      mkQ('q2', 'Which data structure uses LIFO order?', ['Queue', 'Stack', 'Tree', 'Graph'], 'Stack', 2, 'A stack follows Last-In-First-Out order.'),
      mkQ('q3', 'What is the time complexity of inserting at the beginning of an array?', ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], 'O(n)', 2, 'Inserting at the beginning requires shifting all elements.'),
      mkQ('q4', 'Which data structure is best for implementing a priority queue?', ['Array', 'Linked List', 'Heap', 'Stack'], 'Heap', 2, 'A heap provides O(log n) insertion and O(1) access to min/max.'),
      mkQ('q5', 'What is the height of a balanced binary tree with n nodes?', ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'], 'O(log n)', 2, 'A balanced binary tree has height O(log n).'),
      mkQ('q6', 'Which traversal visits root, left, then right?', ['Inorder', 'Preorder', 'Postorder', 'Level order'], 'Preorder', 2, 'Preorder traversal visits root then left then right.'),
      mkQ('q7', 'What is a hash table?', ['A sorted array', 'A key-value structure using hashing', 'A type of tree', 'A linked list variant'], 'A key-value structure using hashing', 2, 'A hash table maps keys to values using a hash function.'),
      mkQ('q8', 'What is the space complexity of a recursive factorial function?', ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], 'O(n)', 2, 'Recursion depth is n, so space complexity is O(n).'),
      mkQ('q9', 'Which is not a graph traversal algorithm?', ['BFS', 'DFS', 'Dijkstra', 'BST'], 'BST', 2, 'BST stands for Binary Search Tree, not a traversal algorithm.'),
      mkQ('q10', 'What is the best case for quicksort?', ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], 'O(n log n)', 2, 'Quicksort runs in O(n log n) in the best and average case.'),
    ],
  },
  {
    id: 'quiz_004', title: 'Database Management', description: 'Test your knowledge of SQL and database concepts',
    subject: 'Database', difficulty: 'Medium', duration: 30, totalMarks: 20, passingPercentage: 50, published: true,
    questions: [
      mkQ('q1', 'What does SQL stand for?', ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'System Query Language'], 'Structured Query Language', 2, 'SQL stands for Structured Query Language.'),
      mkQ('q2', 'Which command is used to retrieve data?', ['GET', 'SELECT', 'FETCH', 'RETRIEVE'], 'SELECT', 2, 'The SELECT command retrieves data from a database.'),
      mkQ('q3', 'Which key uniquely identifies a record?', ['Foreign Key', 'Primary Key', 'Candidate Key', 'Super Key'], 'Primary Key', 2, 'A primary key uniquely identifies each record.'),
      mkQ('q4', 'What is a JOIN used for?', ['Combine rows from tables', 'Delete data', 'Create tables', 'Sort results'], 'Combine rows from tables', 2, 'JOIN combines rows from two or more tables.'),
      mkQ('q5', 'Which is not a type of SQL join?', ['INNER JOIN', 'OUTER JOIN', 'CROSS JOIN', 'SIDE JOIN'], 'SIDE JOIN', 2, 'There is no SIDE JOIN in SQL.'),
      mkQ('q6', 'What does ACID stand for in databases?', ['Atomicity, Consistency, Isolation, Durability', 'Accuracy, Consistency, Integrity, Data', 'Atomic, Consistent, Independent, Durable', 'Access, Control, Integrity, Data'], 'Atomicity, Consistency, Isolation, Durability', 2, 'ACID ensures reliable database transactions.'),
      mkQ('q7', 'Which command removes a table?', ['DELETE TABLE', 'REMOVE TABLE', 'DROP TABLE', 'DESTROY TABLE'], 'DROP TABLE', 2, 'DROP TABLE removes the entire table structure and data.'),
      mkQ('q8', 'What is normalization?', ['Organizing data to reduce redundancy', 'Making data faster to query', 'Encrypting the database', 'Compressing the database'], 'Organizing data to reduce redundancy', 2, 'Normalization organizes tables to reduce data redundancy.'),
      mkQ('q9', 'Which is a NoSQL database?', ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle'], 'MongoDB', 2, 'MongoDB is a document-based NoSQL database.'),
      mkQ('q10', 'What does a foreign key do?', ['Links two tables', 'Speeds up queries', 'Encrypts data', 'Stores images'], 'Links two tables', 2, 'A foreign key creates a relationship between two tables.'),
    ],
  },
  {
    id: 'quiz_005', title: 'Web Development', description: 'Test your knowledge of HTML, CSS, and JavaScript',
    subject: 'Web Development', difficulty: 'Easy', duration: 25, totalMarks: 20, passingPercentage: 50, published: true,
    questions: [
      mkQ('q1', 'What does HTML stand for?', ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], 'Hyper Text Markup Language', 2, 'HTML stands for Hyper Text Markup Language.'),
      mkQ('q2', 'Which tag is used for the largest heading?', ['<head>', '<h6>', '<h1>', '<heading>'], '<h1>', 2, 'The <h1> tag defines the largest heading.'),
      mkQ('q3', 'What does CSS stand for?', ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Colorful Style Sheets'], 'Cascading Style Sheets', 2, 'CSS stands for Cascading Style Sheets.'),
      mkQ('q4', 'How do you select an element with id "demo" in CSS?', ['.demo', '#demo', 'demo', '*demo'], '#demo', 2, 'The # selector targets elements by their id.'),
      mkQ('q5', 'Which is not a JavaScript framework?', ['React', 'Angular', 'Vue', 'Django'], 'Django', 2, 'Django is a Python web framework.'),
      mkQ('q6', 'What is the DOM?', ['Document Object Model', 'Data Object Model', 'Document Oriented Model', 'Digital Output Model'], 'Document Object Model', 2, 'DOM stands for Document Object Model.'),
      mkQ('q7', 'Which method adds an event listener?', ['addEventListener()', 'attachEvent()', 'onEvent()', 'listen()'], 'addEventListener()', 2, 'addEventListener() attaches an event handler.'),
      mkQ('q8', 'What does API stand for?', ['Application Programming Interface', 'Application Protocol Interface', 'Advanced Programming Interface', 'Automated Process Interface'], 'Application Programming Interface', 2, 'API stands for Application Programming Interface.'),
      mkQ('q9', 'Which HTTP method is used to submit form data?', ['GET', 'POST', 'SUBMIT', 'SEND'], 'POST', 2, 'POST is used to submit data to be processed.'),
      mkQ('q10', 'What is responsive design?', ['Design that responds to user clicks', 'Design that adapts to different screen sizes', 'Design that loads faster', 'Design that uses JavaScript'], 'Design that adapts to different screen sizes', 2, 'Responsive design ensures websites look good on all devices.'),
    ],
  },
];

export const defaultResults = [
  { id: 'result_001', studentId: 'user_001', studentName: 'Bharath Kumar', quizId: 'quiz_001', quizTitle: 'Java Programming', totalQuestions: 10, correct: 9, wrong: 1, unanswered: 0, totalMarks: 20, obtainedMarks: 18, percentage: 90, grade: 'A+', status: 'PASSED', timeTaken: 1242, date: '2026-08-18T10:30:00' },
  { id: 'result_002', studentId: 'user_001', studentName: 'Bharath Kumar', quizId: 'quiz_002', quizTitle: 'Python Fundamentals', totalQuestions: 10, correct: 8, wrong: 2, unanswered: 0, totalMarks: 20, obtainedMarks: 16, percentage: 80, grade: 'A', status: 'PASSED', timeTaken: 980, date: '2026-08-20T14:15:00' },
  { id: 'result_003', studentId: 'user_001', studentName: 'Bharath Kumar', quizId: 'quiz_005', quizTitle: 'Web Development', totalQuestions: 10, correct: 10, wrong: 0, unanswered: 0, totalMarks: 20, obtainedMarks: 20, percentage: 100, grade: 'A+', status: 'PASSED', timeTaken: 720, date: '2026-08-22T09:00:00' },
  { id: 'result_004', studentId: 'user_002', studentName: 'Arun Sharma', quizId: 'quiz_002', quizTitle: 'Python Fundamentals', totalQuestions: 10, correct: 7, wrong: 3, unanswered: 0, totalMarks: 20, obtainedMarks: 14, percentage: 70, grade: 'B+', status: 'PASSED', timeTaken: 1100, date: '2026-08-23T11:00:00' },
  { id: 'result_005', studentId: 'user_003', studentName: 'Priya Patel', quizId: 'quiz_001', quizTitle: 'Java Programming', totalQuestions: 10, correct: 5, wrong: 4, unanswered: 1, totalMarks: 20, obtainedMarks: 10, percentage: 50, grade: 'C', status: 'PASSED', timeTaken: 1500, date: '2026-08-23T16:00:00' },
];

export const seedData = () => {
  if (!localStorage.getItem('users')) localStorage.setItem('users', JSON.stringify(defaultUsers));
  if (!localStorage.getItem('quizzes')) localStorage.setItem('quizzes', JSON.stringify(defaultQuizzes));
  if (!localStorage.getItem('results')) localStorage.setItem('results', JSON.stringify(defaultResults));
  if (!localStorage.getItem('settings')) localStorage.setItem('settings', JSON.stringify({ theme: 'light', notifications: true, autoSave: true }));
  if (!localStorage.getItem('theme')) localStorage.setItem('theme', 'light');
};
