# Checkmate Express

**Checkmate Express** is the backend API for a chess tournament management application, developed as part of the professional training at **Technifutur**.

This API manages users, tournaments, and match pairings, providing a secure and scalable architecture for chess organizers.

---

## Tech Stack

The project is built with **Node.js** (ES Modules) and uses the following key libraries:

* **Framework:** [Express 5](https://expressjs.com/)
* **Database & ORM:** [PostgreSQL](https://www.postgresql.org/) with [Sequelize](https://sequelize.org/)
* **Data Validation:** [Zod](https://zod.dev/)
* **Security:** Authentication via [JSON Web Token (JWT)](https://jwt.io/) and password hashing with [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
* **Documentation:** [Swagger UI](https://swagger.io/tools/swagger-ui/) (via `swagger-jsdoc`)
* **Utilities:** [Day.js](https://day.js.org/) (date manipulation), [Nodemailer](https://nodemailer.com/) (email services), [Morgan](https://github.com/expressjs/morgan) (HTTP request logging)

---


## Front-End Application

A front-end application is currently under development in the https://github.com/Dranhoc/Checkmate_Angular repository. In the meantime, you can test all features directly through this API.

## Installation & Setup
### 1. Clone the repository
```bash
git clone https://github.com/Dranhoc/Checkmate_Express
cd Checkmate_Express
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Rename '.env.example' in '.env' and fill the 'XXX' with your credentials


### 4. Usage

Runs the server with nodemon for automatic restarts on file changes
```bash
npm run dev
```

### 5. Database Seeding

To populate the database with initial data 
```bash 
npm run seed
```

### 6.API Documentation

Once the server is running you can explore and test the API endpoints via the interactive Swagger documentation at :
http://localhost:3000/api-docs (Default port)


### 7. Project Struture

- src/index.js - Application entry point.
- src/database/ - Sequelize configuration, models, and seeders.
- src/routes/ - API route definitions.
- src/controllers/ - Business logic and request handling.
- src/middleware/ - Auth guards, Zod validation, and error handling.