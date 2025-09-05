import { Router } from 'express';
import { registerUser , signInUser } from '../controllers/auth';
const router = Router();

router.post('/signin', signInUser);
router.post('/signup', registerUser);

export default router;
