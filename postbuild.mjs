import fs from 'fs';
fs.cpSync('dist/client', 'dist_temp', { recursive: true });
fs.rmSync('dist', { recursive: true, force: true });
fs.renameSync('dist_temp', 'dist');
