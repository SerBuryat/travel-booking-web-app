# Windows Setup Guide for SSH Tunnel

This guide helps you set up SSH tunneling with password authentication on Windows for development.

## 🚀 Quick Setup

### **Option 1: Using WSL (Recommended)**

#### **1. Install WSL**
```bash
# Open PowerShell as Administrator and run:
wsl --install

# Restart your computer when prompted
```

#### **2. Install sshpass in WSL**
```bash
# Open WSL terminal
wsl

# Update and install sshpass
sudo apt update
sudo apt install sshpass

# Verify installation
sshpass -V
```

#### **3. Use the WSL tunnel script**
```bash
# In your project directory
npm run tunnel:wsl
```

### **Option 2: Using Git Bash**

#### **1. Install Git Bash**
Download and install Git for Windows from: https://git-scm.com/download/win

#### **2. Check if sshpass is available**
```bash
# Open Git Bash and check
sshpass -V
```

#### **3. Use the standard tunnel script**
```bash
# In your project directory
npm run tunnel
```

## 📋 Available Scripts for Windows

### **SSH Tunnel Scripts**
- `npm run tunnel:wsl` - **Recommended**: Uses WSL with sshpass
- `npm run tunnel:win` - Standard Windows batch (requires sshpass in PATH)
- `npm run tunnel` - Unix script (works with Git Bash)

### **Development Scripts**
- `npm run dev:win` - Start tunnel and dev server (Windows)
- `npm run dev:full` - Start tunnel and dev server (Unix/Linux/macOS)

## 🔧 Environment Setup

### **1. Create .env file**
```bash
cp env.example .env
```

### **2. Edit .env with your credentials**
```env
# SSH Configuration
SSH_HOST=192.168.0.1
SSH_USER=ssh_user
SSH_PASSWORD=your_actual_password
SSH_PORT=22

# Database Configuration
SSH_DB_HOST=localhost
SSH_DB_PORT=5432
DB_USER=db_user
DB_PASSWORD=db_password
DB_NAME=db_name

# Prisma Configuration
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}"
```

## 🚀 Usage

### **Development Workflow**
```bash
# Terminal 1: Start SSH tunnel
npm run tunnel:wsl

# Terminal 2: Start development
npm run dev

# Terminal 3: Test connection (optional)
npm run db:test
```

### **API Testing**
Visit: `http://localhost:3000/api/test-db`

## 🛠️ Troubleshooting

### **WSL Issues**
```bash
# Check WSL status
wsl --status

# Update WSL
wsl --update

# Restart WSL
wsl --shutdown
wsl
```

### **sshpass Issues**
```bash
# Reinstall sshpass in WSL
wsl sudo apt remove sshpass
wsl sudo apt install sshpass

# Check version
wsl sshpass -V
```

### **Connection Issues**
1. **Check SSH credentials** in `.env`
2. **Verify remote server** is accessible
3. **Test SSH connection** manually:
   ```bash
   wsl ssh ssh_user@192.168.0.1
   ```

### **Common Errors**
- **"sshpass not found"**: Install sshpass in WSL
- **"WSL not available"**: Install WSL first
- **"Connection refused"**: Check SSH server and credentials
- **"Permission denied"**: Verify SSH username and password

## 📁 File Structure

```
scripts/
├── tunnel.sh        # Unix/Linux/macOS script
├── tunnel.bat       # Windows batch script
├── tunnel-wsl.bat   # Windows WSL script (Recommended)
└── test-db.js       # Database connection test
```

## 🎯 Best Practices

1. **Use WSL approach** for better compatibility
2. **Keep .env secure** and never commit it
3. **Test connection** before starting development
4. **Use separate terminals** for tunnel and development
5. **Check logs** for detailed error messages

## 🔒 Security Notes

- SSH passwords are stored in `.env` file
- Use strong passwords for SSH authentication
- Consider switching to SSH keys for production
- Never commit `.env` file to version control

## 🚨 Important Notes

- **WSL is recommended** for Windows development
- **sshpass is required** for password authentication
- **Restart WSL** if you encounter issues
- **Use separate terminals** for tunnel and app 