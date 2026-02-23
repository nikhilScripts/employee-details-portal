const express = require('express');
const msal = require('@azure/msal-node');
const UserModel = require('../models/userModel');
const { generateToken, authenticate } = require('../middleware/auth');

const router = express.Router();

// MSAL Configuration
const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    clientSecret: process.env.CLIENT_SECRET
  }
};

const msalClient = new msal.ConfidentialClientApplication(msalConfig);

const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3000/auth/callback';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * @route GET /auth/login
 * @desc Redirect to Microsoft login
 */
router.get('/login', async (req, res) => {
  try {
    const authUrl = await msalClient.getAuthCodeUrl({
      scopes: ['openid', 'profile', 'email', 'User.Read'],
      redirectUri: REDIRECT_URI
    });
    res.redirect(authUrl);
  } catch (error) {
    console.error('Login error:', error);
    res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
  }
});

/**
 * @route GET /auth/callback
 * @desc Handle Microsoft OAuth callback
 */
router.get('/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    console.error('OAuth error:', error);
    return res.redirect(`${FRONTEND_URL}/login?error=${error}`);
  }

  if (!code) {
    return res.redirect(`${FRONTEND_URL}/login?error=no_code`);
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await msalClient.acquireTokenByCode({
      code,
      scopes: ['openid', 'profile', 'email', 'User.Read'],
      redirectUri: REDIRECT_URI
    });

    // Extract user info from ID token
    const idTokenClaims = tokenResponse.idTokenClaims;
    
    // Create or update user in database
    const user = UserModel.createOrUpdate({
      oid: idTokenClaims.oid,
      sub: idTokenClaims.sub,
      email: idTokenClaims.email || idTokenClaims.preferred_username,
      name: idTokenClaims.name,
      given_name: idTokenClaims.given_name,
      family_name: idTokenClaims.family_name
    });

    // Generate JWT token
    const token = generateToken(user);

    // Redirect to frontend with token
    const redirectPath = user.role === 'ADMIN' ? '/admin' : '/user';
    res.redirect(`${FRONTEND_URL}${redirectPath}?token=${token}`);
  } catch (error) {
    console.error('Callback error:', error);
    res.redirect(`${FRONTEND_URL}/login?error=token_failed`);
  }
});

/**
 * @route GET /auth/me
 * @desc Get current user info
 */
router.get('/me', authenticate, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      displayName: req.user.display_name,
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      role: req.user.role,
      employeeId: req.user.employee_id
    }
  });
});

/**
 * @route POST /auth/logout
 * @desc Logout user (client-side token removal)
 */
router.post('/logout', authenticate, (req, res) => {
  // JWT is stateless, so logout is handled client-side
  // Could implement token blacklist for more security
  res.json({ message: 'Logged out successfully' });
});

/**
 * @route GET /auth/users
 * @desc Get all users (admin only)
 */
router.get('/users', authenticate, (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  const users = UserModel.getAll();
  res.json({ users });
});

/**
 * @route PUT /auth/users/:id/role
 * @desc Update user role (admin only)
 */
router.put('/users/:id/role', authenticate, (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { role } = req.body;
  if (!['ADMIN', 'USER'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const user = UserModel.updateRole(req.params.id, role);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ user });
});

module.exports = router;