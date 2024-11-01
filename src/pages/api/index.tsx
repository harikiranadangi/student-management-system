// pages/index.tsx
import UploadForm from '../components/UploadForm';
import StudentsList from '../components/StudentsList';

const Home = () => {
    return (
        <div>
            <h1>Student Management System</h1>
            <UploadForm />
            <h2>Students List</h2>
            <StudentsList />
        </div>
    );
};

export default Home;
