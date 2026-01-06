[![GitHub stars](https://img.shields.io/github/stars/hsr88/log-voyager?style=social)](https://github.com/hsr88/log-voyager)

🚀 Log Voyager

The missing tool for DevOps and Backend Developers. Analyze gigabyte-sized log files instantly in your browser without crashing your device.

![1764963938364](https://github.com/user-attachments/assets/910d1ed8-abd5-43c2-9e57-85102be09188)


🔴 Live Demo

Use the application instantly (no installation required):

👉 https://www.logvoyager.cc

⚡ Key Features

* **🔍 Smart Search 2.0:**
    * **Case Sensitivity:** Toggle precision search (e.g., match "Error" but ignore "error").
    * **Navigation:** Jump between matches instantly using Next/Prev buttons.
    * **Search History:** Auto-saves your last 10 queries for quick access.
* **⚡ Infinity Scroll Engine:** Open files larger than **10GB** instantly using File Slicing API.
* **🛡️ Privacy First:** 100% Local Execution. Files never leave your device.
* **🎨 JSON Prettifier:** Automatically detects and formats JSON objects.
* **📍 Warp Jump Bookmarks:** Mark important lines and "warp" between them instantly.
* **📱 Zero Install:** Works on Desktop, Mobile (Android/iOS), and Tablets.

🛠️ How It Works

Traditional editors (Notepad++, VS Code) try to load the entire file into RAM. If a file is larger than your available memory, the application crashes.

Log Voyager acts like a video streaming service but for text:

It creates a virtual map of the file.

It reads only a tiny buffer (50KB) corresponding to the scrollbar position.

When you scroll or jump, the old buffer is discarded, and a new one is read from the disk.

This ensures consistent performance whether the file is 5MB or 50GB.

🐳 Run Locally (Docker)

For enterprise environments with strict security policies (air-gapped networks), you can run Log Voyager as a self-hosted container.

Prerequisites

Docker installed

Quick Start

Clone the repository:
```
git clone [https://github.com/hsr88/log-voyager.git](https://github.com/hsr88/log-voyager.git)
cd log-voyager
```

Build the image:
```
docker build -t log-voyager .
```

Run the container:
```
docker run -d -p 8080:80 --name my-logs log-voyager

```
Access the app:
Open your browser and navigate to: http://localhost:8080

💻 Development

If you want to contribute or modify the source code:

Install dependencies:
```
npm install

```
Start development server:
```
npm run dev
```

Build for production:
```
npm run build
```

🛡️ Security Note

Although this is a web application, it functions as a static tool. Once loaded:

It does not require an internet connection (works offline).

It does not send analytics or file content to any external server.

It uses standard HTML5 File APIs strictly within the browser context.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/G2G11RAU3K)

```
© 2025-26 logvoyager.cc | Created by hsr88
```
