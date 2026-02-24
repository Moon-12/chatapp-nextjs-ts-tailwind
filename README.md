
---

**Repository:** `chatapp-nextjs-ts-tailwind`

```md
# Real-Time Chat Frontend (Next.js + TypeScript)

This repository contains the frontend for a real-time, group-based chat application built using **Next.js**, **TypeScript**, and **Tailwind CSS**. The UI is designed to be highly responsive, reactive, and optimized for real-time updates streamed from the backend via Server-Sent Events (SSE).

## 🚀 Project Overview

The frontend provides an interactive chat experience with dynamic group management, real-time message updates, and presence-aware UI behavior. It communicates with a Spring Boot backend that streams messages efficiently using SSE.

---

## 🧩 Architecture

- **Framework:** Next.js (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React state + effects
- **Messaging:** Server-Sent Events (SSE)

The UI is designed to handle:
- Continuous message streams
- Group membership updates
- Real-time UI refresh without polling

---

## 🔑 Core Features

- **Group-Based Chat UI**
  - Request to join groups
  - Await admin approval
  - Access chat only after approval

- **Real-Time Messaging**
  - Messages streamed live using SSE
  - Automatic UI updates without page reloads

- **Reactive Interface**
  - Dynamic message lists
  - User presence awareness
  - Optimized rendering for frequent updates

- **Scalable UI Design**
  - Efficient handling of continuous message streams
  - Clean separation of UI and service logic

---

## 🛠️ Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Server-Sent Events (SSE)

---

## ⚙️ Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/Moon-12/chatapp-nextjs-ts-tailwind
   cd chatapp-nextjs-ts-tailwind
