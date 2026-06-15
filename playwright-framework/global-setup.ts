import * as fs from 'fs';
import * as path from 'path';

const FILE_LIMIT = 30;

function cleanupFolder(folderPath: string): void {
  if (!fs.existsSync(folderPath)) return;

  const entries = fs.readdirSync(folderPath)
    .map(name => {
      const fullPath = path.join(folderPath, name);
      return {
        name,
        fullPath,
        mtime: fs.statSync(fullPath).mtimeMs,
      };
    })
    .sort((a, b) => a.mtime - b.mtime);

  if (entries.length > FILE_LIMIT) {
    const toDelete = entries.slice(0, entries.length - FILE_LIMIT);
    for (const entry of toDelete) {
      const stat = fs.statSync(entry.fullPath);
      if (stat.isDirectory()) {
        fs.rmSync(entry.fullPath, { recursive: true });
      } else {
        fs.unlinkSync(entry.fullPath);
      }
      console.log(`[Cleanup] Removed old report file: ${entry.name}`);
    }
  }
}

export default async function globalSetup(): Promise<void> {
  const root = path.resolve(__dirname);
  cleanupFolder(path.join(root, 'allure-results'));
  cleanupFolder(path.join(root, 'test-results'));
  cleanupFolder(path.join(root, 'screenshots'));
}
