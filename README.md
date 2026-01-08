# TickMark

TickMark provides a professional secure platform combining elite task tracking with a sophisticated and highly organized digital note archive.

## Features

- **Unified Authentication**: Secure JWT-based auth shared across all internal applications.
- **Super JIRA**: Precision task tracking with priority badges and status management.
- **Archive (Notes)**: Advanced note-taking with real-time taxonomy/tag filtering and global search.
- **Premium UI**: Dark-themed aesthetic designed with Tailwind CSS for modern professional workflows.

## Prerequisites

- Node.js (v18+)
- MongoDB Atlas Account (or local MongoDB)

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configuration**
   Create a `.env` file in the root directory and add your credentials:
   ```env
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secure_random_string
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT (JSON Web Tokens) with HttpOnly cookies

---
© 2025 TickMark. All rights reserved.
