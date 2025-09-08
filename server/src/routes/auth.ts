import { Router } from 'express';
import { getUser, registerUser, signInUser } from '../controllers/auth';
import { protect } from '../middlewares/auth';
const router = Router();

router.post('/signin', signInUser);
router.post('/signup', registerUser);
router.get('/getUser', protect, getUser); // Dummy route to test

export default router;
