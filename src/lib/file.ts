import { readdir, readFile } from 'fs/promises';

export async function listDirectory(directory: string): Promise<string[]> {
    return await readdir(directory);
}

export async function read(fileName: string): Promise<string> {
    const file = await readFile(fileName);
    return file.toString();
}