import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

if (!CLERK_SECRET_KEY) {
    console.error("Error: Missing Clerk secret key in .env file.");
    process.exit(1);
}

async function deleteAllUsers() {
    try {
        // Fetch all users from Clerk
        const usersResponse = await fetch('https://api.clerk.dev/v1/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const users = await usersResponse.json();

        if (!Array.isArray(users) || users.length === 0) {
            console.log("No users found.");
            return;
        }

        // Loop through each user and delete them
        for (const user of users) {
            const deleteResponse = await fetch(`https://api.clerk.dev/v1/users/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            if (deleteResponse.ok) {
                console.log(`Deleted user: ${user.id}`);
            } else {
                console.error(`Failed to delete user: ${user.id}`);
            }
        }
    } catch (error) {
        console.error("Error deleting users:", error);
    }
}

// Run the function
deleteAllUsers();

// * Run the above code
// * node D:\GITHUB\student-management-system\NewFolder\deleteUsers.js
