# 🌿 SaverFwd

**Give Extra Food a Second Chance.**

SaverFwd is a food waste reduction platform that connects people who have excess food with those who can use it — either for free (donations) or at reduced prices. Built with a Spring Boot backend and a React frontend.

---

## 📋 Features

- **User Authentication** — Register, login, JWT-based session management with refresh tokens
- **Food Listings** — Create, browse, filter, and manage food listings with details like type, quantity, pricing, pickup location, and expiry
- **Donation & Sale** — List food as free donations or sell at reduced prices
- **Order Management** — Claim or purchase food, track order status through the full lifecycle
- **Browse & Filter** — Search by title, filter by food type, listing type, price range, and status
- **My Listings** — Manage your own food listings with status updates (available → reserved → sold/expired)
- **Responsive Design** — Mobile-first UI with bottom navigation, tablet hamburger menu, and desktop nav
- **Profile** — View your account info, stats, and activity

---

## 🏗️ Architecture

```
saverfwd/
├── backend/          # Spring Boot 4.1.1 (Java 25)
│   ├── auth/         # Authentication, JWT, security
│   ├── food/         # Food listing CRUD, filtering
│   ├── order/        # Order management, status tracking
│   ├── user/         # User profiles, filtering
│   └── common/       # Shared entities, exceptions, utilities
│
└── frontend/         # React 19 + Vite 8
    └── src/
        ├── api/          # Axios client, API modules (auth, food, order, user)
        ├── components/   # Reusable UI components
        │   ├── common/   # Button, Input, Badge, Card, Modal, Toast, etc.
        │   ├── food/     # FoodCard
        │   └── layout/   # Header, Footer, AppLayout
        ├── context/      # AuthContext, ToastContext
        ├── hooks/        # useApi custom hook
        ├── pages/        # All route pages
        ├── styles/       # CSS variables, global styles
        └── utils/        # Constants, formatters, validators
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 25+**
- **Node.js 18+** and npm
- **MySQL 8+** running on `localhost:3306`
- **Redis** running on `localhost:6379`

### Database Setup

Create the MySQL database:

```sql
CREATE DATABASE saverfwd;
```

The app uses `ddl-auto: update`, so tables are created automatically on first run.

### Backend

```bash
cd backend

# Build
./mvnw clean package -DskipTests

# Run (port 8000)
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (port 5173, proxies /api to backend)
npm run dev
```

The frontend proxies all `/api` requests to `http://localhost:8000` via Vite's dev server.

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register a new user | No |
| POST | `/login` | Login (email/phone + password) | No |
| POST | `/refresh` | Refresh access token | No |
| GET | `/me` | Get current user | Yes |
| POST | `/logout` | Logout current session | Yes |
| POST | `/logout-all` | Logout all sessions | Yes |

### Food (`/api/food`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create food listing | Yes |
| GET | `/` | List food (filtered, paginated) | Yes |
| GET | `/{id}` | Get food by ID | Yes |
| PUT | `/{id}` | Update food listing | Yes |
| PATCH | `/{id}/status` | Update food status | Yes |
| GET | `/my-listings` | Get current user's listings | Yes |
| POST | `/bulk` | Create multiple listings | Yes |

### Orders (`/api/order`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Place an order | Yes |
| GET | `/` | List orders (filtered, paginated) | Yes |
| GET | `/{orderId}` | Get order by ID | Yes |
| PATCH | `/{orderId}/status` | Update order status | Yes |

### Users (`/api/users`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List users (filtered, paginated) | Yes |
| DELETE | `/{userId}` | Delete a user | Yes |

---

## 🎨 Design System

The frontend uses a custom CSS design system built on CSS custom properties:

- **Colors** — Green primary palette, semantic status colors (success/warning/error/info)
- **Typography** — Inter font family with a full type scale from `2xs` to `5xl`
- **Spacing** — Consistent spacing scale from `0` to `24` (rem-based)
- **Components** — Button, Input, Select, Textarea, Badge, Card, Modal, Tabs, Pagination, Toast, SkeletonLoader, EmptyState, StarRating
- **Animations** — Slide-in, fade-in, scale-in, shimmer, float, and bounce animations
- **Responsive** — Mobile bottom nav, tablet hamburger menu, desktop sidebar nav

---

## 📁 Data Models

### User
- `id`, `fullName`, `email`, `phoneNumber`, `role` (USER/ADMIN), `accountStatus` (ACTIVE/INACTIVE/DELETED/BLOCKED)

### FoodItem
- `id`, `owner`, `title`, `description`, `foodType`, `listingType` (DONATION/SALE), `status` (AVAILABLE/RESERVED/SOLD/CLAIMED/EXPIRED/CANCELLED), `unit`, `quantity`, `price`, `expiryTime`, `pickupStartTime`, `pickupEndTime`, `pickupAddress`, `latitude`, `longitude`

### Order
- `id`, `foodItem`, `customer`, `quantity`, `unitPrice`, `totalAmount`, `status` (PENDING/CONFIRMED/READY_FOR_PICKUP/COMPLETED/CANCELLED)

### Enums
- **FoodType**: PREPARED_MEAL, BAKERY, FRUITS, VEGETABLES, DAIRY, PACKAGED_FOOD, BEVERAGES, OTHER
- **Unit**: KG, GRAM, LITRE, ML, PORTION, PACK, PIECE
- **ListingType**: DONATION, SALE
- **FoodStatus**: AVAILABLE, RESERVED, SOLD, CLAIMED, EXPIRED, CANCELLED
- **OrderStatus**: PENDING, CONFIRMED, READY_FOR_PICKUP, COMPLETED, CANCELLED
- **Role**: USER, ADMIN
- **AccountStatus**: ACTIVE, INACTIVE, DELETED, BLOCKED

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Spring Boot 4.1.1, Spring Security, Spring Data JPA, Java 25 |
| **Database** | MySQL 8, Redis |
| **Auth** | JWT (jjwt 0.13.0), BCrypt |
| **API Docs** | SpringDoc OpenAPI (Swagger UI) |
| **Frontend** | React 19, React Router 7, Vite 8 |
| **HTTP** | Axios with interceptors, auto token refresh |
| **Icons** | Lucide React |
| **Date Utils** | date-fns |
| **Linting** | OxLint |

---

## 🛠️ Scripts

### Frontend

```bash
npm run dev       # Start dev server with HMR
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run OxLint
```

### Backend

```bash
./mvnw spring-boot:run          # Run in dev mode
./mvnw clean package -DskipTests  # Build JAR
./mvnw test                      # Run tests
```

---

## 📄 License

This project is open source.
