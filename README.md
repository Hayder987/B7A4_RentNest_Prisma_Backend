<div align="center">

# 🏠 RentNest

### Find & List Rental Properties with Ease

A modern, scalable and secure Rental Property Marketplace REST API built with **Node.js**, **Express.js**, **TypeScript**, **Prisma ORM**, **PostgreSQL**, and **Stripe Checkout**.

---

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

# 📖 Overview

RentNest is a production-ready backend REST API for a rental property marketplace where **Tenants**, **Landlords**, and **Admins** interact through a secure role-based system.

The application enables landlords to publish rental properties, tenants to discover and request rentals, secure online payment through Stripe, and administrators to manage the overall platform.

The project follows a modular architecture using Express.js and Prisma ORM with PostgreSQL to ensure scalability, maintainability, and clean code organization.

---

# ✨ Core Features

## 👤 Authentication

- User Registration
- Secure Login
- JWT Authentication
- Password Hashing
- Current User Profile
- Protected Routes

---

## 🔐 Authorization

- Role Based Access Control
- Tenant Permissions
- Landlord Permissions
- Admin Permissions
- Route Protection Middleware

---

## 🏠 Property Management

- Create Property
- Update Property
- Delete Property
- Get All Properties
- Get Single Property
- Property Availability Management

---

## 📂 Category Management

- Create Category
- Update Category
- Delete Category
- Get Categories

---

## 📝 Rental Request System

- Submit Rental Request
- Approve Rental Request
- Reject Rental Request
- Rental Status Management
- View Rental History

---

## 💳 Stripe Payment

- Stripe Checkout Session
- Secure Payment
- Stripe Webhook
- Payment Verification
- Transaction Recording
- Rental Status Update

---

## ⭐ Review System

- Create Review
- View Reviews
- Property Rating

---

## 👑 Admin Features

- Manage Users
- Manage Categories
- View Properties
- View Rental Requests
- Block / Unblock Users

---

## 🔍 Search & Filtering

- Location Filter
- Price Range Filter
- Category Filter
- Property Type Filter
- Search by Keyword

---

## 📄 Pagination

- Page
- Limit
- Sorting
- Metadata

---

## ✅ Validation

- Zod Schema Validation
- Request Validation Middleware

---

## ⚠️ Error Handling

- Global Error Handler
- Prisma Error Handling
- Validation Error Handling
- Custom App Error
- Standardized Error Response

---

## 🚀 Performance

- Prisma ORM
- Transaction Support
- Modular Architecture
- Type Safety
- Environment Configuration

---

# 🛠 Tech Stack

| Category | Technology |
|------------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| ORM | Prisma ORM |
| Database | PostgreSQL |
| Authentication | JWT |
| Password Hashing | bcryptjs |
| Validation | Zod |
| Payment | Stripe |
| Build Tool | tsup |
| Development | tsx |
| Environment | dotenv |
| CORS | cors |
| Cookie Parser | cookie-parser |

---

# 📁 Project Structure

```text
src/
│
├── app.ts
├── server.ts
│
├── config/
│
├── Error/
│
├── lib/
│
├── middleware/
│
├── utils/
│
└── modules/
    ├── auth/
    ├── category/
    ├── payment/
    ├── property/
    ├── rentalRequest/
    ├── reviews/
    └── user_admin/

prisma/
│
├── schema.prisma
├── migrations/

generated/

dist/
```

---

# 📂 Folder Responsibilities

## 📦 src/config

Stores all project configuration files.

Examples:

- Environment Variables
- Prisma Configuration
- Stripe Configuration

---

## 📦 src/modules

Contains every business module of the application.

Each module follows a clean architecture:

```
controller
service
route
validation
interface
```

This separation keeps business logic maintainable.

---

## 🔐 auth

Responsible for

- Register
- Login
- JWT
- Authentication
- Authorization

---

## 🏠 property

Responsible for

- Property CRUD
- Search
- Filtering
- Availability

---

## 📂 category

Responsible for

- Property Categories
- Category CRUD

---

## 📝 rentalRequest

Responsible for

- Rental Requests
- Approval
- Rejection
- Rental Status

---

## 💳 payment

Responsible for

- Stripe Checkout
- Payment Verification
- Webhook
- Payment History

---

## ⭐ reviews

Responsible for

- Property Reviews
- Ratings

---

## 👑 user_admin

Responsible for

- User Management
- Admin Operations

---

## ⚠️ middleware

Contains

- Authentication Middleware
- Authorization Middleware
- Validation Middleware
- Error Middleware

---

## 🛠 utils

Contains reusable helper utilities.

Examples

- JWT Helper
- Async Catch Wrapper
- Response Formatter
- Utility Types

---

## ❌ Error

Contains custom error classes and centralized error handling.

---

# 🗄 Database Design

The project uses **PostgreSQL** with **Prisma ORM**.

The database follows a relational design.

Main entities include:

- 👤 User
- 🏠 Property
- 📂 Category
- 📝 Rental Request
- 💳 Payment
- ⭐ Review

Relationships are managed using Prisma relations and foreign keys.

In the next section, each model, relation, and enum will be explained in detail based on the Prisma schema.

---
