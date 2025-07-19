# 🎓 Student Management System

## 📌 Overview

The **Student Management System** is a full-stack web application designed to efficiently manage student data for educational institutions. Built using **Next.js, Prisma**, and **PostgreSQL**, it streamlines operations such as student registration, fee management, attendance tracking, marks entry, and comprehensive reporting.

Ideal for **schools, colleges**, and **training centers**, this platform helps digitize and centralize academic and administrative workflows.

---

## 🚀 Features

- 📋 **Student Enrollment** – Add, update, and view student profiles (name, email, grade, contact)
- 💰 **Fee Collection** – Track fee payments, due dates, generate invoices and ledgers
- 📊 **Attendance Tracking** – Record daily attendance and generate attendance reports
- 📚 **Exam & Marks Entry** – Input exam results, calculate grades, and monitor performance
- 📈 **Reports Generation** – Create reports for fees, attendance, and academics
- 🔒 **User Authentication** – Secure login with role-based access for admins, teachers, students
- 🛠 **Admin Dashboard** – Manage all entities from one place with metrics and quick access

---

## 🛠 Tech Stack

| Layer        | Tech Used                                  |
|--------------|---------------------------------------------|
| Frontend     | Next.js, React, Juno, TypeScript, Tailwind CSS |
| Backend      | Next.js API Routes, Prisma ORM             |
| Database     | PostgreSQL                                 |
| Auth         | Clerk or Auth.js (optional)                |
| Deployment   | Vercel / Railway / Digital Ocean           |

---

## 📀 Installation & Setup (From Scratch)

### 1️⃣ Prerequisites

- Node.js (v18 or higher) – [Download](https://nodejs.org)
- PostgreSQL (v14 or higher) – [Download](https://www.postgresql.org/)
- Git – [Download](https://git-scm.com/)
- Visual Studio Code or any editor – [Download](https://code.visualstudio.com/)

---

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/harikiranadangi/student-management-system.git
cd student-management-system
```

---

### 3️⃣ Install Dependencies

```bash
npm install
```

---

### 4️⃣ Set Up Environment Variables

Create a `.env` file at the project root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/student_db"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
```

> Replace `user`, `password`, and `student_db` with your PostgreSQL credentials.  
> Create the database manually or via command: `createdb student_db`

---

### 5️⃣ Run Database Migrations

```bash
npx prisma migrate dev --name init
```

---

### 6️⃣ Start the Development Server

```bash
npm run dev
```

Visit the app at: [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

```
student-management-system/
├── .env                     # Environment variables
├── .gitignore              # Git ignore rules
├── next.config.ts          # Next.js config
├── package.json            # NPM scripts and packages
├── prisma/
│   ├── schema.prisma       # Prisma DB schema
│   └── migrations/         # Migration history
├── src/
│   ├── api/                # API routes
│   ├── app/                # Pages and routing
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

---

## 📈 Fee Management & Reports

- **🧾 Fee Ledger**: `/fees/fee_ledger` – View all student fee transactions
- **💳 Individual Fees**: `/fees/[id]` – View fee status for a specific student
- **📄 Reports**: `/reports` – Generate reports (Academic, Attendance, Fee)

---

## 📸 Screenshots

### 🖥 Admin Dashboard
![Admin Dashboard](https://github.com/user-attachments/assets/f3d8ddfb-91c6-42cc-b25a-6dbbca7c1532)

### 🧑‍🎓 Student List
![Student List](https://github.com/user-attachments/assets/a7eebaa5-05cf-4bf6-b79c-4aecca2188cd)

### 💰 Fee Ledger
![Fee Ledger](https://github.com/user-attachments/assets/fee-ledger-example.png)

> **Note**: Screenshots are hosted on GitHub. For public visibility, ensure they are shared in a public repository or static image host.

---

## 💡 Troubleshooting

### ❌ `npm: command not found`
- Ensure Node.js is installed
- Check with `node -v` and `npm -v`

### ❌ Database connection failed
- Check if PostgreSQL is running
- Confirm `.env` credentials are correct
- Run: `pg_isready` to check PostgreSQL status

---

## 🏆 Contributing

We welcome contributions!  
Follow these steps:

```bash
# Fork and clone the repository
git checkout -b feature/your-feature-name
# Make changes and commit
git commit -m "Your descriptive message"
# Push to your fork and submit a PR
```

Refer to `CONTRIBUTING.md` for full guidelines.

---

## 📜 License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for details.

---

## 📧 Contact

- GitHub: [@harikiranadangi](https://github.com/harikiranadangi)
- Email: `harikiranadangi@example.com` (replace with your actual email)

---

## 🤝 Acknowledgments

- **Next.js** – Frontend framework  
- **Prisma** – Database ORM  
- **PostgreSQL** – Relational database  
- **Tailwind CSS** – Styling

---

## 🚀 Deployment Options

This project is ready for deployment using any of the following:

- **Vercel** – [Vercel Docs](https://vercel.com/docs)
- **Railway** – [Railway Docs](https://docs.railway.app/)
- **Digital Ocean** – [Node.js Guide](https://www.digitalocean.com/community/tags/nodejs)

✅ Make sure to set production `.env` values and use a hosted PostgreSQL instance.

---

> 🔧 **Developed by Harikiran | Kotak Salesian School**