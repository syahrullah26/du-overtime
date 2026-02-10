# Quick Start Guide - DU Overtime Backend

biar bisa jalan baca ini brow.
kalo mager langsung aja ke option 2


## Option 1: Manual Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Setup Database

```bash
# Buat database PostgreSQL
createdb du_overtime

# Atau via psql:
psql -U postgres
CREATE DATABASE du_overtime;
\q
```

### Step 3: Configure Environment

```bash
# Copy .env.example
cp .env.example .env

# Edit .env file
nano .env
```

Update `DATABASE_URL`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/du_overtime?schema=public"
```

### Step 4: Setup Prisma

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npm run prisma:seed
```

### Step 5: Start Server

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

Server berjalan di: **http://localhost:3000/api**

---

## Option 2: Automatic Setup (Recommended)

```bash
# 1. Copy semua file ke folder project Anda
cd du-overtime-backend

# 2. Jalankan setup script
chmod +x setup.sh
./setup.sh
```

Script akan otomatis:
-  Install dependencies
-  Setup .env file
-  Generate Prisma Client
-  Create database
-  Run migrations
-  Seed sample data
-  Start dev server

---

## Verify Installation

### 1. Test API Health

```bash
curl http://localhost:3000/api/auth/login
```


### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "faris@dewaunited.com",
    "password": "password123"
  }'
```

Should return:
```json
{
  "access_token": "eyJhbG...",
  "user": {
    "id": "...",
    "email": "faris@dewaunited.com",
    "name": "Faris",
    "role": "EMPLOYEE"
  }
}
```

### 3. Open Prisma Studio

```bash
npm run prisma:studio
```

Browse to: http://localhost:5555

---

## Quick Test Scenario (kalo ga mager)

### Scenario: Employee submits overtime, gets approved by all

```bash
# 1. Login as Employee
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"faris@dewaunited.com","password":"password123"}' \
  | jq -r '.access_token' > employee_token.txt

EMPLOYEE_TOKEN=$(cat employee_token.txt)

# 2. Create overtime submission
curl -X POST http://localhost:3000/api/overtime \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $EMPLOYEE_TOKEN" \
  -d '{
    "date": "2026-02-10",
    "startTime": "2026-02-10T18:00:00Z",
    "endTime": "2026-02-10T22:00:00Z",
    "reason": "Project deployment"
  }' | jq -r '.id' > submission_id.txt

SUBMISSION_ID=$(cat submission_id.txt)
echo "Submission ID: $SUBMISSION_ID"

# 3. Login as PIC
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"pic.it@dewaunited.com","password":"password123"}' \
  | jq -r '.access_token' > pic_token.txt

PIC_TOKEN=$(cat pic_token.txt)

# 4. PIC approves
curl -X PATCH "http://localhost:3000/api/overtime/$SUBMISSION_ID/approve" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PIC_TOKEN" \
  -d '{"note":"Approved by PIC"}'

# 5. Login as C-Level
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"clevel@dewaunited.com","password":"password123"}' \
  | jq -r '.access_token' > clevel_token.txt

CLEVEL_TOKEN=$(cat clevel_token.txt)

# 6. C-Level approves
curl -X PATCH "http://localhost:3000/api/overtime/$SUBMISSION_ID/approve" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CLEVEL_TOKEN" \
  -d '{"note":"Approved by C-Level"}'

# 7. Login as HRD
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hrd@dewaunited.com","password":"password123"}' \
  | jq -r '.access_token' > hrd_token.txt

HRD_TOKEN=$(cat hrd_token.txt)

# 8. HRD approves (final)
curl -X PATCH "http://localhost:3000/api/overtime/$SUBMISSION_ID/approve" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $HRD_TOKEN" \
  -d '{"note":"Approved by HRD - Ready for payment"}'

# 9. Check final status
curl -X GET "http://localhost:3000/api/overtime/$SUBMISSION_ID" \
  -H "Authorization: Bearer $HRD_TOKEN" \
  | jq '.status'

# Should show: "COMPLETED"
```

---

## Common Issues

### Issue: "Can't connect to database"

**Solution:**
```bash
# Check PostgreSQL is running
pg_isready

# Start PostgreSQL
sudo service postgresql start

# Or on macOS with Homebrew:
brew services start postgresql
```

### Issue: "Prisma Client not generated"

**Solution:**
```bash
npx prisma generate
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or change port in .env
PORT=3001
```

### Issue: "Migration failed"

**Solution:**
```bash
# Reset database
npx prisma migrate reset

# This will:
# - Drop database
# - Create new database
# - Run all migrations
# - Run seed
```

---

## Next Steps

1. **Read Documentation:**
   - README.md - Full documentation
   - API_DOCUMENTATION.md - API reference

2. **Explore Prisma Studio:**
   ```bash
   npm run prisma:studio
   ```

3. **Check Logs:**
   ```bash
   # In development
   npm run start:dev
   # Logs appear in console
   ```

4. **Test with Postman:**
   - Import API collection
   - Test all endpoints

5. **Deploy to Production:**
   - See DEPLOYMENT_GUIDE.md
   - Configure production .env
   - Use PM2 or Docker
tapi pada belom ada hehehehehehehehe
---

## Learning Resources

- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com)
- [JWT Docs](https://jwt.io/introduction)

---

## Tips

1. **Keep Prisma Studio open** during development for quick database inspection
2. **Use environment-specific .env files** (.env.development, .env.production)
3. **Always backup database** before migrations in production
4. **Monitor logs** with PM2 or Docker logs
5. **Use transactions** for critical operations (already handled by Prisma)

---

## Need Help?

1. Check the error message carefully
2. Review logs in console
3. Check Prisma Studio for data issues
4. Verify .env configuration
5. Ensure database is running
6. Check network/firewall settings

Sebat Time