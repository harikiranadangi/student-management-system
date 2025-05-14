import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

if (!CLERK_SECRET_KEY) {
    console.error("Error: Missing Clerk secret key in .env file.");
    process.exit(1);
}

async function fetchAllUsers() {
    let users = [];
    let offset = 0;
    const limit = 100; // Clerk allows up to 100 users per request

    while (true) {
        const response = await fetch(`https://api.clerk.dev/v1/users?limit=${limit}&offset=${offset}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            break; // No more users left to fetch
        }

        users = users.concat(data);
        offset += limit; // Move to the next batch
    }

    return users;
}

async function deleteAllUsersExceptAdmins() {
    try {
        const users = await fetchAllUsers();

        if (users.length === 0) {
            console.log("No users found.");
            return;
        }

        for (const user of users) {
            // Check if the user has the "admin" role in public_metadata
            const isAdmin = user.public_metadata?.role === "admin";

            if (isAdmin) {
                console.log(`Skipping admin: ${user.id}`);
                continue; // Skip deletion
            }

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

deleteAllUsersExceptAdmins();

// * Run the above code
// * node scripts\deleteUsers.js
