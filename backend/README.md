# 🚀 DU-Overtime Backend

Sistem Manajemen Lembur Dewa United dengan approval 3 tahap (PIC → C-Level → HRD) hingga verifikasi Finance.

## 📋 Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (Passport)
- **Validation**: class-validator

## 🎯 Fitur Utama

### 1. **State Machine Approval Flow**
```
PENDING_PIC → PENDING_C_LEVEL → PENDING_HRD → COMPLETED
                    ↓
                REJECTED (di setiap tahap)
```

### 2. **Role-Based Access Control (RBAC)**
- `EMPLOYEE`: Buat pengajuan lembur
- `PIC`: Approval tahap 1
- `C_LEVEL`: Approval tahap 2
- `HRD`: Approval tahap 3 (final)
- `FINANCE`: Verifikasi pembayaran

### 3. **Automatic Calculation**
- Durasi otomatis dihitung dari start_time dan end_time
- Tarif lembur diambil dari `global_settings` (snapshot)
- Total pembayaran = (durasi/60) × flat_rate

### 4. **Audit Trail**
Setiap perubahan status tercatat di `overtime_logs`

## 🛠️ Setup Instructions

### Prerequisites
```bash
Node.js >= 18
PostgreSQL >= 14
npm or yarn
```

### 1. Clone & Install Dependencies

```bash
# Clone repository (atau copy file-file yang sudah dibuat)
cd du-overtime-backend

# Install dependencies
npm install
```

### 2. Database Setup

```bash
# 1. Buat database PostgreSQL
createdb du_overtime

# Atau via psql:
psql -U postgres
CREATE DATABASE du_overtime;
\q

# 2. Copy environment variables
cp .env.example .env

# 3. Edit .env dan sesuaikan DATABASE_URL
# DATABASE_URL="postgresql://username:password@localhost:5432/du_overtime?schema=public"
```

### 3. Prisma Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (create tables)
npx prisma migrate dev --name init

# Seed database (create sample data)
npm run prisma:seed
```

### 4. Run Application

```bash
# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod
```

Server akan berjalan di: **http://localhost:3000/api**

### 5. Open Prisma Studio (Optional)

```bash
npm run prisma:studio
```

Browser akan terbuka di http://localhost:5555

## 🔐 Default Login Credentials

Setelah seed, gunakan credential berikut:

| Role | Email | Password |
|------|-------|----------|
| EMPLOYEE | faris@dewaunited.com | password123 |
| EMPLOYEE | arul@dewaunited.com | password123 |
| PIC | pic.it@dewaunited.com | password123 |
| C_LEVEL | clevel@dewaunited.com | password123 |
| HRD | hrd@dewaunited.com | password123 |
| FINANCE | finance@dewaunited.com | password123 |

## 📡 API Endpoints

### Authentication

```bash
POST   /api/auth/login          # Login
POST   /api/auth/register       # Register (optional)
GET    /api/auth/profile        # Get current user profile
```

### Overtime Management

```bash
# Employee
POST   /api/overtime            # Create overtime submission
GET    /api/overtime            # Get all submissions (filtered by role)
GET    /api/overtime/stats      # Get statistics
GET    /api/overtime/:id        # Get single submission

# Approvers (PIC, C-Level, HRD)
GET    /api/overtime/pending    # Get pending approvals
PATCH  /api/overtime/:id/approve  # Approve submission
PATCH  /api/overtime/:id/reject   # Reject submission
```

### Users & Departments

```bash
GET    /api/users               # Get all users (HRD+)
GET    /api/users/:id           # Get user by ID
GET    /api/users/role/:role    # Get users by role
GET    /api/users/department/:id # Get users by department

GET    /api/departments         # Get all departments
POST   /api/departments         # Create department (HRD+)
PUT    /api/departments/:id     # Update department (HRD+)
DELETE /api/departments/:id     # Delete department (HRD+)
```

## 🧪 Testing API dengan cURL

### 1. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "faris@dewaunited.com",
    "password": "password123"
  }'
```

Simpan `access_token` yang didapat.

### 2. Create Overtime Submission (Employee)

```bash
curl -X POST http://localhost:3000/api/overtime \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "date": "2026-02-10",
    "startTime": "2026-02-10T18:00:00Z",
    "endTime": "2026-02-10T22:00:00Z",
    "reason": "Project deployment deadline"
  }'
```

### 3. Get Pending Approvals (PIC)

```bash
# Login sebagai PIC dulu
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pic.it@dewaunited.com",
    "password": "password123"
  }'

# Get pending
curl -X GET http://localhost:3000/api/overtime/pending \
  -H "Authorization: Bearer PIC_TOKEN_HERE"
```

### 4. Approve Submission (PIC)

```bash
curl -X PATCH http://localhost:3000/api/overtime/SUBMISSION_ID/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PIC_TOKEN_HERE" \
  -d '{
    "signature": "data:image/png;base64,...",
    "note": "Approved - valid overtime"
  }'
```

## 📊 Database Schema

### Tables

1. **departments** - Daftar departemen
2. **users** - Data karyawan & credentials
3. **global_settings** - Konfigurasi sistem (flat rate)
4. **overtime_submissions** - Data pengajuan lembur
5. **overtime_logs** - Audit trail

### Relationships

```
departments (1) → (N) users
users (1) → (N) overtime_submissions
overtime_submissions (1) → (N) overtime_logs
```

## 🔧 Configuration

### Environment Variables (.env)

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/du_overtime?schema=public"
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="7d"
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
```

### Global Settings

Ubah tarif lembur via Prisma Studio atau SQL:

```sql
UPDATE global_settings 
SET value = 75000 
WHERE key = 'FLAT_RATE_PER_HOUR';
```

## 📁 Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── jwt.strategy.ts
│   └── guards/
├── overtime/            # Overtime management
│   ├── dto/
│   ├── overtime.service.ts
│   └── overtime.controller.ts
├── users/               # User management
├── departments/         # Department management
├── prisma/              # Prisma service
└── main.ts              # Application entry point

prisma/
├── schema.prisma        # Database schema
└── seed.ts             # Database seeder
```

## 🚀 Production Deployment

### 1. Build

```bash
npm run build
```

### 2. Environment

Pastikan production `.env`:
- `NODE_ENV=production`
- `DATABASE_URL` mengarah ke production database
- `JWT_SECRET` yang kuat dan unik
- `FRONTEND_URL` mengarah ke domain production

### 3. Database Migration

```bash
# Production migration (tanpa seed)
npx prisma migrate deploy
```

### 4. Start

```bash
npm run start:prod
```

### 5. Process Manager (PM2)

```bash
npm install -g pm2

pm2 start dist/main.js --name du-overtime
pm2 save
pm2 startup
```

## 🐳 Docker (Optional)

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: du_overtime
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/du_overtime
      JWT_SECRET: super-secret-key
    depends_on:
      - postgres

volumes:
  postgres_data:
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 📝 Business Logic Highlights

### State Machine Flow

```typescript
PENDING_PIC (initial)
  ├─ approve() by PIC → PENDING_C_LEVEL
  └─ reject() by PIC → REJECTED

PENDING_C_LEVEL
  ├─ approve() by C_LEVEL → PENDING_HRD
  └─ reject() by C_LEVEL → REJECTED

PENDING_HRD
  ├─ approve() by HRD → COMPLETED
  └─ reject() by HRD → REJECTED
```

### Calculation Example

```
Durasi: 4 jam (240 menit)
Flat Rate: Rp 50,000/jam
Total Pay: (240/60) × 50000 = Rp 200,000
```

## 🆘 Troubleshooting

### Error: "Can't reach database server"

```bash
# Check PostgreSQL is running
pg_isready

# Or restart PostgreSQL
sudo service postgresql restart
```

### Error: "Prisma Client not generated"

```bash
npx prisma generate
```

### Error: Port 3000 already in use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change PORT in .env
```

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

## 👨‍💻 Developer

Dibuat untuk memenuhi tugas kuliah sistem manajemen lembur Dewa United.

## 📄 License

MIT
