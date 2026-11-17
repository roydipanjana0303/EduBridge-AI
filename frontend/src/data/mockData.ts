import { NoteItem, MentorProfile, VoiceRoom, StudyGroup, QAItem, QuizQuestion, RewardItem } from '../types';

export const INITIAL_NOTES: NoteItem[] = [
  { id: '1', title: 'Newton’s Laws of Motion & Friction', subject: 'Physics', date: 'Mar 2024', isOffline: true, fileSize: '2.4 MB' },
  { id: '2', title: 'Calculus: Integration Cheat Sheet & Formulae', subject: 'Maths', date: 'Jan 2024', isOffline: true, fileSize: '1.8 MB' },
  { id: '3', title: 'Organic Chemistry: Reaction Mechanisms Map', subject: 'Chemistry', date: 'Nov 2023', isOffline: false, fileSize: '4.1 MB' },
  { id: '4', title: 'Cell Division: Mitosis & Meiosis Diagrams', subject: 'Biology', date: 'Aug 2023', isOffline: false, fileSize: '3.2 MB' },
  { id: '5', title: 'Python Loops, Data Structures & DSA Basics', subject: 'CS', date: 'Jun 2023', isOffline: true, fileSize: '1.1 MB' },
  { id: '6', title: 'Thermodynamics & Heat Engine Cycles', subject: 'Physics', date: 'May 2023', isOffline: false, fileSize: '2.9 MB' },
];

export const INITIAL_MENTORS: MentorProfile[] = [
  {
    id: 'm1',
    name: 'Meera Ma’am',
    subject: 'Physics',
    avatarColor: '#B9E4E8',
    status: 'Online',
    messages: [
      { id: '1', sender: 'them', text: 'Hi Aarav! Share your physics doubts anytime, I review them every evening.' },
      { id: '2', sender: 'me', text: 'Thank you Ma’am! Reviewing friction right now.' },
      { id: '3', sender: 'them', text: 'Remember: static friction adjusts up to a maximum threshold (μ_s * N).' }
    ]
  },
  {
    id: 'm2',
    name: 'Rohan Sir',
    subject: 'Maths',
    avatarColor: '#9ED5DC',
    status: 'Away',
    messages: [
      { id: '1', sender: 'them', text: 'Try the substitution method first before partial fractions.' },
      { id: '2', sender: 'me', text: 'Understood, applying u = sin(x) now.' }
    ]
  },
  {
    id: 'm3',
    name: 'Divya Di',
    subject: 'CS',
    avatarColor: '#D3EEF1',
    status: 'In Voice Room',
    messages: [
      { id: '1', sender: 'them', text: 'Ready for the code review? Send your recursion code over!' }
    ]
  }
];

export const INITIAL_VOICE_ROOMS: VoiceRoom[] = [
  { id: 'v1', name: 'Physics Doubt Den', participants: ['M', 'K', 'S', 'R'], isLive: true, topic: 'Forces & Free Body Diagrams' },
  { id: 'v2', name: 'Maths Silent Grind', participants: ['A', 'D'], isLive: true, topic: 'Calculus Practice Set' },
  { id: 'v3', name: 'CS Late-Night Debug', participants: ['V', 'P', 'N'], isLive: true, topic: 'Binary Search Trees & LeetCode' },
  { id: 'v4', name: 'Chemistry Chai Chat', participants: [], isLive: false, topic: 'Periodic Table Revision' },
];

export const INITIAL_STUDY_GROUPS: StudyGroup[] = [
  { id: 'g1', name: 'Class 12 Boards Squad', members: 48, isJoined: true, category: 'Academic' },
  { id: 'g2', name: 'JEE / NEET Warriors', members: 120, isJoined: false, category: 'Competitive' },
  { id: 'g3', name: 'Coding & Algorithmic Thinkers', members: 36, isJoined: false, category: 'Tech' },
  { id: 'g4', name: 'STEM Research & Innovations', members: 54, isJoined: true, category: 'Research' },
];

export const INITIAL_QA: QAItem[] = [
  {
    id: 'q1',
    question: 'Why does a bigger pulley system require less applied force to lift heavy loads?',
    askedBy: 'Kavya Sharma',
    answer: 'A multi-pulley system distributes the load over multiple supporting rope sections. Each section supports a fraction of the total weight, effectively giving a mechanical advantage equal to the number of rope segments.',
    answeredBy: 'Meera Ma’am (Physics Mentor)',
    upvotes: 14,
    time: '2 hours ago'
  },
  {
    id: 'q2',
    question: 'What is the intuitive difference between Mean and Median when data has outliers?',
    askedBy: 'Sana Patel',
    answer: 'The mean is the arithmetic balance point pulled heavily by extreme outliers (like billionaire incomes). The median is the physical middle value and remains robust against outliers.',
    answeredBy: 'Rohan Sir (Maths Mentor)',
    upvotes: 8,
    time: '4 hours ago'
  },
  {
    id: 'q3',
    question: 'Why does Python list comprehension run faster than traditional append loops?',
    askedBy: 'Rahul Verma',
    answer: '',
    upvotes: 5,
    time: 'Just now'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'qz1',
    question: 'Which law of physics is mathematically formulated as F = m * a?',
    options: ['Newton’s First Law', 'Newton’s Second Law', 'Newton’s Third Law', 'Law of Universal Gravitation'],
    correctAnswer: 1,
    explanation: 'Newton’s Second Law states that force equals mass times acceleration (rate of change of momentum).'
  },
  {
    id: 'qz2',
    question: 'What is the derivative of f(x) = x² with respect to x?',
    options: ['x', '2x', 'x²/2', '2x²'],
    correctAnswer: 1,
    explanation: 'Using the power rule: d/dx(x^n) = n * x^(n-1). For x², 2 * x^(2-1) = 2x.'
  },
  {
    id: 'qz3',
    question: 'Which keyword is used to initiate a definite loop over an iterable in Python?',
    options: ['iterate', 'loop', 'for', 'repeat'],
    correctAnswer: 2,
    explanation: 'In Python, the "for" keyword is used to iterate over sequence structures like lists, tuples, or ranges.'
  },
  {
    id: 'qz4',
    question: 'Which organelle is considered the powerhouse of eukaryotic cells?',
    options: ['Ribosome', 'Mitochondria', 'Golgi apparatus', 'Endoplasmic reticulum'],
    correctAnswer: 1,
    explanation: 'Mitochondria produce the majority of the cell’s supply of adenosine triphosphate (ATP), used as a chemical energy source.'
  }
];

export const CAREER_ROADMAPS: Record<string, string[]> = {
  Tech: [
    'Master Python & Core Data Structures and Algorithms (Arrays, Linked Lists, Trees, Graphs)',
    'Build 3 full-stack end-to-end web projects using React and modern APIs',
    'Contribute to open-source software and collaborate using Git version control',
    'Land a summer internship and gain production deployment experience',
    'Specialise in High-Growth Areas: Applied AI / Machine Learning, Cloud DevOps, or Cybersecurity'
  ],
  Medicine: [
    'Master NCERT Biology, Organic Chemistry, and foundational Physics',
    'Target top scores in NEET / MCAT with timed mock test simulations',
    'Gain hospital volunteering and shadow clinical specialists',
    'Complete medical school pre-clinical coursework and clinical rotations',
    'Match into residency program and prepare for specialized board certification'
  ],
  Design: [
    'Master visual design fundamentals, typography, and colour theory principles',
    'Design 5 comprehensive case studies addressing real user problems in Figma',
    'Conduct usability testing sessions and build interactive high-fidelity prototypes',
    'Freelance or intern at a product-led design agency',
    'Develop a distinct signature aesthetic and lead design systems at scale'
  ],
  Business: [
    'Develop strong acumen in microeconomics, financial accounting, and quantitative methods',
    'Launch a student-led venture or manage a community non-profit initiative',
    'Prepare for entrance benchmarks (CUET / CAT / GMAT) and master case studies',
    'Intern at high-growth startups in product management or strategic consulting',
    'Scale an enterprise, raise growth capital, or pursue executive leadership'
  ]
};

export const REWARD_ITEMS: RewardItem[] = [
  { id: 'r1', title: '1-on-1 Mentor Strategy Session (60 mins)', creditsCost: 300, description: 'Direct personalized academic advice and career plan review with top mentors.' },
  { id: 'r2', title: 'Curated Premium JEE/NEET Revision Pack', creditsCost: 150, description: 'High-yield hand-drawn formula sheets, summary mindmaps, and solved questions.' },
  { id: 'r3', title: 'EduBridge Official Holographic Sticker Kit', creditsCost: 100, description: 'Exclusive laptop and notebook stickers delivered to your doorstep.' },
  { id: 'r4', title: 'Verified Badge: "Quiz Master & Contributor"', creditsCost: 50, description: 'Special visual badge displayed beside your name across forum and leaderboards.' }
];
