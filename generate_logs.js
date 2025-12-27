import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Naprawa braku __dirname w ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// KONFIGURACJA
const TARGET_SIZE_MB = 1024; // Ile MB ma mieć plik (tutaj 1GB)
const FILE_NAME = 'giant_server.log';

const stream = fs.createWriteStream(path.join(__dirname, FILE_NAME));
const services = ['AuthService', 'PaymentGateway', 'Database', 'Frontend-API', 'Worker-Node-05'];
const types = ['INFO', 'INFO', 'INFO', 'WARN', 'DEBUG', 'ERROR']; // Więcej INFO niż ERROR

let currentSize = 0;
const targetBytes = TARGET_SIZE_MB * 1024 * 1024;

console.log(`🚀 Generowanie pliku ${TARGET_SIZE_MB}MB... To może chwilę potrwać.`);

function write() {
  let canContinue = true;
  while (currentSize < targetBytes && canContinue) {
    const date = new Date().toISOString();
    const service = services[Math.floor(Math.random() * services.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const id = Math.floor(Math.random() * 1000000);
    
    let line = `[${date}] [${service}] ${type} Request ID: req_${id} processed in ${Math.floor(Math.random() * 500)}ms`;

    // Dodajemy "bajery" żeby Log Voyager miał się czym wykazać
    if (type === 'ERROR') {
      line += ` - Connection timeout to DB-shard-0${Math.floor(Math.random()*5)} \nStack trace: at com.hsr88.server.Database.connect(Database.java:420)`;
    } else if (Math.random() > 0.8) {
      // Co piąta linia ma JSONa
      const json = JSON.stringify({
        user_id: id,
        action: "click",
        meta: { browser: "Chrome", version: "118.0", mobile: true },
        session_id: `sess_${Math.random().toString(36).substring(7)}`
      });
      line += ` PAYLOAD: ${json}`;
    }

    line += '\n';
    
    const buffer = Buffer.from(line);
    currentSize += buffer.length;
    canContinue = stream.write(buffer);
  }

  if (currentSize < targetBytes) {
    // Jeśli bufor pełny, czekamy na opróżnienie (drain)
    stream.once('drain', write);
  } else {
    stream.end();
    console.log(`✅ Gotowe! Utworzono plik: ${FILE_NAME} (${(currentSize / 1024 / 1024).toFixed(2)} MB)`);
  }
}

write();