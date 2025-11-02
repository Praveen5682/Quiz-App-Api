🧩 Quiz App – Backend (API)

This is the backend for the Quiz Application built using Node.js, Express, and Knex ORM.
It handles user authentication, quiz creation, quiz attempts, and leaderboard management.
The database is hosted on TiDB Cloud, and the API is deployed on Render.

⚙️ Tech Stack
Backend

Node.js

Express.js

Knex.js

MySQL (via TiDB Cloud)

Authentication

JSON Web Token (JWT)

Bcrypt.js (for password hashing)

Deployment

Render → API Hosting

TiDB Cloud → Database Hosting

🌐 Live Links

Backend API: https://quiz-app-api-1ypt.onrender.com

GitHub Repository: https://github.com/Praveen5682/Quiz-App-Api

🧱 Database Structure (TiDB Cloud)

<!-- users -->

Column Type Description
userid INT Primary key
fullname VARCHAR(50) User’s full name
email VARCHAR(100) Unique email ID
password VARCHAR(255) Hashed password
role ENUM('student', 'teacher') User role
createdat TIMESTAMP Auto generated
updatedat TIMESTAMP Auto updated

<!-- quizzes -->

Column Type Description
quizid INT Primary key
title VARCHAR(255) Quiz title
createdAt TIMESTAMP Auto generated

<!-- questions -->

Column Type Description
questionid INT Primary key
quizId INT Foreign key (references quizzes)
question VARCHAR(500) Question text
options JSON List of options
correctIndex INT Index of correct answer
createdAt TIMESTAMP Auto generated

<!-- quiz_attempts -->

Column Type Description
attemptid INT Primary key
userid INT Foreign key (references users)
quizid INT Foreign key (references quizzes)
answers JSON Submitted answers
score INT User’s quiz score
created_at TIMESTAMP Auto generated

🧩 All API Endpoints

🔐 Auth Routes (auth.js)

Method Endpoint Description
POST /api/v1/register Register a new user
POST /api/v1/login Login user

🧠 Quiz Routes (quiz.js)

Method Endpoint Description
POST /api/v1/create-quiz Create a new quiz
POST /api/v1/quiz Get all quizzes
POST /api/v1/edit-quiz Edit quiz details
POST /api/v1/remove-quiz Delete a quiz
POST /api/v1/submit-quiz Submit a quiz attempt
POST /api/v1/leaderboard Get leaderboard data
POST /api/v1/result Get quiz results for a user

🎓 Teacher Routes (teacher.js)

Method Endpoint Description
POST /api/v1/get-students Get all registered students

🧩 Server Root

Method Endpoint Description
GET / Test route → returns "Server is running👋🏻"

⚙️ Environment Variables

Create a .env file in the root directory and configure it as below:

PORT=8000

# TiDB Cloud Connection

DB_HOST=gateway01.ap-northeast-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_USER=3bNFYToi4bbepkd.root
DB_PASSWORD=vVsUtsq0k7ryGv4V
DB_NAME=quiz

# JWT Secret Key

JWT_SECRET=rfrfrffrfjnfrhyguheyuguyh

🧩 How to Run Locally

# Clone the repository

git clone https://github.com/Praveen5682/Quiz-App-Api.git
cd Quiz-App-Api

# Install dependencies

npm install

# Create a .env file and add your environment variables

cp .env.example .env

# Start the server

npm start
