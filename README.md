# Student Management System

## 📌 Overview
The **Student Management System** is a full-stack web application designed to efficiently manage student data. Built with **Next.js, Prisma, and PostgreSQL**, it provides features such as student registration, fee management, attendance tracking, and academic reporting.

## 🚀 Features
- 📋 **Student Enrollment** - Add and manage student records
- 💰 **Fee Collection** - Track fee payments and generate reports
- 📊 **Attendance Tracking** - Mark and analyze attendance data
- 📚 **Exam & Marks Entry** - Enter and manage student performance records
- 💑 **Reports Generation** - Create reports for attendance, fees, and academics
- 🔒 **User Authentication** - Secure login for administrators and staff
- 🛠 **Admin Dashboard** - Manage students, teachers, and staff in one place

## 🛠 Tech Stack
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Clerk/Auth.js (if applicable)
- **Deployment**: Railway, Vercel/Digital Ocean (if applicable)

## 📀 Installation & Setup
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-repo/student-management-system.git
cd student-management-system
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Setup Environment Variables
Create a `.env` file and add the following details:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/student_db"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
```

### 4️⃣ Run Database Migrations
```sh
npx prisma migrate dev --name init
```

### 5️⃣ Start the Development Server
```sh
npm run dev
```

## 📂 Project Structure
```
student-management-system/
  ├── .env
  ├── .gitignore
  ├── next.config.ts
  ├── package.json
  ├── prisma/
  │   ├── schema.prisma
  │   ├── migrations/
  │   │   ├── migration.sql
  ├── src/
  │   ├── api/
  │   ├── app/
  │   │   ├── fees/
  │   │   │   ├── page.tsx
  │   │   │   ├── fee_ledger/
  │   │   │   │   ├── page.tsx
  │   │   │   ├── [id]/
  │   │   │   │   ├── page.tsx
  │   │   ├── students/
  │   │   ├── teachers/
  │   │   ├── reports/
  │   ├── components/
  │   │   ├── FormContainer.tsx
  │   │   ├── FormModal.tsx
  │   ├── config/
  │   ├── lib/
  │   ├── styles/
```

## 📈 Reports & Fee Management
- **Fee Ledger** (`/fees/fee_ledger`) - Track student fee payments
- **Student Fees** (`/fees/[id]`) - View fee status for a particular student (e.g., Term-wise, Total Paid, Not Paid)
- **Reports** (`/reports`) - Generate academic, fee, and attendance reports

## 📸 Screenshots
**Admin Dashboard**

![Admin Dashboard](https://github.com/user-attachments/assets/f3d8ddfb-91c6-42cc-b25a-6dbbca7c1532)

**Student List**

![Student List](https://github.com/user-attachments/assets/a7eebaa5-05cf-4bf6-b79c-4aecca2188cd)

**Fee Ledger**

![Fee Ledger](https://github.com/user-attachments/assets/fee-ledger-example.png)

## 💡 Troubleshooting
**Issue**: `npm: command not found`
- Ensure Node.js and npm are installed
- Run `node -v` and `npm -v` to verify installation

**Issue**: Database connection fails
- Ensure PostgreSQL is running
- Check the `.env` file for correct credentials

## 🏆 Contributing
Contributions are welcome! Feel free to submit a pull request or report issues.

## 📜 License
This project is licensed under the MIT License.

---

🚀 **Developed by Harikiran | Kotak Salesian School**

