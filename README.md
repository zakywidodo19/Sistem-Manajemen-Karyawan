# Employee Management System

Frontend application for managing employee data built with **React.js**, **Tailwind CSS**, and **Redux Toolkit**.

---

## 🚀 Features

### 🔐 Authentication

- Login with JWT Authentication
- Protected Routes
- Persistent Login Session
- Auto Logout when token expired
- Role-based Access Control (Admin & HR Manager)

### 📊 Dashboard

- Total Employee
- Active Employee
- Inactive Employee
- Total Salary
- Average Salary
- Department Statistics Visualization

### 👨‍💼 Employee Management

- Employee List
- Employee Detail
- Create Employee
- Edit Employee
- Delete Employee
- Search Employee
- Filter by Department
- Filter by Status
- Sorting
- Pagination

### ⚠️ Error Handling

- API Error Handling
- Validation Error Handling
- Unauthorized Access Handling (401)
- Network Error Handling
- Loading State
- Empty State
- Error State

---

## 🛠 Tech Stack

### Core Technologies

- React.js
- React Router DOM
- Tailwind CSS
- Axios

### State Management

- Redux Toolkit

### Form Handling

- React Hook Form

### Data Fetching

- TanStack Query (Optional)

### Data Visualization

- Recharts

---

## 📦 Installation

### Clone Repository

```bash
git clone https://github.com/your-username/employee-management.git
cd employee-management
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create `.env` file:

```env
VITE_API_URL=https://YOUR_API_URL
```

### Run Development Server

```bash
npm run dev
```

### Build Production

```bash
npm run build
```

---

## 🔐 Test Credentials

### Admin

| Email                                     | Password    |
| ----------------------------------------- | ----------- |
| [admin@gmail.com](mailto:admin@gmail.com) | Admin123456 |

### HR Manager

| Email                               | Password |
| ----------------------------------- | -------- |
| [hr@gmail.com](mailto:hr@gmail.com) | Hr123456 |

---

## 🌐 API Endpoints

### Authentication

```http
POST /api/auth/login
```

### Dashboard

```http
GET /api/dashboard
GET /api/dashboard/departments
```

### Employee

```http
GET    /api/employees
GET    /api/employees/:id
POST   /api/employees
PUT    /api/employees/:id
DELETE /api/employees/:id
```

---

## 🗂 State Management

This project uses **Redux Toolkit** to manage global application state.

### Managed States

- Authentication Token
- Logged-in User Information
- Employee Data
- Dashboard Statistics
- Global Loading State
- Global Error State

### Redux Structure

```text
src/
└── store/
    ├── index.js
    ├── slices/
    │   ├── authSlice.js
    │   ├── employeeSlice.js
    │   └── dashboardSlice.js
    │
    └── hooks/
        ├── useAppDispatch.js
        └── useAppSelector.js
```

### Benefits

- Centralized State Management
- Predictable State Updates
- Easier Debugging
- Scalable Architecture
- Better Separation of Concerns

---

## 📁 Project Structure

```text
src/
│
├── api/
│   ├── axiosInstance.js
│   ├── authApi.js
│   ├── dashboardApi.js
│   └── employeeApi.js
│
├── components/
│   ├── common/
│   ├── forms/
│   ├── layout/
│   ├── tables/
│   └── charts/
│
├── pages/
│   ├── auth/
│   │   └── Login.jsx
│   │
│   ├── dashboard/
│   │   └── Dashboard.jsx
│   │
│   └── employees/
│       ├── EmployeeList.jsx
│       ├── EmployeeDetail.jsx
│       ├── CreateEmployee.jsx
│       └── EditEmployee.jsx
│
├── routes/
│   ├── ProtectedRoute.jsx
│   └── AppRoutes.jsx
│
├── store/
│   ├── index.js
│   └── slices/
│
├── hooks/
│
├── utils/
│
├── App.jsx
└── main.jsx
```

---

## ⚠️ Error Handling

### Login Error

Display error messages when:

- Email or Password is incorrect
- Server is unavailable
- Request timeout occurs

Example:

```text
Email or Password is incorrect
```

---

### Employee List

Loading State:

```text
Loading employee data...
```

Empty State:

```text
No employee found
```

Error State:

```text
Failed to load employee data
```

---

### Create Employee

Display validation messages returned by API.

Example:

```json
{
  "status": false,
  "message": "Validation Error",
  "errors": ["employeeCode is required", "email is required"]
}
```

---

### Update Employee

Success:

```text
Employee updated successfully
```

Failed:

```text
Failed to update employee
```

---

### Delete Employee

Success:

```text
Employee deleted successfully
```

Failed:

```text
Failed to delete employee
```

---

### Unauthorized (401)

When JWT token is invalid or expired:

- Remove token from localStorage
- Clear Redux Authentication State
- Redirect user to Login Page

---

### Network Error

Example:

```text
Unable to connect to server. Please try again later.
```

Application must never display a blank screen or crash.

---

## 🎯 Assessment Coverage

### Functional (40%)

✅ Authentication
✅ Dashboard
✅ Employee CRUD
✅ API Integration
✅ Error Handling

### UI / UX (20%)

✅ Responsive Design
✅ Clean Layout
✅ Consistent Components

### Code Quality (20%)

✅ Modular Architecture
✅ Reusable Components
✅ Clean Naming Convention
✅ Feature-based Structure

### State Management (10%)

✅ Redux Toolkit
✅ Centralized State
✅ Predictable Data Flow

### Git (10%)

✅ Meaningful Commit Messages
✅ Clean Repository Structure

---

## ⭐ Bonus Features

- Dark Mode
- TanStack Query
- Debounced Search
- Skeleton Loading
- Recharts Dashboard
- Unit Testing
- Custom Hooks
- Toast Notifications
- Axios Interceptor
- Protected Routes

---

## 👨‍💻 Author

Developed as part of the Frontend Developer Assessment using React.js, Tailwind CSS, Redux Toolkit, and REST API Integration.
