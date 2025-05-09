const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User');
const { checkToken } = require('../middleware/authentication');
const Balance = require('../models/Balance');

const JWT_SECRET = 'secret_code';

router.post(
  '/register',
  [
    body('firstname').notEmpty().withMessage('First name is required'),
    body('lastname').notEmpty().withMessage('Last name is required'),
    body('nickname').notEmpty().withMessage('Nickname is required'),
    body('email').isEmail().withMessage('Email is not valid'),
    body('birthdate').isDate().withMessage('Birthdate must be a valid date'),
    body('gender').isIn(['male', 'female', 'other']).withMessage('Gender is required'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const {
      firstname, lastname, nickname, email,
      birthdate, gender, role, image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfyzTkEY3Uui9Tnb6aL9XX36iYGrQ_Fiy1KEn98K9ndNPXQCN5t7Tgr-7gl4szcWlhnzU&usqp=CAU',
      password
    } = req.body;

    try {
        const existingUser = await User.findByEmailOrNickname(email) || await User.findByEmailOrNickname(nickname);
        if (existingUser) {
          return res.status(409).json({ message: 'User with this email or nickname already exists' });
        }
      
        const newUser = await User.createUser({
          firstname, lastname, nickname, email,
          birthdate, gender, role, image, password
        });
      
        await Balance.createBalance(newUser.id);
      
        res.status(201).json({ message: 'User registered successfully', user: newUser });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
      }
  }
);

router.post(
  '/login',
  [
    body('nicknameOrEmail').notEmpty().withMessage('Nickname or Email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { nicknameOrEmail, password } = req.body;

    try {
      const user = await User.findByEmailOrNickname(nicknameOrEmail);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const isPasswordValid = await User.comparePassword(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

      const token = jwt.sign(
        { id: user.id, nickname: user.nickname, role: user.role },
        JWT_SECRET,
        { expiresIn: '2h' }
      );

      const { id, firstname, lastname, nickname, email, role, gender, image } = user;

      res.status(200).json({token});

    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.get('/me', checkToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      delete user.password;
      res.json(user);
    } catch (error) {
      console.error('Error getting user profile:', error);
      res.status(500).json({ error: "Server error" });
    }
  });

  router.put('/:id/update_location', checkToken, async (req, res) => {
    const { id } = req.params;
    const { country_id, region_id } = req.body;
  
    try {
      await User.updateLocation(id, country_id, region_id);
  
      const updatedUser = await User.findById(id);
      const token = jwt.sign(
        { id: updatedUser.id, nickname: updatedUser.nickname, role: updatedUser.role },
        JWT_SECRET,
        { expiresIn: '2h' }
      );
  
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error updating user location:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

module.exports = router;
