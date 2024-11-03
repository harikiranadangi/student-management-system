// src/app/students/page.tsx

import StudentsList from '@/components/StudentsList';
import MainLayout from '@/components/layouts/MainLayout';

const StudentsPage = () => {
    return (
        <MainLayout title="Students List">
            <h2>Students List</h2>
            <StudentsList />
        </MainLayout>
    );
};

export default StudentsPage;
