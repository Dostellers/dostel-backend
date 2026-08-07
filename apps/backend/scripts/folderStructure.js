const fs = require('fs');
const path = require('path');

const EXCLUDED_DIRS = ['node_modules', '.git', 'scripts'];
const EXCLUDED_FILES = ['.DS_Store'];

function getFolderStructure(dir, indent = '') {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        if (EXCLUDED_DIRS.includes(file) || EXCLUDED_FILES.includes(file)) {
            continue;
        }

        const filePath = path.join(dir, file);
        console.log(indent + file);

        if (fs.statSync(filePath).isDirectory()) {
            getFolderStructure(filePath, indent + '  ');
        }
    }
}

const directoryToScan = path.join(__dirname, '..');  // This will start scanning from the parent directory of the scripts folder
getFolderStructure(directoryToScan);
