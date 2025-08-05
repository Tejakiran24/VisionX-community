// Get db instance from server
const db = require('../server').db;

// Helper function to find question by id
const findQuestionById = (id) => {
  return db.questions.find(q => q.id === id);
};

exports.createQuestion = (req, res) => {
  try {
    const { title, body, tags } = req.body;
    
    // Create new question
    const question = {
      id: String(db.questions.length + 1),
      title,
      body,
      tags: tags || [],
      userId: req.userId,
      createdAt: new Date().toISOString(),
      upvotes: [],
      views: 0,
      answers: []
    };

    // Add to our in-memory database
    db.questions.push(question);

    // Update user points
    const user = db.users.find(u => u.id === req.userId);
    if (user) {
      user.points = (user.points || 0) + 5;
    }

    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllQuestions = (req, res) => {
  try {
    // Sort questions by creation date, newest first
    const questions = [...db.questions].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    // Add user info to questions
    const questionsWithUsers = questions.map(q => ({
      ...q,
      user: db.users.find(u => u.id === q.userId)
    }));
    
    res.json(questionsWithUsers);
  } catch (err) {
    console.error('Get questions error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getQuestionById = (req, res) => {
  try {
    const question = findQuestionById(req.params.id);
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    // Increment views
    question.views += 1;

    // Add user info
    const questionWithUser = {
      ...question,
      user: db.users.find(u => u.id === question.userId),
      answers: question.answers.map(a => ({
        ...a,
        user: db.users.find(u => u.id === a.userId)
      }))
    };

    res.json(questionWithUser);
  } catch (err) {
    console.error('Get question error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.addAnswer = (req, res) => {
  try {
    const question = findQuestionById(req.params.id);
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    const answer = {
      id: String(question.answers.length + 1),
      body: req.body.body,
      userId: req.userId,
      createdAt: new Date().toISOString(),
      upvotes: []
    };

    // Add answer to question
    question.answers.unshift(answer);

    // Add points to user for answering
    const user = db.users.find(u => u.id === req.userId);
    if (user) {
      user.points = (user.points || 0) + 10;
    }

    // Add user info to the answer
    const answerWithUser = {
      ...answer,
      user: db.users.find(u => u.id === answer.userId)
    };

    res.json(answerWithUser);
  } catch (err) {
    console.error('Add answer error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.upvoteQuestion = (req, res) => {
  try {
    const question = findQuestionById(req.params.id);
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    // Check if user already upvoted
    if (question.upvotes.includes(req.userId)) {
      // Remove upvote
      question.upvotes = question.upvotes.filter(id => id !== req.userId);
    } else {
      // Add upvote
      question.upvotes.push(req.userId);

      // Add points to question author
      const author = db.users.find(u => u.id === question.userId);
      if (author) {
        author.points = (author.points || 0) + 2;
      }
    }

    res.json(question);
  } catch (err) {
    console.error('Upvote question error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
