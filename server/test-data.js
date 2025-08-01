const mongoose = require('mongoose');
const User = require('./models/User');
const Question = require('./models/Question');
const Project = require('./models/Project');

mongoose.connect('mongodb://localhost:27017/visionx-community');

const testUsers = [
  {
    name: 'Ravi Kumar',
    email: 'ravi@aits.edu',
    password: 'password123',
    bio: 'Web development student at AITS',
    skills: ['HTML', 'CSS', 'React'],
    role: 'beginner',
    points: 10,
    badges: [{
      name: 'First Post',
      earnedAt: new Date()
    }]
  },
  {
    name: 'Priya S',
    email: 'priya@aits.edu',
    password: 'priya123',
    bio: 'CSE student at AITS',
    skills: ['Python', 'JavaScript'],
    role: 'beginner',
    points: 25
  },
  {
    name: 'Krishna T',
    email: 'krishna@aits.edu',
    password: 'krishna123',
    bio: 'CSE student interested in web development',
    skills: ['Java', 'MongoDB'],
    role: 'beginner',
    points: 15
  }
];

const testQuestions = [
  {
    title: 'CSS Flexbox Centering Issue',
    body: 'Having trouble centering elements with CSS flexbox. The margin:auto approach is not working as expected.',
    tags: ['CSS', 'HTML', 'flexbox'],
    author: null,
    upvotes: [],
    views: 12,
    answers: []
  },
  {
    title: 'Understanding React useState Hook',
    body: 'Need clarification on the useState hook in React and its implementation in functional components.',
    tags: ['React', 'JavaScript', 'Hooks'],
    views: 8,
    answers: []
  },
  {
    title: 'MongoDB Connection Issue',
    body: 'Encountering connection errors with MongoDB local instance. Connection string appears correct but getting timeout errors.',
    tags: ['MongoDB', 'Database', 'NodeJS'],
    views: 15,
    answers: []
  }
];

const testProjects = [
  {
    title: 'JavaScript Calculator',
    description: 'Basic calculator implementation using HTML, CSS, and JavaScript',
    githubLink: 'https://github.com/ravi/calculator',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    likes: []
  },
  {
    title: 'React Todo Application',
    description: 'Task management application built with React and CSS',
    githubLink: 'https://github.com/priya/todo-app',
    techStack: ['React', 'CSS'],
    likes: []
  },
  {
    title: 'Department Timetable Manager',
    description: 'Web application for managing CSE department timetables',
    githubLink: 'https://github.com/krishna/timetable',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    likes: []
  }
];

async function addTestData() {
  try {
    await User.deleteMany({});
    await Question.deleteMany({});
    await Project.deleteMany({});
    
    const users = await User.create(testUsers);

    // Add questions with real user IDs
    const questions = testQuestions.map((q, i) => ({
      ...q,
      author: users[i % users.length]._id
    }));
    await Question.create(questions);
    console.log('Added test questions!');

    // Add projects with real user IDs
    const projects = testProjects.map((p, i) => ({
      ...p,
      author: users[i % users.length]._id
    }));
    await Project.create(projects);
    console.log('Added test projects!');

    console.log('Yay! All test data added successfully! 🎉');
  } catch (err) {
    console.error('Oops, something went wrong:', err);
  } finally {
    mongoose.disconnect();
  }
}

// Run the function
console.log('Starting to add test data...');
addTestData();
