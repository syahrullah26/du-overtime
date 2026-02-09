#!/bin/bash
set -e

echo "DU-Overtime V.1 Backend Setup"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' 

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# cek nodejs dah keinstall belum
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

print_success "Node.js version: $(node -v)"

# cek posgre dah keinstall belum
if ! command -v psql &> /dev/null; then
    print_warning "PostgreSQL is not installed. Please install PostgreSQL 14 or higher."
    echo "You can continue if you have PostgreSQL running on a remote server."
    read -p "Continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    print_success "PostgreSQL found"
fi

# Step 1: Install dependencies
echo ""
echo " Step 1: Installing dependencies..."
npm install
print_success "Dependencies installed"

# Step 2: Setup environment
echo ""
echo "Step 2: Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    print_success "Created .env file from .env.example"
    print_warning "Please edit .env file with your database credentials"
    echo ""
    read -p "Press enter to edit .env file now..." 
    ${EDITOR:-nano} .env
else
    print_warning ".env file already exists. Skipping..."
fi

# Step 3: Database setup
echo ""
echo "Step 3: Setting up database..."
read -p "Do you want to create the database now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter database name (default: du_overtime): " DB_NAME
    DB_NAME=${DB_NAME:-du_overtime}
    
    read -p "Enter PostgreSQL username (default: postgres): " DB_USER
    DB_USER=${DB_USER:-postgres}
    
    # Try to create database
    if command -v createdb &> /dev/null; then
        createdb -U "$DB_USER" "$DB_NAME" 2>/dev/null || print_warning "Database might already exist"
        print_success "Database $DB_NAME ready"
    else
        print_warning "Please create database manually: CREATE DATABASE $DB_NAME;"
    fi
fi

# Step 4: Prisma setup
echo ""
echo "Step 4: Setting up Prisma..."
npx prisma generate
print_success "Prisma client generated"

echo ""
read -p "Run database migrations now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx prisma migrate dev --name init
    print_success "Database migrations completed"
fi

# Step 5: Seed database
echo ""
read -p "Seed database with sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run prisma:seed
    print_success "Database seeded successfully"
    echo ""
    echo "   Default Login Credentials:"
    echo "   Email: faris@dewaunited.com"
    echo "   Password: password123"
    echo ""
    echo "   (Check README.md for all user credentials)"
fi

# Step 6: Final check
echo ""
echo "setup beres bro!"
echo ""
echo "Next steps:"
echo "   1. Review your .env file"
echo "   2. Start development server: npm run start:dev"
echo "   3. Open Prisma Studio: npm run prisma:studio"
echo "   4. Read documentation: README.md"
echo ""
echo "Server will run at: http://localhost:3000/api"
echo ""

read -p "Start development server now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_success "Starting development server..."
    npm run start:dev
fi