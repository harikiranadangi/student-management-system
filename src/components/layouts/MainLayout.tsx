// src/components/layouts/MainLayout.tsx

import React from 'react';
import Head from 'next/head';

// Define the props interface for the MainLayout component
interface MainLayoutProps {
    title?: string; // Optional title prop
    children: React.ReactNode; // Required children prop
}

const MainLayout: React.FC<MainLayoutProps> = ({ title, children }) => {
    return (
        <div>
            <Head>
                <title>{title || 'Kotak Salesian School'}</title>
                <meta name="description" content="A description of your app" />
            </Head>
            <header>
                <nav>
                    <h1>Kotak Salesian School</h1>
                </nav>
            </header>
            <main>
                {children}
            </main>
            <footer>
                <p>© {new Date().getFullYear()} My Application. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default MainLayout;
