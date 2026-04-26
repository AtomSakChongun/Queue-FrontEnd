# Queue App 🎫

ระบบจัดการคิวแบบ Real-time สำหรับ Kiosk โดยใช้ Angular และ WebSocket

---

## Features

- **รับบัตรคิว** — กดรับคิวผ่านหน้าจอ Kiosk
- **Real-time Queue Update** — อัปเดตหมายเลขคิวแบบ Real-time ผ่าน WebSocket
- **รับคิวถัดไป** — เรียกคิวถัดไปได้ทันที
- **Reset คิว** — ล้างคิวทั้งหมดได้จากหน้าจอ
- **ตั้งค่าหมายเลขเครื่อง** — กำหนด Machine ID สำหรับแต่ละเครื่อง Kiosk
- **Auto Reconnect** — WebSocket เชื่อมต่อใหม่อัตโนมัติเมื่อหลุด

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | Angular 21, TypeScript, RxJS      |
| Styling   | SCSS, Tailwind CSS 4              |
| Transport | WebSocket (`ws://localhost:3000/ws`) |
| Server    | Nginx (production)                |
| Container | Docker, Docker Compose            |

---

## Prerequisites

- [Node.js](https://nodejs.org/) v22+
- [Docker](https://www.docker.com/) (สำหรับ deploy ด้วย container)
- Backend WebSocket server ที่รันอยู่บน `ws://localhost:3000/ws`

---

## Getting Started

### Development

```bash
npm install
npm start
```

เปิดเบราว์เซอร์ที่ `http://localhost:4200`

### Build

```bash
npm run build
```

ไฟล์ที่ build แล้วจะอยู่ใน `dist/queue-app/browser/`

---

## Docker

### Build & Run ด้วย Docker Compose

```bash
docker-compose up -d
```

แอปจะรันที่ `http://localhost:4200`

### Build Image เอง

```bash
docker build -t queue-app .
docker run -p 4200:80 queue-app
```

> **หมายเหตุ:** Nginx จะ proxy WebSocket request จาก `/ws` ไปยัง `host.docker.internal:3000/ws` โดยอัตโนมัติ

---

## Project Structure

```
src/
├── app/
│   ├── page/
│   │   └── homepage/
│   │       ├── homepage.component.*     # หน้าหลัก Kiosk
│   │       └── component/
│   │           └── queue.component.*    # แสดงหมายเลขคิวและ actions
│   ├── app.routes.ts
│   └── app.config.ts
└── service/
    └── socket.service.ts                # WebSocket service (take / reset)
```

---

## WebSocket Protocol

Service ส่ง payload ไปยัง backend ในรูปแบบ:

```json
{ "client_id": "01", "action": "take" }
{ "client_id": "01", "action": "reset" }
```

Backend ตอบกลับในรูปแบบ:

```json
{ "queue": "42" }
```

---

## Configuration

### Machine ID

กดไอคอน มุมบนขวาของหน้าจอเพื่อตั้งค่า Machine ID (ค่าเริ่มต้น: `01`)

### WebSocket URL

แก้ไข URL ใน `src/service/socket.service.ts`:

```typescript
this.socket = new WebSocket('ws://localhost:3000/ws');
```
