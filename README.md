# CampusNexus – Smart Campus Operations Hub

**CampusNexus** is a modern smart campus management platform developed to improve how university resources, bookings, maintenance requests, and notifications are handled in one centralized system.

This project was developed for the **Programming Applications and Frameworks (IT3030)** module.

---

## Project Overview

**CampusNexus** is a full-stack web application that helps universities manage day-to-day campus operations more efficiently.

The system allows users to:

- browse and manage campus resources such as labs, lecture halls, meeting rooms, and equipment
- request and manage bookings for available resources
- create and track maintenance or incident tickets
- receive real-time notifications for important system events
- access the system securely using authentication and role-based authorization

The platform supports different user roles so that each user sees features relevant to their responsibilities.

---

## Main Features

### Resource Management
- add, update, delete, and view campus resources
- upload resource images
- manage type, capacity, location, and availability status
- search and filter resources easily

### Booking Management
- request bookings for available resources
- approve or reject booking requests
- prevent booking conflicts for the same resource and time slot
- update, cancel, or delete pending bookings
- track booking status such as pending, approved, rejected, and cancelled

### Ticket Management
- create maintenance and incident tickets
- update ticket details
- assign tickets to staff members
- update ticket status such as open, in progress, resolved, closed, and rejected
- manage user-submitted issue reports efficiently

### Notification Management
- send real-time notifications for bookings and tickets
- notify admins when users create, update, cancel, or delete bookings
- notify admins when users create, update, or delete tickets
- notify users when bookings are approved or rejected
- notify users when ticket statuses are updated
- allow users to manage notification preferences

### Authentication and Authorization
- secure Google OAuth2 login
- role-based system access for **USER**, **ADMIN**, and **STAFF**
- protected routes on frontend and backend
- session-based authentication with Spring Security

---

## Tech Stack

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Spring Security
- OAuth2 Login
- WebSocket
- Maven

### Frontend
- React
- Vite
- Axios
- Tailwind CSS
- React Hot Toast
- React Icons

### Database
- MySQL

### Tools
- Git and GitHub
- Postman
- VS Code

---

## User Roles

### USER
- browse resources
- create bookings
- update, cancel, or delete own bookings
- create and manage own tickets
- receive notification updates

### ADMIN
- manage all resources
- manage all bookings
- approve or reject booking requests
- manage all tickets
- assign tickets to staff
- manage users and roles
- view and manage notifications

### STAFF
- view assigned tickets
- update assigned ticket statuses
- receive ticket assignment notifications

---

## Project Modules

### 1. Facilities and Assets Management
This module manages physical campus resources such as:

- labs
- lecture halls
- auditoriums
- meeting rooms
- projectors
- cameras
- printers
- scanners
- microphones
- speakers
- smart boards
- other lab equipment

Main functions:
- add new resources
- edit resource details
- delete resources
- upload resource images
- manage resource availability status

---

### 2. Booking Management
This module handles booking operations for campus resources.

Main functions:
- create resource booking requests
- check time conflicts before confirming booking request
- allow admins to approve or reject requests
- allow users to edit or cancel pending bookings
- notify admins and users when booking changes happen

---

### 3. Maintenance and Ticket Management
This module is used to report and track maintenance or incident issues.

Main functions:
- create tickets with title, description, category, priority, and location
- assign tickets to staff members
- update ticket status
- view personal tickets
- view assigned tickets for staff
- notify related users when ticket changes happen

---

### 4. Notification Management
This module provides system-wide notification handling.

Main functions:
- booking creation notifications
- booking update notifications
- booking cancellation notifications
- booking deletion notifications
- booking approval and rejection notifications
- ticket creation notifications
- ticket update notifications
- ticket deletion notifications
- ticket status update notifications
- staff assignment notifications
- notification preference management
- WebSocket-based real-time updates

---

### 5. Authentication and Authorization
This module secures system access and manages user permissions.

Main functions:
- Google OAuth2 login
- secure session handling
- Spring Security route protection
- frontend protected routes
- role-based access for USER, ADMIN, and STAFF

---

## Contribution Summary

| Name | Responsibilities |
|------|------------------|
| **Paranagama P D T** | **Facilities & Assets Module, Authentication and Notification Management** |
| **Jayasekara J.M.S.H** | **Booking Management** |
| **Wijesinghe H.T.T.M** | **Maintenance & Ticketing** |


---

## System Architecture

CampusNexus follows a full-stack client-server architecture:

- **Frontend** handles user interface and user interactions
- **Backend** exposes REST APIs and business logic
- **Database** stores users, bookings, tickets, notifications, and resources
- **WebSocket** provides real-time notification delivery

---

## Sample API Endpoints

### Resources
- `GET /api/resources`
- `POST /api/resources`
- `PUT /api/resources/{id}`
- `DELETE /api/resources/{id}`

### Authentication
- `GET    /api/auth/test`
- `GET    /api/auth/me`
- `GET    /api/auth/debug-role`
- `POST   /api/auth/logout`
- `GET    /api/admin/users`
- `POST   /api/admin/users`
- `PUT    /api/admin/users/{id}`
- `DELETE /api/admin/users/{id}`

### Notifications
- `GET    /api/notifications`
- `PATCH  /api/notifications/{id}/read`
- `DELETE /api/notifications/{id}`
- `GET    /api/notifications/preferences`
- `PUT    /api/notifications/preferences`

### Bookings
- `POST /api/bookings/resource/{resourceId}`
- `GET /api/bookings/my`
- `GET /api/bookings`
- `PUT /api/bookings/{id}/resource/{resourceId}`
- `PATCH /api/bookings/{id}/cancel`
- `PATCH /api/bookings/{id}/approve`
- `PATCH /api/bookings/{id}/reject`
- `DELETE /api/bookings/{id}`

### Tickets
- `POST /api/tickets`
- `GET /api/tickets/my`
- `GET /api/tickets/assigned`
- `GET /api/tickets`
- `PUT /api/tickets/{id}`
- `PATCH /api/tickets/{id}/assign`
- `PATCH /api/tickets/{id}/status`
- `DELETE /api/tickets/{id}`

---

## Setup Instructions

## 1. Clone the Repository

```bash
git clone https://github.com/Tharushi111/it3030-paf-2026-smart-campus-group29_1.2.git
cd it3030-paf-2026-smart-campus-group29_1.2
```

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
spring.application.name=backend

server.port=9090

spring.datasource.url=jdbc:mysql://localhost:3306/campusnexus_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Colombo
spring.datasource.username=root
spring.datasource.password=yourpassword

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB

app.frontend.url=http://localhost:5173
app.upload.dir=uploads/resources
app.ticket.upload.dir=uploads/tickets
app.user.upload.dir=uploads/users

# Example role emails
app.admin.emails=campusnexus29@gmail.com
app.staff.emails=staffmember1@gmail.com,staffmember2@gmail.com

# Google OAuth2
spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET
spring.security.oauth2.client.registration.google.scope=openid,profile,email
```
## Running the Project 

## 1. Backend:

```bash
cd backend
mvn spring-boot:run
```

## 1. Frontend:

```bash
cd frontend
npm run dev
```

---

##  Git Workflow

* `main` → stable version
* feature branches → development

Example:

```bash
feature/facilities-and-Assets-Catalogue
feature/booking-management
feature/ticket-management
feature/authentication
feature/notification-management
```

---

##  Testing

* API tested using Postman
* Validation & error handling implemented
* browser-based UI testing
* manual validation of role-based access
* booking conflict testing
* CRUD functionality testing
* notification delivery testing

##  Validation and Error Handling

- The system includes validation and exception handling for:

* required form fields
* email validation
* invalid role values
* invalid ticket and booking state changes
* duplicate users
* unauthorized access
* forbidden access
* resource booking conflicts
* invalid file uploads
* API error response handling

##  Authentication Flow

- CampusNexus uses Google OAuth2 login with Spring Security.

### Main flow:

1. user clicks Google login
2. Google authenticates the user
3. backend receives user information
4. user is saved or updated in the database
5. role is assigned based on system rules
6. frontend loads current user data through /api/auth/me
7. user is redirected based on role:
  - ADMIN → admin panel
  - STAFF → staff panel
  - USER → user dashboard


##  Notification Flow

- Notification system supports both persistence and real-time delivery.

### Main flow:

- booking or ticket event occurs
- backend creates notification record
- notification is saved in the database
- WebSocket pushes real-time update to target user
- user can read notification in notification panel
- user can manage notification preferences

---

##  License

This project is developed for academic purposes.

---

##  Acknowledgment

Developed as part of IT3030 – Programming Applications and Frameworks module at SLIIT.

---
