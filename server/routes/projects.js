const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');

// @route   POST api/projects
// @desc    Create a project
// @access  Private
router.post('/', auth, projectController.createProject);

// @route   GET api/projects
// @desc    Get all projects
// @access  Public
router.get('/', projectController.getAllProjects);

// @route   GET api/projects/:id
// @desc    Get project by ID
// @access  Public
router.get('/:id', projectController.getProjectById);

// @route   POST api/projects/:id/comments
// @desc    Add a comment to project
// @access  Private
router.post('/:id/comments', auth, projectController.addComment);

// @route   PUT api/projects/:id/like
// @desc    Like a project
// @access  Private
router.put('/:id/like', auth, projectController.likeProject);

module.exports = router;
