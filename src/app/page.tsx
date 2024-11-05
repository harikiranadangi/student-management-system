// app/page.tsx
import Link from 'next/link';

const Home = () => {
    return (
        <div>
            <h1>Welcome to the Student Management System</h1>
            <nav>
                <ul>
                    <li>
                        <Link href="/students">View Students</Link>
                    </li>
                    <li>
                        <Link href="/students/add">Add Student</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Home;
