# 🎫 SupportFlow — Customer Support Operations Platform

A role-based customer support operations platform built with **React 19, TypeScript, and Vite** to streamline ticket management, customer tracking, and support agent workflows.

<p align="center">
  <a href="https://support-flow-app.vercel.app">
    <img src="https://img.shields.io/badge/Live_Demo-Visit_App-2563EB?style=for-the-badge" />
  </a>
  <a href="https://github.com/vsgopika7/SupportFlow">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" />
  </a>
</p>

---

## 🚀 Live Demo

🔗 **[View SupportFlow Live](https://support-flow-app.vercel.app)**

📂 **[View Source Code on GitHub](https://github.com/vsgopika7/SupportFlow)**

---

## 📌 Overview

SupportFlow is a frontend customer support management application designed to organize support tickets and simplify the workflow between administrators, support agents, and customers.

The platform provides role-based dashboards and tools for managing tickets, tracking their status, assigning agents, and maintaining customer and agent information.

---

## ✨ Features

- **Role-Based Access** — Separate access for Admin, Agent, and Customer roles.
- **Dashboard** — Overview of ticket statistics and support operations.
- **Ticket Management** — Create, view, and manage support tickets.
- **Ticket Assignment** — Assign tickets to support agents.
- **Status Tracking** — Track tickets through Open, Assigned, In Progress, Waiting for Customer, Resolved, and Closed statuses.
- **Priority Management** — Organize tickets according to priority.
- **Customer Management** — View and manage customer information.
- **Agent Management** — Manage support agents and their availability.
- **Search & Filtering** — Find tickets and filter records.
- **Protected Routes** — Restrict application routes based on authentication.
- **Persistent Storage** — Store application data using browser Local Storage.
- **Optimized Loading** — Lazy-load page components using React's `lazy` and `Suspense`.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI development |
| TypeScript | Type safety |
| Vite | Development server and build tool |
| React Router | Routing and navigation |
| Bootstrap | Styling and responsive layout |
| React Hot Toast | Notifications |
| Lucide React | Icons |
| Local Storage | Client-side data persistence |

---

## 👥 User Roles

### Admin
- Monitor support tickets
- Assign tickets to agents
- Manage customers and agents
- Monitor ticket statuses

### Agent
- View assigned tickets
- Update ticket status
- Work on customer support requests

### Customer
- Create support tickets
- View their tickets
- Track ticket progress

---

## 🔄 Ticket Workflow

```text
Ticket Creation
      ↓
     Open
      ↓
Admin Assigns Agent
      ↓
   Assigned
      ↓
  In Progress
      ↓
Waiting for Customer (when needed)
      ↓
   Resolved
      ↓
    Closed
```

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── auth/
│   ├── layout/
│   └── ui/
├── context/
├── hooks/
├── pages/
│   ├── agents/
│   ├── auth/
│   ├── customers/
│   ├── dashboard/
│   ├── settings/
│   └── tickets/
├── routes/
├── types/
├── App.tsx
└── main.tsx
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js
- npm
- Git

### Clone the repository

```bash
git clone https://github.com/vsgopika7/SupportFlow.git
```

### Navigate into the project

```bash
cd SupportFlow
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

---

## 🏗️ Production Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## ⚡ Performance Optimizations

- Memoized derived data using `useMemo`.
- Reduced redundant filtering and calculations.
- Efficient ticket and agent count calculations.
- Route-based lazy loading.
- Suspense loading fallback for lazy-loaded pages.

---

## 🔮 Future Enhancements

- Backend API integration
- Database-based persistence
- Real-time notifications
- Advanced analytics
- Improved ticket reporting

---

## 👩‍💻 Author

**Gopika V**

GitHub: [@vsgopika7](https://github.com/vsgopika7)

---

<p align="center">
  Built with ❤️ using React and TypeScript
</p>
