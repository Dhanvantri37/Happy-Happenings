# 🎵 Happy Happenings Music

> India's premier music event management & ticket booking platform

A full-stack MERN web application built for **HappyHappeningsMusic** — supporting concerts, DJ nights, festivals, open mics, free events, artist profiles, QR-coded tickets, and a powerful admin panel.

---

## 📁 Project Structure

```
happy-happenings-music/
├── docker-compose.yml          ← Run everything with one command
├── package.json                ← Root convenience scripts
│
├── server/                     ← Node.js + Express API
│   ├── Dockerfile
│   ├── index.js                ← Entry point
│   ├── seed.js                 ← Demo data seeder
│   ├── .env.example
│   ├── models/
│   │   ├── User.js
│   │   ├── Artist.js
│   │   ├── Event.js
│   │   ├── Booking.js
│   │   └── Review.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── bookingController.js
│   │   ├── artistController.js
│   │   ├── paymentController.js
│   │   ├── adminController.js
│   │   └── wishlistController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── events.js
│   │   ├── bookings.js
│   │   ├── artists.js
│   │   ├── payments.js
│   │   ├── admin.js
│   │   └── wishlist.js
│   ├── middleware/
│   │   └── auth.js
│   └── public/
│       └── logo.jpeg
│
└── client/                     ← React + Vite + Tailwind CSS
    ├── Dockerfile
    ├── nginx.conf
    ├── .env.example
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── index.css
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── utils/
    │   │   ├── api.js
    │   │   └── logo.js             ← Base64 logo (auto-generated)
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── EventCard.jsx
    │   │   └── AdminSidebar.jsx
    │   └── pages/
    │       ├── Home.jsx
    │       ├── Events.jsx
    │       ├── EventDetail.jsx
    │       ├── BookingPage.jsx
    │       ├── MyBookings.jsx
    │       ├── Wishlist.jsx
    │       ├── Profile.jsx
    │       ├── Artists.jsx
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       └── admin/
    │           ├── AdminDashboard.jsx
    │           ├── AdminEvents.jsx
    │           ├── AdminArtists.jsx
    │           ├── AdminBookings.jsx
    │           └── AdminUsers.jsx
```

---

## 🚀 Option A — Run with Docker (Recommended, Zero Config)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed & running

### Steps

```bash
# 1. Unzip the project
unzip happy-happenings-music.zip
cd happy-happenings-music

# 2. Start everything (MongoDB + Server + Client)
docker-compose up --build
```

That's it! Open your browser:

| Service  | URL                      |
|----------|--------------------------|
| 🌐 Website | http://localhost:3000  |
| ⚙️ API    | http://localhost:5000   |

> The database is **automatically seeded** with 10 events, 6 artists, and demo accounts on first start.

### Stop Docker
```bash
docker-compose down
```

### Reset everything (wipe DB + rebuild)
```bash
docker-compose down -v && docker-compose up --build
```

---

## 💻 Option B — Run Locally (Manual Setup)

### Prerequisites
- Node.js v18+ → https://nodejs.org
- MongoDB running locally → https://www.mongodb.com/try/download/community

### Step 1 — Install dependencies

```bash
# From the project root
cd server && npm install
cd ../client && npm install
```

### Step 2 — Configure backend environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
MONGO_URI=mongodb://localhost:27017/happyhappenings
JWT_SECRET=any_long_random_string_change_this
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx    # leave as-is for demo mode
RAZORPAY_KEY_SECRET=your_secret        # leave as-is for demo mode
PORT=5000
CLIENT_URL=http://localhost:5173
```

### Step 3 — Seed the database

```bash
cd server
node seed.js
```

You'll see:
```
✅ MongoDB connected
🧹 Cleared
👥 Users seeded
🎤 Artists seeded
🎪 Events seeded
🎫 Bookings seeded
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Seed complete!
🔑 Admin  → admin@happyhappenings.music / admin123
👤 User 1 → arjun@example.com / user123
```

### Step 4 — Start the backend (Terminal 1)

```bash
cd server
npm run dev
# Server running → http://localhost:5000
```

### Step 5 — Start the frontend (Terminal 2)

```bash
cd client
npm run dev
# Frontend running → http://localhost:5173
```

### Open the app
Visit **http://localhost:5173**

---

## 🔑 Demo Credentials

| Role    | Email                             | Password  |
|---------|-----------------------------------|-----------|
| ⚙️ Admin | admin@happyhappenings.music       | admin123  |
| 👤 User  | arjun@example.com                 | user123   |
| 👤 User  | priya@example.com                 | user123   |
| 👤 User  | rohan@example.com                 | user123   |

---

## 🎭 Features

### User Features
| Feature | Description |
|---------|-------------|
| 🔐 Auth | Register, Login, Logout with JWT |
| 🎪 Events | Browse all events with search + category filters |
| 🆓 Free Events | Book free events with zero payment |
| 💳 Paid Booking | Multi-tier ticket selection + Razorpay payment |
| 🎫 QR Tickets | Auto-generated QR code for every booking |
| ❤️ Wishlist | Save favourite events |
| 📋 My Bookings | View all bookings + QR codes, cancel bookings |
| 🎤 Artists | Browse all artist profiles |
| ⭐ Reviews | Rate and review events you attended |
| 👤 Profile | Edit name, phone number |

### Admin Features
| Feature | Description |
|---------|-------------|
| 📊 Dashboard | Revenue, ticket sales, monthly trends, top events |
| 🎪 Event CRUD | Create/Edit/Delete events with multiple ticket tiers |
| 🎤 Artist CRUD | Create/Edit/Delete artist profiles |
| 🎫 All Bookings | View all bookings with filters by payment status |
| 🔍 Ticket Scanner | Validate tickets at venue by Booking ID |
| 👥 Users | View all registered users |

---

## 🌐 API Reference

### Auth
```
POST   /api/auth/register      Register new user
POST   /api/auth/login         Login (returns JWT)
GET    /api/auth/me            Get current user [🔒]
PUT    /api/auth/profile       Update profile [🔒]
```

### Events
```
GET    /api/events             List events (filters: category, search, isFree, city)
GET    /api/events/:id         Get event + reviews
POST   /api/events             Create event [🔒 Admin]
PUT    /api/events/:id         Update event [🔒 Admin]
DELETE /api/events/:id         Delete event [🔒 Admin]
POST   /api/events/:id/reviews Add review [🔒]
```

### Bookings
```
POST   /api/bookings              Create booking [🔒]
GET    /api/bookings/user         My bookings [🔒]
GET    /api/bookings/all          All bookings [🔒 Admin]
POST   /api/bookings/validate/:id Validate ticket [🔒 Admin]
PUT    /api/bookings/cancel/:id   Cancel booking [🔒]
```

### Artists
```
GET    /api/artists           List all artists
GET    /api/artists/:id       Get artist
POST   /api/artists           Create [🔒 Admin]
PUT    /api/artists/:id       Update [🔒 Admin]
DELETE /api/artists/:id       Delete [🔒 Admin]
```

### Payments
```
POST   /api/payments/create-order  Create Razorpay order [🔒]
POST   /api/payments/verify        Verify payment signature [🔒]
```

### Wishlist
```
GET    /api/wishlist           Get my wishlist [🔒]
POST   /api/wishlist/toggle    Add/remove event [🔒]
```

### Admin
```
GET    /api/admin/analytics    Revenue & stats [🔒 Admin]
GET    /api/admin/users        All users [🔒 Admin]
```

---

## 💳 Payment Integration

### Demo Mode (default — no setup needed)
Payments are **auto-confirmed** without any Razorpay account. The full booking flow works perfectly for testing.

### Real Razorpay Test Mode
1. Create account at https://razorpay.com
2. Go to **Settings → API Keys → Generate Test Key**
3. Add to `server/.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_your_actual_key
   RAZORPAY_KEY_SECRET=your_actual_secret
   ```
4. Add to `client/.env`:
   ```env
   VITE_RAZORPAY_KEY_ID=rzp_test_your_actual_key
   ```
5. Use test card: `4111 1111 1111 1111` | Any future expiry | Any CVV

---

## 🛠️ Tech Stack

| Layer        | Technology                            |
|--------------|---------------------------------------|
| Frontend     | React 18, Vite, Tailwind CSS          |
| Backend      | Node.js, Express.js                   |
| Database     | MongoDB, Mongoose                     |
| Auth         | JWT (jsonwebtoken), bcryptjs          |
| Payments     | Razorpay SDK                          |
| QR Codes     | qrcode npm package                    |
| Routing      | React Router v6                       |
| HTTP Client  | Axios                                 |
| Toasts       | react-hot-toast                       |
| Deployment   | Docker, Docker Compose, Nginx         |

---

## 🐛 Troubleshooting

**Cannot login as admin?**
> Make sure you ran `node seed.js` first. The seed uses `User.create()` so passwords are hashed exactly once.

**MongoDB connection failed?**
> Ensure MongoDB is running: `mongod` or use MongoDB Atlas and update `MONGO_URI`.

**Port already in use?**
> Change `PORT` in `server/.env` or ports in `docker-compose.yml`.

**Docker build fails?**
> Run `docker-compose down -v` then `docker-compose up --build` again.

---

## 📞 Contact

- 📸 Instagram: [@happyhappeningsmusic](https://www.instagram.com/happyhappeningsmusic?igsh=MXI1Z2U3ZHloNGZkaA==)
- 📧 Email: admin@happyhappenings.music

---

*Built with ❤️ for Happy Happenings Music*
