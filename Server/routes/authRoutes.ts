import express from 'express';
import {
  signup,
  login,
  resendVerificationEmail,
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);



export default router;