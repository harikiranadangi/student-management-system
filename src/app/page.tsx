// app/page.tsx
import AddStudentForm from './components/AddStudentForm';
import StudentsList from './components/StudentsList';

const Home = () => {
    return (
        <div>
            <h1>Add a New Student</h1>
            <AddStudentForm />
            <h2>Student List</h2>
            <StudentsList />
        </div>
    );
};

export default Home;
