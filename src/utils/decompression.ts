/**
 * Decompresses a GZIP file using the browser's native DecompressionStream API.
 * Fallback logic isn't strictly necessary for modern browsers, but we handle errors gracefully.
 */
export async function decompressGzip(file: File): Promise<string> {
    if (!('DecompressionStream' in window)) {
        throw new Error('Your browser does not support GZIP decompression. Please use a modern browser (Chrome, Edge, Firefox).');
    }

    const ds = new DecompressionStream('gzip');
    const stream = file.stream().pipeThrough(ds);
    const response = new Response(stream);

    // Get text content
    // Note: This loads the whole decompressed file into memory. 
    // For truly huge regular files (GBs), we might want to verify size limits,
    // but browsers handle blobs/text relatively well up to a few hundred MBs.
    // "Huge logs" usually compress well (10:1), so a 100MB .gz could be 1GB text.
    // We might hit string length limits in JS (approx 512MB-1GB depending on engine).
    // For MVP this is acceptable.
    return await response.text();
}

/**
 * Checks if a file is likely GZIP based on extension or magic bytes.
 */
export async function isGzip(file: File): Promise<boolean> {
    // Check extension first
    if (file.name.endsWith('.gz') || file.type === 'application/gzip' || file.type === 'application/x-gzip') {
        return true;
    }

    // Check magic bytes (1F 8B)
    // We read the first 2 bytes
    try {
        const buffer = await file.slice(0, 2).arrayBuffer();
        const bytes = new Uint8Array(buffer);
        return bytes[0] === 0x1f && bytes[1] === 0x8b;
    } catch (e) {
        return false;
    }
}
