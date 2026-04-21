# SpendWise — Personal Finance Tracker USER GUIDE

A full-stack web application for tracking personal income and expenses,
managing budgets, and generating financial reports.

Built with Java Spring Boot, React, and PostgreSQL.

---

## Tech Stack

- **Backend:** Java 17, Spring Boot 3.2.5, Spring Security, Spring Data JPA
- **Frontend:** React 18, Axios, React Router
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens) + BCrypt password hashing
- **Hosting:** Railway
- **Version Control:** GitLab

---

## Prerequisites

Before setting up the project, make sure you have the following installed:

- Java 17 or higher
- Maven 3.8+
- Node.js 18+ and npm
- PostgreSQL 15+
- IntelliJ IDEA (recommended for backend)
- Visual Studio Code (recommended for frontend)
- Git

---

## Getting Started

### 1. Clone the Repository
```bash
git clone <your-gitlab-repo-url>
cd d424-software-engineering-capstone
```

### 2. Set Up the Database

Open pgAdmin or psql and create the database:
```sql
CREATE DATABASE spendwise;
```

### 3. Configure the Backend

Navigate to the backend directory:
```bash
cd spendwise/spendwise
```

Open `src/main/resources/application.properties` and update
the database credentials:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/spendwise
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD_HERE
jwt.secret=your-secret-key-min-32-characters-long
```

### 4. Run the Backend

In IntelliJ, open the project and run `SpendwiseApplication.java`,
or use Maven from the terminal:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`.
Spring Boot will automatically create all database tables on first run.

### 5. Set Up the Frontend

Open a new terminal and navigate to the frontend directory:
```bash
cd spendwise-frontend
npm install
```

Create a `.env` file in the `spendwise-frontend` root directory:
```
REACT_APP_API_URL=http://localhost:8080
```

### 6. Run the Frontend
```bash
npm start
```

The React app will open at `http://localhost:3000`.

---

## Project Structure
```
d424-software-engineering-capstone/
├── spendwise/
│   └── spendwise/
│       ├── src/main/java/com/spendwise/
│       │   ├── config/          # Security and JWT configuration
│       │   ├── controller/      # REST API endpoints
│       │   ├── dto/             # Request/response data objects
│       │   ├── model/           # Entity classes (User, Transaction, etc.)
│       │   ├── repository/      # JPA repositories
│       │   └── service/         # Business logic
│       └── src/main/resources/
│           └── application.properties
└── spendwise-frontend/
    └── src/
        ├── api/                 # Axios configuration
        ├── components/          # Reusable components
        └── pages/               # Application pages
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions?userId={id}` | Get all transactions |
| GET | `/api/transactions/search?userId={id}&keyword={kw}` | Search transactions |
| POST | `/api/transactions?userId={id}` | Create a transaction |
| PUT | `/api/transactions/{id}?userId={uid}` | Update a transaction |
| DELETE | `/api/transactions/{id}?userId={uid}` | Delete a transaction |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories?userId={id}` | Get all categories |
| POST | `/api/categories?userId={id}` | Create a category |
| PUT | `/api/categories/{id}?userId={uid}` | Update a category |
| DELETE | `/api/categories/{id}?userId={uid}` | Delete a category |

### Budgets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/budgets?userId={id}` | Get all budgets |
| GET | `/api/budgets/month?userId={id}&month={yyyy-MM}` | Get budgets by month |
| POST | `/api/budgets?userId={id}` | Create a budget |
| PUT | `/api/budgets/{id}?userId={uid}` | Update a budget |
| DELETE | `/api/budgets/{id}?userId={uid}` | Delete a budget |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports?userId={id}&startDate={date}&endDate={date}` | Generate report |

---

## Deployment

This application is deployed on Railway.

- **Backend:** Spring Boot containerized with Docker
- **Frontend:** React static site
- **Database:** PostgreSQL hosted on Railway

Live URL: `https://pure-amazement-production-3857.up.railway.app/login`

---

## Running Tests
```bash
cd spendwise/spendwise
mvn test
```

---

## Author

Emily Squires — WGU D424 Software Engineering Capstone
