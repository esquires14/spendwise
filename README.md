# SpendWise — Personal Finance Tracker

A full-stack web application for tracking personal income and expenses, managing budgets, and generating financial reports. Built as the WGU Software Engineering Capstone (D424) and deployed to production on Railway.

SpendWise gives users a clear picture of their finances — log transactions, organize by category, set monthly budgets, and generate date-range reports, all behind secure JWT-based authentication.

🔗 **Live App:** [spendwise on Railway](https://pure-amazement-production-3857.up.railway.app/login)

![SpendWise Dashboard]([./screenshots/dashboard.png](https://github.com/esquires14/spendwise/blob/working_branch/spendwise/screenshots/dashboard.png))

---

## Features

- **User Authentication** — Secure registration and login with JWT tokens and BCrypt password hashing
- **Transaction Tracking** — Add, edit, delete, and search income and expense transactions
- **Custom Categories** — Create and manage your own spending categories
- **Budget Management** — Set and track monthly budgets by category
- **Financial Reports** — Generate summaries by custom date range
- **Responsive UI** — Built with React 18 and React Router

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot 3.2.5, Spring Security, Spring Data JPA |
| Frontend | React 18, Axios, React Router |
| Database | PostgreSQL |
| Authentication | JWT + BCrypt |
| Deployment | Railway (backend, frontend, database) |

---

## Project Structure

```
spendwise/
├── spendwise/spendwise/
│   └── src/main/java/com/spendwise/
│       ├── config/          # Security and JWT configuration
│       ├── controller/      # REST API endpoints
│       ├── dto/             # Request/response data objects
│       ├── model/           # Entity classes (User, Transaction, etc.)
│       ├── repository/      # JPA repositories
│       └── service/         # Business logic
└── spendwise-frontend/
    └── src/
        ├── api/             # Axios configuration
        ├── components/      # Reusable UI components
        └── pages/           # Application pages
```

---

## Getting Started (Local Setup)

### Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+ and npm
- PostgreSQL 15+

### 1. Clone the Repository

```bash
git clone https://github.com/esquires14/spendwise.git
cd spendwise
```

### 2. Set Up the Database

```sql
CREATE DATABASE spendwise;
```

### 3. Configure the Backend

Navigate to `spendwise/spendwise/src/main/resources/application.properties` and update:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/spendwise
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD_HERE
jwt.secret=your-secret-key-min-32-characters-long
```

### 4. Run the Backend

```bash
cd spendwise/spendwise
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`. Spring Boot auto-creates all database tables on first run.

### 5. Set Up and Run the Frontend

```bash
cd spendwise-frontend
npm install
```

Create a `.env` file in the `spendwise-frontend` root:

```
REACT_APP_API_URL=http://localhost:8080
```

```bash
npm start
```

Frontend runs at `http://localhost:3000`.

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Transactions

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/transactions?userId={id}` | Get all transactions |
| GET | `/api/transactions/search?userId={id}&keyword={kw}` | Search transactions |
| POST | `/api/transactions?userId={id}` | Create a transaction |
| PUT | `/api/transactions/{id}?userId={uid}` | Update a transaction |
| DELETE | `/api/transactions/{id}?userId={uid}` | Delete a transaction |

### Categories

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/categories?userId={id}` | Get all categories |
| POST | `/api/categories?userId={id}` | Create a category |
| PUT | `/api/categories/{id}?userId={uid}` | Update a category |
| DELETE | `/api/categories/{id}?userId={uid}` | Delete a category |

### Budgets

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/budgets?userId={id}` | Get all budgets |
| GET | `/api/budgets/month?userId={id}&month={yyyy-MM}` | Get budgets by month |
| POST | `/api/budgets?userId={id}` | Create a budget |
| PUT | `/api/budgets/{id}?userId={uid}` | Update a budget |
| DELETE | `/api/budgets/{id}?userId={uid}` | Delete a budget |

### Reports

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reports?userId={id}&startDate={date}&endDate={date}` | Generate financial report |

---

## Running Tests

```bash
cd spendwise/spendwise
mvn test
```

---

## Deployment

Deployed on [Railway](https://railway.app):

- **Backend:** Spring Boot app containerized with Docker
- **Frontend:** React static site
- **Database:** PostgreSQL hosted on Railway

---

## Author

**Emily Squires**
B.S. Software Engineering — Western Governors University, 2026
AWS Cloud Practitioner | ITIL 4 Foundation

[LinkedIn](https://www.linkedin.com/in/emily-squires) · [GitHub](https://github.com/esquires14)
