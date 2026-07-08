import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required.' });
    return;
  }

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminUsername || !adminPasswordHash || !jwtSecret) {
    console.error('Error: Admin credentials or JWT secret not configured in env.');
    res.status(500).json({ error: 'Server authentication parameters are misconfigured.' });
    return;
  }

  // Compare username and password
  const usernameMatch = username === adminUsername;
  const passwordMatch = usernameMatch ? await bcrypt.compare(password, adminPasswordHash) : false;

  if (!passwordMatch) {
    res.status(401).json({ error: 'Invalid admin username or password.' });
    return;
  }

  // Generate JWT token (expires in 7 days)
  const token = jwt.sign(
    { username: adminUsername, role: 'admin' },
    jwtSecret,
    { expiresIn: '7d' }
  );

  res.status(200).json({ token });
});

export default router;
