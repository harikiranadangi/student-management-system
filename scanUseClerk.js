const fs = require('fs');
const path = require('path');

// Directory to scan
const directoryPath = './src'; // Adjust based on your project structure

// Function to recursively read files in a directory
const readFilesRecursively = (dir, fileList = []) => {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            readFilesRecursively(filePath, fileList);
        } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
            fileList.push(filePath);
        }
    });
    return fileList;
};

// Function to scan a file for specific keywords
const scanFile = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const importsUseClerk = content.includes('useClerk');
    const importsClerkProvider = content.includes('<ClerkProvider');

    return { filePath, importsUseClerk, importsClerkProvider };
};

// Main function to scan all files
const scanForUseClerkErrors = (directoryPath) => {
    const files = readFilesRecursively(directoryPath);
    const results = files.map(scanFile);

    const problematicFiles = results.filter((result) => result.importsUseClerk && !result.importsClerkProvider);

    if (problematicFiles.length > 0) {
        console.log('Files using `useClerk` without `ClerkProvider`:');
        problematicFiles.forEach(({ filePath }) => console.log(`- ${filePath}`));
    } else {
        console.log('No issues found! All `useClerk` usage is within a `ClerkProvider` context.');
    }
};

// Run the script
scanForUseClerkErrors(directoryPath);
