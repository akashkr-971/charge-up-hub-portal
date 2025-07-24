# EV Charge

An end-to-end EV charging station management and booking platform.

## Features

- User registration and login
- Vehicle registration and management
- Real-time charging station listing (fetched from MySQL database)
- Slot booking for charging stations
- Feedback and review system (with star ratings and comments)
- Admin dashboard:
  - View, add, update, and delete charging stations
  - View all users, vehicles, and reviews
  - Add new stations with a modern UI
  - Inline editing and deletion for stations
  - Logout option for admin
- Responsive, modern UI with custom color palette

## Tech Stack

- **Frontend:** React (TypeScript), Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MySQL

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MySQL server

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/flipantbugbear/charge-up-hub-portal.git
   cd charge-up-hub-portal
   ```

2. **Install dependencies:**

   ```bash
   npm install
   cd backend && npm install
   ```

3. **Configure the database:**

   - Create a MySQL database (e.g., `evstation`).
   - Run the SQL in `backend/schema.sql` to create tables.
   - Update `backend/db.js` with your MySQL credentials.

4. **Start the backend server:**

   ```bash
   cd backend
   node server.js
   ```

5. **Start the frontend:**

   ```bash
   cd ..
   npm run dev
   ```

6. **Access the app:**
   - User portal: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## Usage

- Register as a user and add your vehicle.
- Browse and book slots at available charging stations.
- Leave feedback and reviews after charging.
- Admins can log in to manage stations, users, vehicles, and reviews.

## Folder Structure

- `src/` - Frontend React app
- `backend/` - Express.js backend and database scripts
- `public/` - Static assets

## License

MIT
