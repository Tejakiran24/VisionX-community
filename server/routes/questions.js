const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const auth = require('../middleware/auth');

// @route   POST api/questions
// @desc    Create a question
// @access  Private
router.post('/', auth, questionController.createQuestion);

// @route   GET api/questions
// @desc    Get all questions
// @access  Public
router.get('/', questionController.getAllQuestions);

// @route   GET api/questions/:id
// @desc    Get question by ID
// @access  Public
router.get('/:id', questionController.getQuestionById);

// @route   POST api/questions/:id/answers
// @desc    Add an answer to question
// @access  Private
router.post('/:id/answers', auth, questionController.addAnswer);

// @route   PUT api/questions/:id/upvote
// @desc    Upvote a question
// @access  Private
router.put('/:id/upvote', auth, questionController.upvoteQuestion);

module.exports = router;
