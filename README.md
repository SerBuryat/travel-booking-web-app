# Daily Task Manager Web App

A Next.js application with Prisma ORM and SSH tunnel connection to PostgreSQL database.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Copy the example environment file and fill in your credentials:
```bash
cp env.example .env
```

Edit `.env` with your actual SSH and database credentials:
```env
# SSH TUNNEL CONFIGURATION
SSH_HOST=your_ssh_host_or_ip
SSH_PORT=22
SSH_USER=your_ssh_username
SSH_PASSWORD=your_ssh_password

# POSTGRES DATABASE CONFIGURATION
SSH_DB_HOST=localhost
SSH_DB_PORT=5432
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_database_name

# PRISMA DATABASE URL (auto-generated from above)
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5433/${DB_NAME}"
```

### 3. Pull Existing Database Schema
Since you already have a database schema, use Prisma introspection to generate the Prisma schema:
```bash
npx prisma db pull
```

This command will:
- Connect to your database via SSH tunnel
- Introspect the existing tables and relationships
- Generate the corresponding Prisma models in `prisma/schema.prisma`

### 4. Generate Prisma Client
After pulling the schema, generate the Prisma client:
```bash
npx prisma generate
```

### 5. Test Database Connection
Test the SSH tunnel and database connection:
```bash
# Using the standalone script
node scripts/test-db.js

# Or via API endpoint (when app is running)
curl http://localhost:4000/api/test-db
```

### 6. Run the Development Server
```bash
npm run dev
```

The app will be available at [http://localhost:4000](http://localhost:4000).

## 🔧 Database Connection Architecture

```
[Next.js App] → [SSH Tunnel (localhost:5433)] → [Remote SSH Host] → [PostgreSQL Database]
```

### SSH Tunnel Configuration
- **Local Port**: 5433 (forwarded to remote DB)
- **Remote Host**: Your SSH server
- **Remote DB Port**: 5432 (PostgreSQL default)

### Environment Variables
- `SSH_HOST`: SSH server hostname/IP
- `SSH_USER`: SSH username
- `SSH_PASSWORD`: SSH password
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name

## 🧪 Testing

### Test Database Connection
```bash
# Standalone test script
node scripts/test-db.js

# API endpoint test (when app is running)
GET /api/test-db
```

### Test Response Example
```json
{
  "status": "success",
  "message": "Database connection successful",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "database": {
    "database_name": "your_database",
    "current_user": "your_db_user",
    "postgres_version": "PostgreSQL 15.1",
    "connection_time": "2024-01-01T12:00:00.000Z"
  },
  "ssh_tunnel": {
    "local_port": 5433,
    "remote_host": "your_ssh_host",
    "remote_port": 5432
  }
}
```

## 🐳 Docker Deployment

### Production Environment File
Create `prod.env` for production credentials:
```env
# Same structure as .env but with production values
SSH_HOST=prod_ssh_host
SSH_USER=prod_ssh_user
SSH_PASSWORD=prod_ssh_password
DB_USER=prod_db_user
DB_PASSWORD=prod_db_password
DB_NAME=prod_database
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5433/${DB_NAME}"
NODE_ENV=production
```

### Docker Compose Example
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "4000:4000"
    env_file:
      - prod.env
    environment:
      - NODE_ENV=production
```

## 📁 Project Structure

```
├── prisma/
│   └── schema.prisma          # Database schema (generated from introspection)
├── src/
│   ├── lib/
│   │   └── sshPrisma.ts       # SSH tunnel + Prisma client utility
│   └── app/
│       └── api/
│           └── test-db/
│               └── route.ts   # Database connection test API
├── scripts/
│   └── test-db.js            # Standalone connection test script
├── env.example               # Environment variables template
└── .env                      # Your local environment variables (not in git)
```

## 🔒 Security Best Practices

1. **Never commit `.env` files** - they're in `.gitignore`
2. **Use SSH keys instead of passwords** when possible
3. **Rotate credentials regularly** in production
4. **Use environment-specific configs** (dev/staging/prod)
5. **Limit database user permissions** to only what's needed

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npx prisma db pull` - Pull schema from existing database
- `npx prisma generate` - Generate Prisma client
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `node scripts/test-db.js` - Test database connection

## 🐛 Troubleshooting

### Common Issues

1. **SSH Connection Failed**
   - Verify SSH credentials in `.env`
   - Check if SSH server is accessible
   - Ensure SSH port (22) is not blocked

2. **Database Connection Failed**
   - Verify database credentials
   - Check if database exists and is accessible from SSH server
   - Ensure database user has proper permissions

3. **Port Already in Use**
   - Change `localPort` in `sshPrisma.ts` if 5433 is occupied
   - Update `DATABASE_URL` accordingly

4. **Prisma Schema Issues**
   - Run `npx prisma db pull` to refresh schema
   - Run `npx prisma generate` after schema changes

### Debug Mode
Enable detailed logging by setting:
```env
DEBUG=prisma:*
```

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [SSH Tunneling Guide](https://www.ssh.com/academy/ssh/tunneling)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
