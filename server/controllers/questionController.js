const Question = require('../models/Question');
const User = require('../models/User');

exports.createQuestion = async (req, res) => {
  try {
    console.log('📝 Creating new question:', req.body);
    
    const { title, description, tags, nickname } = req.body;
    
    if (!title || !description) {
      console.error('❌ Missing required fields:', { title: !!title, description: !!description });
      return res.status(400).json({ msg: 'Title and description are required' });
    }

    const question = new Question({
      title: title.trim(),
      description: description.trim(),
      tags: Array.isArray(tags) ? tags.map(tag => tag.trim()).filter(Boolean) : ['general'],
      nickname: nickname?.trim() || 'Anonymous',
      // author is optional now, only set if user is authenticated
      ...(req.user?.id && { author: req.user.id })
    });

    console.log('💾 Saving question to database:', {
      title: question.title,
      author: question.author
    });
    
    await question.save();
    
    // Add points to user for asking a question
    console.log('🎯 Adding points to user:', req.user.id);
    await User.findByIdAndUpdate(req.user.id, { $inc: { points: 5 } });
    
    console.log('✅ Question created successfully:', question._id);
    res.json(question);
  } catch (err) {
    console.error('❌ Create question error:', {
      message: err.message,
      stack: err.stack,
      user: req.user
    });
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    console.log('📝 Fetching all questions...');
    const questions = await Question.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar');
    console.log(`✅ Found ${questions.length} questions`);
    res.json(questions);
  } catch (err) {
    console.error('❌ Get questions error:', {
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('answers.author', 'name avatar');
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }
    // Increment views
    question.views += 1;
    await question.save();
    res.json(question);
  } catch (err) {
    console.error('Get question error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.addAnswer = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }
    const answer = {
      body: req.body.body,
      author: req.user.id
    };
    question.answers.unshift(answer);
    await question.save();
    // Add points to user for answering
    await User.findByIdAndUpdate(req.user.id, { $inc: { points: 10 } });
    res.json(question.answers);
  } catch (err) {
    console.error('Add answer error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.upvoteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }
    // Check if user already upvoted
    const userId = req.user.id;
    const index = question.upvotes.indexOf(userId);
    if (index > -1) {
      // Remove upvote
      question.upvotes.splice(index, 1);
    } else {
      // Add upvote
      question.upvotes.push(userId);
      // Add points to question author
      await User.findByIdAndUpdate(question.author, { $inc: { points: 2 } });
    }
    await question.save();
    res.json(question);
  } catch (err) {
    console.error('Upvote question error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
