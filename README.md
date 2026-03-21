#  CampusNexus – Smart Campus Operations Hub

A modern web-based platform designed to streamline university facility management, booking workflows, and maintenance operations.

---

##  Project Overview

**CampusNexus** is a full-stack application developed as part of the *Programming Applications and Frameworks (IT3030)* module.

The system enables:

* Efficient management of campus resources (rooms, labs, equipment)
* Booking and scheduling with conflict prevention
* Maintenance and incident tracking
* Notification system for real-time updates
* Secure authentication and role-based access

---

##  Tech Stack

###  Backend

* Java
* Spring Boot
* Spring Data JPA
* Spring Security
* Maven

###  Frontend

* React
* Vite
* Axios

###  Database

* MySQL (Production)
* H2 (Development/Testing)

###  Tools

* Git & GitHub
* Postman (API Testing)
* VS Code

---

##  Team Members

| Name              | Responsibilities                                 |
| ----------------- | ------------------------------------------------ |
| Paranagama P D T  | Facilities Module, Notifications, Authentication |
| Member 2          | Booking Management                               |
| Member 3          | Maintenance & Ticketing                          |

---

##  Modules

###  Facilities & Assets

* Manage resources (rooms, labs, equipment)
* Add, update, delete, and search resources

###  Booking Management

* Request bookings
* Approval workflow
* Conflict detection

###  Maintenance & Tickets

* Report incidents
* Assign technicians
* Track resolution

###  Notifications

* Booking updates
* Ticket status alerts
* User notification panel

###  Authentication & Authorization

* User registration & login
* Role-based access (USER / ADMIN)

---

##  API Endpoints (Sample)

### Facilities

* `GET /api/resources`
* `POST /api/resources`
* `PUT /api/resources/{id}`
* `DELETE /api/resources/{id}`

### Notifications

* `GET /api/notifications`
* `POST /api/notifications`
* `PUT /api/notifications/{id}/read`

### Authentication

* `POST /api/auth/register`
* `POST /api/auth/login`

---

##  Setup Instructions

### 1️ Clone the Repository

```bash
git clone https://github.com/Tharushi111/it3030-paf-2026-smart-campus-group29_1.2.git
cd it3030-paf-2026-smart-campus-group29_1.2
```

---

### 2️ Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Runs on:

```
http://localhost:8080
```

---

### 3️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Runs on:

```
http://localhost:5173
```

---

##  Environment Configuration

Create an `application.properties` file:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/campusnexus
spring.datasource.username=root
spring.datasource.password=yourpassword

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

##  Git Workflow

* `main` → stable version
* feature branches → development

Example:

```bash
feature/resource-module
feature/notifications
feature/authentication
```

---

##  Testing

* API tested using Postman
* Validation & error handling implemented

---

##  License

This project is developed for academic purposes only.

---

##  Acknowledgment

Developed as part of IT3030 – Programming Applications and Frameworks module at SLIIT.

---
