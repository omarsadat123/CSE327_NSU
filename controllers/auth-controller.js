// controllers/auth-controller.js
const authModel = require('../models/auth');

module.exports = {
  showLoginPage(req, res) {
    // If already logged in, go straight to dashboard
    if (req.session.userId) {
      return res.redirect('/dashboard');
    }
    res.render('login', { message: null });
  },

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await authModel.findUserByEmailAndPassword(email, password);

      if (user) {
        // Store both uid and name/email for convenience in views
        req.session.userId = user.uid;
        req.session.user = {
          uid: user.uid,
          name: user.name,
          email: user.email
        };

        // Redirect to dashboard after login
        return res.redirect('/dashboard');
      } else {
        return res.render('login', { message: 'Invalid email or password.' });
      }
    } catch (error) {
      console.error(error);
      return res.render('login', { message: 'An error occurred. Please try again.' });
    }
  },

  logout(req, res) {
    req.session.destroy(err => {
      if (err) {
        console.error('Logout error:', err);
        return res.redirect('/dashboard');
      }
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  }
};
