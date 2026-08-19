# Kavach - Personal Safety Assistant

Kavach is a comprehensive personal safety application designed to provide users with quick access to emergency services and tools. It serves as a smart, dynamic assistant tailored to enhance user safety and security.

## 🎯 Chosen Vertical
**Personal Safety and Emergency Assistance**
Kavach is built to address the critical need for immediate response and support during personal emergencies. It acts as an intelligent safety companion that users can rely on for rapid assistance, SOS alerts, and proactive safety tracking.

## 🧠 Approach and Logic
The application is designed as a full-stack monorepo with a distinct separation of concerns to ensure maintainability and high performance:
- **Frontend (Next.js)**: A responsive, accessible, and intuitive web interface providing users with immediate access to safety tools, even in high-stress situations.
- **Backend (Express/Node.js)**: A robust API that handles user requests, intelligent alert routing, and secure data processing.
- **Database (Neon Serverless Postgres via Drizzle ORM)**: A scalable, low-latency database solution for storing user profiles, emergency contacts, and incident logs.

Our core logic prioritizes **speed, accessibility, and reliability**. When a user triggers an emergency action, the system efficiently routes the request through the backend to notify relevant contacts and services without delay, applying contextual decision-making.

## ⚙️ How the Solution Works
1. **User Configuration**: Users set up their profiles, defining trusted emergency contacts and specific safety preferences.
2. **Safety Dashboard**: The web app provides a central interface where users can quickly trigger SOS alerts, share real-time locations, or access local safety resources.
3. **Smart Alerting System**: The backend processes incoming alerts and applies dynamic logic based on the user's context (e.g., location, time, severity) to determine the most effective notification strategy.
4. **Secure Data Logging**: All critical data and alert histories are securely persisted in the PostgreSQL database, ensuring availability for authorities or trusted contacts if required.

## 📝 Assumptions Made
- **Active Connectivity**: The user must have an active internet connection (Wi-Fi or cellular data) to send alerts and access the web application.
- **Device Capabilities**: The user's device supports modern web APIs, specifically the Geolocation API, for accurate location tracking during emergencies.
- **Third-Party Reliability**: The system assumes high uptime for any integrated third-party SMS/Email notification gateways.
- **Database Accessibility**: Assumes the Neon serverless database remains highly available with minimal latency to handle rapid concurrent requests.

---

## Setup & Local Development

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Setup environment variables:**
   Create a `.env` file based on your configuration requirements.

3. **Run development server:**
   ```bash
   pnpm run dev
   ```
   This will start both the web frontend and API backend simultaneously.

## Workspace Structure

- `apps/web`: Next.js web application
- `apps/api`: Express/Node.js API
- `packages/db`: Shared database schema and utilities

## Scripts

- `pnpm run dev`: Start all apps
- `pnpm run build`: Build all apps
- `pnpm run lint`: Lint workspace
- `pnpm run test`: Run tests
