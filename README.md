# 📚 Next CourseApp

A full-stack **Learning Management System (LMS)** built with Next.js, MongoDB, and Razorpay — organized as a **Turborepo monorepo**. It supports two roles: **Admins** (course creators) and **Users** (learners), with course browsing, purchasing, and lesson viewing.

---

## 🗂️ Project Structure

```
next_courseapp/
├── apps/
│   ├── admin/          # Main Next.js app (Admin + User portals)
│   ├── web/            # Public-facing web app
│   └── docs/           # Documentation site
├── packages/
│   ├── db/             # Mongoose models & DB connection
│   ├── store/          # Recoil atoms (global state)
│   ├── ui/             # Shared React component library
│   ├── auth/           # Authentication utilities
│   ├── eslint-config/  # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
├── turbo.json          # Turborepo pipeline config
└── package.json        # Root workspace config
```

---

## ✨ Features

### 👩‍💼 Admin Portal
- Secure admin **signup & login** (JWT-based)
- **Create, update, and delete** courses
- Upload course thumbnails, set pricing, category, level & tags
- View all created courses with analytics (students enrolled, rating)

### 👤 User Portal
- User **signup & login** (JWT + NextAuth)
- Browse all published courses with rich metadata
- **Purchase courses** via Razorpay payment gateway
- Access **purchased courses** and view lesson content
- Track enrolled courses in "My Courses"

### 📦 Course Model
Each course supports:
- Title, description, price, thumbnail/image
- Category (Web Dev, AI/ML, DevOps, etc.)
- Level (Beginner / Intermediate / Advanced)
- Language, duration, tags
- **Embedded lessons** (title, description, full Markdown content, order)
- Stats: rating, students enrolled, total lessons

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) |
| **Language** | TypeScript |
| **Database** | MongoDB + [Mongoose](https://mongoosejs.com/) |
| **Auth** | JWT + [NextAuth.js](https://next-auth.js.org/) |
| **State Management** | [Recoil](https://recoiljs.org/) |
| **Payments** | [Razorpay](https://razorpay.com/) |
| **UI Components** | MUI Icons + Custom `ui` package |
| **Monorepo** | [Turborepo](https://turbo.build/) |
| **Package Manager** | npm workspaces (npm ≥ 11) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 11
- A running **MongoDB** instance (local or Atlas)
- A **Razorpay** account for payments

### 1. Clone the repository

```bash
git clone https://github.com/PRIYANSHUMISHRA004/next_courseapp.git
cd next_courseapp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root and in `apps/admin/`:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/courseapp

# JWT
JWT_SECRET=your_super_secret_key

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 4. Run in development

```bash
npm run dev
```

This starts all apps in parallel via Turborepo. The main app runs at **http://localhost:3000**.

---

## 📡 API Routes

All API routes live under `apps/admin/src/pages/api/`.

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/signup` | Admin/User registration |
| `POST` | `/api/auth/login` | Admin/User login |
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth handler |
| `GET` | `/api/admin/courses` | Get all courses (admin) |
| `POST` | `/api/admin/createCourses` | Create a new course |
| `PUT` | `/api/admin/updateCourse` | Update course details |
| `DELETE` | `/api/admin/deleteCourse` | Delete a course |
| `GET` | `/api/user/courses` | Get all published courses |
| `POST` | `/api/payment/create-order` | Create Razorpay payment order |

---

## 📦 Shared Packages

### `packages/db`
Mongoose schemas and models:
- `User` — learner accounts with enrolled course references
- `Admin` — course creator accounts
- `Course` — full course document with embedded `Lesson` subdocuments

### `packages/store`
Recoil atoms for client-side state:
- `userAtom` — logged-in user info
- `coursesAtom` — list of all courses
- `purchasedCoursesAtom` — user's purchased courses

### `packages/ui`
Shared React components:
- `AppBar` — top navigation bar
- `CourseCard` — course display card
- `Login` / `Signup` forms
- `FeatureItem`, `RoleCard`, icons

### `packages/auth`
JWT utility functions for signing and verifying tokens.

---

## 🧰 Available Scripts

Run from the **project root**:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all apps in development mode |
| `npm run build` | Build all apps and packages |
| `npm run lint` | Lint all workspaces |
| `npm run format` | Format all `.ts`, `.tsx`, `.md` files with Prettier |
| `npm run check-types` | TypeScript type-check across all packages |

---

## 🏗️ Monorepo Architecture

This project uses **Turborepo** for efficient task orchestration:

```
turbo dev
  └── Runs next dev in apps/admin, apps/web, apps/docs (parallel)

turbo build
  └── Builds packages first (db, store, ui, auth)
  └── Then builds apps (admin, web, docs)
```

---

## 🔐 Authentication Flow

1. **Admin** signs up → credentials stored in MongoDB (`Admin` collection)
2. On login → server validates credentials, issues a **JWT**
3. JWT stored in cookie (`js-cookie`) and validated on every protected API call
4. **Users** also support **NextAuth** session-based auth alongside JWT

---

## 💳 Payment Flow

1. User clicks "Purchase Course"
2. Frontend calls `POST /api/payment/create-order` → Razorpay order created
3. Razorpay checkout opens in browser
4. On success → course added to user's `courses` array in MongoDB

---

## 🔄 Rolling Back

A git tag is maintained before major pushes for safe rollback:

```bash
# View available tags
git tag

# Rollback to a previous stable version
git checkout v-before-ui-overhaul
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is for educational purposes. Feel free to use and modify it.

---

<div align="center">
  <p>Built with ❤️ using Next.js & Turborepo</p>
</div>
