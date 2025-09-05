# 📚 Novels | A Platform for Book Worms

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)
![Contributions](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)

> A modern platform where **users can read books** and **writers can post & share their works**.  
> To access premium content, readers and writers must subscribe (**Monthly | Yearly**).

🌐 **Live Demo:** [novels-tau.vercel.app](https://novels-tau.vercel.app)

---

## ✨ Features

✅ Role-based user management  
✅ Subscription-based access (**Monthly | Yearly**)  
✅ Role-based authentication: **User | Writer | Admin | Super_Admin**  
✅ Flexible dashboard for each role  
✅ Secure authentication with **Passport.js + JWT**  
✅ Email notifications with **Nodemailer + EJS Templates**

---

## 🛠 Tech Stack

- ⚡ **Node.js**
- 🚀 **Express.js**
- 🗄 **MongoDB + Mongoose**
- 📝 **TypeScript**
- ✅ **Zod** (Validation)
- 🔐 **Passport.js** (Authentication)
- 🔑 **JWT** (Token Handling)
- 📧 **Nodemailer + EJS** (Emailing & Templates)

---

## 👥 User Roles

- 👑 **Super Admin** → Manage everything
- 🛠 **Admin** → Manage users, writers & books
- ✍️ **Writer** → Post & manage own books
- 📖 **User** → Read books after subscription

---

## 📦 Enums

### 📘 Book

```ts
export enum IBookTypes {
  NOVEL = "NOVEL",
  POEM = "POEM",
  SHORT_STORY = "SHORT_STORY",
  ACADECIM = "ACADECIM",
  OTHERS = "OTHERS",
}

export enum IBookLaguage {
  en = "en",
  bn = "bn",
  unknown = "unknown",
}

export enum IBookStatus {
  ONGOING = "ONGOING",
  COMPLETE = "COMPLETE",
}

export enum IBookStatusType {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}
```

### 💳 Payment

```
export enum Payment_Status {
  PAID = "PAID",
  UNPAID = "UNPAID",
  CANCLLED = "CANCLLED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum Subscription_Type {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}
```

### 👤 User

```
export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  WRITER = "WRITER",
  USER = "USER",
}

export enum RoleStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  CANCELED = "CANCELED",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}
```

### ⚙️ Installation

```
# Clone the repository
git clone <your-repo-url>

# Navigate to the project folder
cd <project-folder>

# Install dependencies
npm install
```

### 🔐 Environment Variables

```
// Create a .env file in the project root:

PORT=5000
DB_URI=URI_LINK
NODE_ENV=development
EXPRESS_SESSION_SECRET=r0wOhrLJC2mRgmIG4+qwdVcP0C5vX+a1eJrIeMxb6Es
FRONTEND_URL=http://localhost:5173

# super_admin
SUPER_ADMIN_EMAIL=example@gmail.com
SUPER_ADMIN_PASSWORD=123456
SUPER_ADMIN_PHONE=01899999999
SUPER_ADMIN_ADDRESS="Lalbagh, Dhaka"

# google-passport
GOOGLE_CLIENT_SECRET=google-s4WDphw
GOOGLE_CLIENT_ID=example.googleusercontent.com
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# bcryptjs
BCRYPT_SALT=10

# JWT
JWT_ACCESS_SECRET=b6ad4f4067f613b7007cc62d6c4276b9
JWT_REFRESH_SECRET=3db0719626dfaa103f99a3ddc6ec7dce
JWT_ACCESS_EXPIRESIN="1d"
JWT_REFRESH_EXPIRESIN="30d"
```

### 🚀 Project Roadmap

- User Authentication

- Role-based Access Control

- Subscription System

- Payment Gateway Integration

- Book Recommendations Engine

- Mobile App Version

### 🤝 Contribution

Contributions are always welcome!
If you’d like to contribute, please fork the repo and submit a pull request.
