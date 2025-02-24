import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();

async function seedStudents() {
  const students: any[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, 'students.csv'))
      .pipe(csvParser())
      .on('data', (row) => {
        students.push({
          id: row.id,
          username: row.username,
          name: row.name,
          surname: row.surname,
          parentName: row.parentName,
          email: row.email,
          phone: row.phone,
          address: row.address,
          img: row.img || null,
          bloodType: row.bloodType,
          gender: row.gender,
          dob: new Date(row.dob),
          classId: Number(row.classId),
          gradeId: Number(row.gradeId),
        });
      })
      .on('end', async () => {
        await prisma.student.createMany({
          data: students,
          skipDuplicates: true,
        });
        console.log('✅ Bulk Student Data Uploaded Successfully!');
        resolve();
      })
      .on('error', reject);
  });
}

seedStudents()
  .catch((e) => {
    console.error('❌ Error seeding students:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
