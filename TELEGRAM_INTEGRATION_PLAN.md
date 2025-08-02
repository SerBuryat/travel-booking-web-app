# Telegram Mini Apps Integration Plan

## Overview
This document outlines the step-by-step plan to integrate Telegram Mini Apps with our daily task manager web application, enabling seamless user authentication and profile management.

## 🎯 Goals
- Create Telegram Mini App for our service
- Implement secure authentication using Telegram's built-in auth
- Auto-register users when they first access our service
- Load user profile data based on Telegram authentication
- Maintain secure sessions without exposing sensitive data

## 📋 Implementation Plan

### Phase 1: Telegram Bot & Mini App Setup

#### 1.1 Create Telegram Bot
- [x] **Create Bot via @BotFather**
  - Message @BotFather on Telegram
  - Use `/newbot` command
  - Choose bot name and username
  - Save bot token securely
  - Get bot username for Mini App
  
  **✅ COMPLETED - Bot Credentials:**
  - Bot Name: `.env -> BOT_NAME`
  - Bot ID: `.env -> BOT_ID` 
  - Bot Token: `.env -> BOT_TOKEN`
  
  **📝 Note:** Bot credentials are stored in `.env` file (not visible in git/cursor due to .gitignore)

#### 1.2 Configure Mini App
- [x] **Set up Mini App with BotFather**
  - Use `/newapp` command with your bot
  - Provide app title and description
  - Get Mini App URL (e.g., `https://t.me/your_bot/app`)
  - Configure app settings

#### 1.3 Create Mini App Frontend
- [] **Create Mini App HTML/JS**
  - Create `public/telegram-mini-app.html`
  - Implement Telegram WebApp SDK
  - Add authentication flow
  - Style to match our app design

#### 1.4 Local Development Setup
- [] **Configure local development environment**
  - Set up local server with `npm run dev`
  - Configure HTTPS tunnel (alternatives to ngrok)
  - Update Mini App URL in BotFather to point to local server
  - Test Mini App functionality locally
  - Set up environment variables for development
  
  **HTTPS Tunnel Alternatives (due to ngrok restrictions):**
  ```bash
  # Option 1: Cloudflare Tunnel (Recommended)
  npm install -g cloudflared
  cloudflared tunnel --url http://localhost:3000
  
  # Option 2: LocalTunnel
  npm install -g localtunnel
  npx localtunnel --port 3000
  
  # Option 3: Serveo
  ssh -R 80:localhost:3000 serveo.net
  
  # Option 4: PageKite
  pip install pagekite
  python -m pagekite 3000 yourname.pagekite.me
  ```
  
  **Development Workflow:**
  1. Start local server: `npm run dev`
  2. Start HTTPS tunnel (choose one from alternatives above)
  3. Update Mini App URL in BotFather with tunnel URL
  4. Test Mini App in Telegram
  5. Make changes locally and see updates in real-time
  
  **Recommended: Cloudflare Tunnel**
  - Free and reliable
  - No IP restrictions
  - Automatic HTTPS
  - Easy setup with `cloudflared`

### Phase 2: Backend Authentication System

#### 2.1 Create Authentication API Endpoints
- [ ] **Create `/api/auth/telegram` endpoint**
  - Validate Telegram initData
  - Generate secure session tokens
  - Store user session data
  - Return authentication response

#### 2.2 Implement Session Management
- [ ] **Create session utilities**
  - Session token generation
  - Session validation
  - Session cleanup/expiration
  - Database schema updates

#### 2.3 Database Schema Updates
- [ ] **Update existing tables for Telegram integration**
  ```sql
  -- Update tclients_auth table
  ALTER TABLE tclients_auth ADD COLUMN session_token VARCHAR(255);
  ALTER TABLE tclients_auth ADD COLUMN session_expires_at TIMESTAMP;
  ALTER TABLE tclients_auth ADD COLUMN telegram_username VARCHAR(255);
  
  -- Add indexes for performance
  CREATE INDEX idx_tclients_auth_session_token ON tclients_auth(session_token);
  CREATE INDEX idx_tclients_auth_auth_id ON tclients_auth(auth_id);
  
  -- Update tclients table
  ALTER TABLE tclients ADD COLUMN photo TEXT;
  ALTER TABLE tclients ADD COLUMN telegram_verified BOOLEAN DEFAULT FALSE;
  ```
  
  **Note:** 
  - Using `tclients_auth.auth_id` to store Telegram `chat_id` (telegram_id)
  - Using `tclients_auth.auth_type` to identify authentication method (e.g., 'telegram', 'oauth2', 'email')
  - Migrating Telegram first_name to `tclients.name`
  - Migrating Telegram photo_url to `tclients.photo`
  - Keeping telegram_username in auth table for future reference

#### 2.4 User Registration Flow
- [ ] **Implement Telegram user registration logic**
  ```typescript
  // Pseudocode for Telegram user registration
  async function registerTelegramUser(telegramData: TelegramUserData) {
    const { id, username, first_name, photo_url } = telegramData;
    
    // 1. Check if user already exists
    const existingAuth = await db.tclients_auth.findFirst({
      where: { 
        auth_id: id.toString(),
        auth_type: 'telegram'
      }
    });
    
    if (existingAuth) {
      // User exists - update session and return
      const sessionToken = generateSecureToken();
      await db.tclients_auth.update({
        where: { id: existingAuth.id },
        data: {
          session_token: sessionToken,
          session_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          telegram_username: username
        }
      });
      
      return { 
        success: true, 
        isNewUser: false,
        sessionToken,
        userId: existingAuth.client_id 
      };
    }
    
    // 2. Create new user in tclients table
    const newClient = await db.tclients.create({
      data: {
        name: first_name,
        photo: photo_url,
        telegram_verified: true,
        // ... other required fields
      }
    });
    
    // 3. Create auth record in tclients_auth table
    const newAuth = await db.tclients_auth.create({
      data: {
        client_id: newClient.id,
        auth_id: id.toString(),
        auth_type: 'telegram',
        session_token: generateSecureToken(),
        session_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
        telegram_username: username
      }
    });
    
    return { 
      success: true, 
      isNewUser: true,
      sessionToken: newAuth.session_token,
      userId: newClient.id 
    };
  }
  
  // Usage in API endpoint
  app.post('/api/auth/telegram', async (req, res) => {
    const { initData, user } = req.body;
    
    // Validate Telegram data
    if (!validateTelegramInitData(initData)) {
      return res.status(401).json({ error: 'Invalid Telegram data' });
    }
    
    // Register/authenticate user
    const result = await registerTelegramUser(user);
    
    if (result.success) {
      res.json({
        sessionToken: result.sessionToken,
        isNewUser: result.isNewUser,
        redirectUrl: result.isNewUser ? '/onboarding' : '/profile'
      });
    } else {
      res.status(500).json({ error: 'Registration failed' });
    }
  });
  ```

### Phase 3: Frontend Integration

#### 3.1 Update Profile Page
- [ ] **Modify ProfilePage component**
  - Add Telegram authentication check
  - Handle session token validation
  - Display user data from Telegram
  - Add logout functionality

#### 3.2 Create Authentication Components
- [ ] **Create AuthProvider context**
  - Manage authentication state
  - Handle session persistence
  - Provide auth utilities

#### 3.3 Add Protected Routes
- [ ] **Implement route protection**
  - Redirect unauthenticated users
  - Handle authentication flow
  - Manage session expiration

### Phase 4: Security & Validation

#### 4.1 Implement Telegram Validation
- [ ] **Create validation utilities**
  - Validate initData hash
  - Verify Telegram signature
  - Handle validation errors

#### 4.2 Add Security Measures
- [ ] **Implement security best practices**
  - Rate limiting
  - CSRF protection
  - Input validation
  - Error handling

### Phase 5: User Experience

#### 5.1 Auto-registration Flow
- [ ] **Implement user registration**
  - Check if user exists
  - Auto-create user profile
  - Handle first-time setup

#### 5.2 Profile Data Management
- [ ] **Sync Telegram data**
  - Update profile with Telegram info
  - Handle profile photo
  - Manage username changes

## 🔧 Technical Implementation Details

### Mini App Structure
```
public/
├── telegram-mini-app.html
├── telegram-mini-app.js
└── telegram-mini-app.css
```

### API Endpoints
```
/api/auth/telegram     - Handle Telegram authentication
/api/auth/validate     - Validate session tokens
/api/auth/logout       - Handle user logout
/api/user/profile      - Get/update user profile
```

### Database Changes
- Add `User` model with Telegram fields
- Add session management fields
- Create indexes for performance

## 🚀 Development Workflow

### Step 1: Bot Setup (Day 1)
1. Create Telegram bot
2. Configure Mini App
3. Test basic Mini App functionality

### Step 2: Backend Development (Days 2-3)
1. Create authentication endpoints
2. Implement session management
3. Update database schema
4. Add security validation

### Step 3: Frontend Integration (Days 4-5)
1. Update ProfilePage component
2. Create authentication context
3. Add protected routes
4. Test authentication flow

### Step 4: Testing & Polish (Days 6-7)
1. End-to-end testing
2. Security testing
3. User experience optimization
4. Documentation updates

## 🔒 Security Considerations

### Must Implement
- ✅ Validate Telegram initData hash
- ✅ Use secure session tokens
- ✅ Implement rate limiting
- ✅ Add CSRF protection
- ✅ Validate all inputs

### Best Practices
- ✅ Use HTTPS only
- ✅ Implement session expiration
- ✅ Log security events
- ✅ Handle errors gracefully
- ✅ Sanitize user data

## 📱 Mini App Features

### Core Features
- [ ] **Authentication Flow**
  - Get user data from Telegram
  - Validate with backend
  - Redirect to main app

### UI/UX Requirements
- [ ] **Responsive Design**
  - Mobile-first approach
  - Telegram design guidelines
  - Brand consistency

## 🧪 Testing Strategy

### Unit Tests
- [ ] **Authentication utilities**
- [ ] **Session management**
- [ ] **Validation functions**

### Integration Tests
- [ ] **Telegram API integration**
- [ ] **Database operations**
- [ ] **Frontend-backend communication**

### End-to-End Tests
- [ ] **Complete authentication flow**
- [ ] **Profile data loading**
- [ ] **Session management**

## 📚 Resources & Documentation

### Telegram Documentation
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [WebApp SDK](https://core.telegram.org/bots/webapps#javascript-sdk)

### Security Resources
- [Telegram Security Guidelines](https://core.telegram.org/bots/webapps#security-considerations)
- [Session Management Best Practices](https://owasp.org/www-project-cheat-sheets/cheatsheets/Session_Management_Cheat_Sheet.html)

## 🎯 Success Criteria

### Technical Success
- [ ] Users can authenticate via Telegram
- [ ] Session tokens are secure and validated
- [ ] Profile data loads correctly
- [ ] Auto-registration works seamlessly

### User Experience Success
- [ ] Smooth authentication flow
- [ ] Fast profile loading
- [ ] Intuitive user interface
- [ ] Reliable session management

### Security Success
- [ ] No sensitive data exposure
- [ ] Proper validation implemented
- [ ] Rate limiting active
- [ ] Error handling secure

## 📝 Notes & Updates

### Development Notes
- Keep this document updated as we progress
- Add any challenges or solutions found
- Document any deviations from plan

### Future Enhancements
- Push notifications via Telegram
- Deep linking from Telegram
- Advanced profile features
- Multi-language support

---

**Last Updated:** 2024-12-19
**Status:** Phase 1 - Bot Created ✅
**Next Action:** Configure Mini App with BotFather 