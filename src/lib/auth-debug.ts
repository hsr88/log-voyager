
/**
 * Simple debug logger for Authentication flow.
 * View these in your browser console (F12).
 */
export const authLog = (message: string, data?: any) => {
    const timestamp = new Date().toISOString().split('T')[1].split('Z')[0];
    const prefix = `[AuthDebug ${timestamp}]`;
    if (data) {
        console.log(`${prefix} ${message}`, data);
    } else {
        console.log(`${prefix} ${message}`);
    }
};
