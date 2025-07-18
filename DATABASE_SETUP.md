# Database Setup Guide

This guide explains how to set up and use the database with SSH tunneling in this Next.js application.

## 🚀 Quick Start

### 1. **Set up environment variables**
```bash
cp env.example .env
# Edit .env with your real credentials
```

### 2. **Start SSH tunnel**
```bash
# Windows
npm run tunnel:win

# Unix/Linux/macOS
npm run tunnel
```

### 3. **Generate Prisma client**
```bash
npx prisma generate
```

### 4. **Test database connection**
```bash
npm run db:test
```

### 5. **Start development server**
```bash
npm run dev
```

## 📋 Available Scripts

### **SSH Tunnel Scripts**
- `npm run tunnel` - Start SSH tunnel (Unix/Linux/macOS)
- `npm run tunnel:win` - Start SSH tunnel (Windows)
- `npm run tunnel:unix` - Start SSH tunnel with executable permissions

### **Database Scripts**
- `npm run db:test` - Test database connection
- `npm run db:studio` - Open Prisma Studio
- `npm run db:generate` - Generate Prisma client
- `npm run db:pull` - Pull schema from database
- `npm run db:push` - Push schema to database
- `npm run db:sync` - Pull schema and generate client

### **Development Scripts**
- `npm run dev` - Start development server
- `npm run dev:full` - Start tunnel and dev server (Unix/Linux/macOS)
- `npm run dev:win` - Start tunnel and dev server (Windows)

## 🔧 Workflow

### **Development Workflow**
```bash
# Terminal 1: Start SSH tunnel
npm run tunnel:win    # Windows
npm run tunnel        # Unix/Linux/macOS

# Terminal 2: Start development
npm run dev

# Terminal 3: Test connection (optional)
npm run db:test
```

### **API Testing**
Visit: `http://localhost:3000/api/test-db`

## 🛠️ Troubleshooting

### **Connection Issues**
1. **Check SSH tunnel**: Make sure tunnel is running
2. **Verify credentials**: Check your `.env` file
3. **Test connection**: Run `npm run db:test`
4. **Check logs**: Look for error messages

### **Common Errors**
- **ECONNREFUSED**: SSH tunnel not running
- **P1001**: Invalid DATABASE_URL format
- **Authentication failed**: Check SSH credentials

## 📁 File Structure

```
scripts/
├── tunnel.sh      # SSH tunnel script (Unix/Linux/macOS)
├── tunnel.bat     # SSH tunnel script (Windows)
└── test-db.js     # Database connection test

src/
├── lib/
│   └── prisma.ts  # Standard Prisma client
└── app/
    └── api/
        └── test-db/
            └── route.ts  # Database test API
```

## 🎯 Best Practices

1. **Always start SSH tunnel before development**
2. **Use `npm run db:test` to verify connection**
3. **Keep `.env` file secure and never commit it**
4. **Use `npm run db:sync` after schema changes**
5. **Test API endpoints after setup**

## 🔒 Security Notes

- SSH tunnel credentials are stored in `.env`
- Database connection uses standard Prisma client
- No programmatic SSH tunneling in application code
- Manual tunnel management for better control 