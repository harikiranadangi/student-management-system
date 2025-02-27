# Student Management System

## 📌 Overview
The **Student Management System** is a full-stack web application designed to manage student data efficiently. Built with **Next.js, Prisma, and MySQL**, it offers features such as student registration, fee management, attendance tracking, and academic reporting.

## 🚀 Features
- 📋 **Student Enrollment** - Add and manage student records
- 💰 **Fee Collection** - Track fee payments and generate reports
- 📊 **Attendance Tracking** - Mark and analyze attendance data
- 📚 **Exam & Marks Entry** - Enter and manage student performance records
- 📑 **Reports Generation** - Create reports for attendance, fees, and academics
- 🔒 **User Authentication** - Secure login for administrators and staff
- 🛠 **Admin Dashboard** - Manage students, teachers, and staff in one place

## 🛠 Tech Stack
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MySQL
- **Authentication**: Clerk/Auth.js (if applicable)
- **Deployment**: Vercel/Digital Ocean (if applicable)

## 📌 Installation & Setup
1️⃣ **Clone the Repository**
```sh
 git clone https://github.com/your-repo/student-management-system.git
 cd student-management-system
```

2️⃣ **Install Dependencies**
```sh
npm install
```

3️⃣ **Setup Environment Variables**
Create a `.env` file and add the following details:
```env
DATABASE_URL="mysql://user:password@localhost:3306/student_db"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
```

4️⃣ **Run Database Migrations**
```sh
npx prisma migrate dev --name init
```

5️⃣ **Start the Development Server**
```sh
npm run dev
```

## 📂 Project Structure
```
student-management-system/
 ├── pages/
 │   ├── index.tsx        # Home Page
 │   ├── students.tsx     # Student Management
 │   ├── fees.tsx         # Fee Management
 │   └── api/
 │       ├── students.ts # API Route for students
 │       ├── fees.ts     # API Route for fees
 ├── prisma/
 │   ├── schema.prisma   # Database Schema
 ├── components/         # Reusable UI Components
 ├── styles/             # Global Styles (Tailwind)
 ├── .env.example        # Example Environment File
 ├── package.json        # Project Dependencies
 └── README.md           # Project Documentation
```

## 📸 Screenshots (If Available)
*Include screenshots of the app UI*

## ❓ Troubleshooting
**Issue**: `npm: command not found`
- Ensure Node.js and npm are installed
- Run `node -v` and `npm -v` to verify installation

**Issue**: Database connection fails
- Ensure MySQL is running
- Check the `.env` file for correct credentials

## 🏆 Contributing
Contributions are welcome! Please submit a pull request or open an issue if you find any bugs.

## 📜 License
This project is licensed under the MIT License.

---

🚀 **Developed by Harikiran | Kotak Salesian School**

