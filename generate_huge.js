import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- KONFIGURACJA ---
const TARGET_SIZE_GB = 5; // Ile GB chcesz? (Dla wideo 5GB to aż nadto)
const FILE_NAME = 'production_crash.log';

// Setup ścieżek dla ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, FILE_NAME);

// Strumień z powiększonym buforem dla szybkości
const stream = fs.createWriteStream(filePath, { highWaterMark: 1024 * 1024 }); // 1MB buffer

const TARGET_BYTES = TARGET_SIZE_GB * 1024 * 1024 * 1024;
let currentBytes = 0;
let lastLogTime = Date.now();

console.log(`🚀 Start: Generowanie pliku ${TARGET_SIZE_GB} GB...`);
console.log(`📂 Plik: ${filePath}`);

// Dane do losowania
const levels = ['INFO', 'INFO', 'INFO', 'WARN', 'DEBUG', 'ERROR'];
const services = ['Auth-Service', 'Payment-Gateway', 'Database-Shard-01', 'Frontend-SSR', 'Worker-Node-Alpha'];
const errors = [
    'Connection refused by 10.0.0.5:5432',
    'NullPointerException at com.hsr88.app.User.login(User.java:420)',
    'Timeout waiting for lock: table "orders"',
    'Disk quota exceeded on /var/log',
    'Unexpected token < in JSON at position 0'
];

function generateLine() {
    const date = new Date().toISOString();
    const level = levels[Math.floor(Math.random() * levels.length)];
    const service = services[Math.floor(Math.random() * services.length)];

    let msg = `[${date}] [${service}] [${level}] Processing request req_${Math.floor(Math.random() * 10000000)}`;

    // Co 10 linia ma JSON (żebyś mógł pokazać ficzer JSON Prettifier)
    if (Math.random() > 0.9) {
        const json = JSON.stringify({
            userId: Math.floor(Math.random() * 5000),
            action: "checkout",
            cart: [{ id: "item_1", qty: 2 }, { id: "item_55", qty: 1 }],
            meta: { ip: "192.168.1.1", browser: "Chrome/120.0" }
        });
        msg += ` PAYLOAD: ${json}`;
    }

    // Co 20 linia to Błąd (żebyś pokazał czerwone podświetlenie)
    if (level === 'ERROR') {
        msg += ` - ${errors[Math.floor(Math.random() * errors.length)]}`;
    }

    return msg + '\n';
}

function write() {
    let canContinue = true;

    while (currentBytes < TARGET_BYTES && canContinue) {
        // Generujemy "blok" danych zamiast pojedynczej linii dla wydajności
        let chunk = '';
        for (let i = 0; i < 1000; i++) {
            chunk += generateLine();
        }

        const buffer = Buffer.from(chunk);
        currentBytes += buffer.length;

        // Zapisujemy i sprawdzamy czy bufor jest pełny
        canContinue = stream.write(buffer);

        // Logowanie postępu co 100MB (żebyś wiedział, że działa)
        if (Date.now() - lastLogTime > 1000) {
            const progress = (currentBytes / TARGET_BYTES) * 100;
            console.log(`⏳ Postęp: ${progress.toFixed(1)}% (${(currentBytes / 1024 / 1024).toFixed(0)} MB)`);
            lastLogTime = Date.now();
        }
    }

    if (currentBytes < TARGET_BYTES) {
        // Jeśli bufor pełny, czekamy na "drain" (opróżnienie) i piszemy dalej
        stream.once('drain', write);
    } else {
        stream.end();
        console.log('✅ ZAKOŃCZONO! Twój gigantyczny plik jest gotowy.');
    }
}

write();