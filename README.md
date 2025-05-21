## Setup Instructions

1. Clone the repository: 
```bash
  git clone https://github.com/maria-hambardzumian/nestjs-edu-platform.git && cd nestjs-edu-platform
```

2. Install dependencies:
```bash
  npm install
 ``` 

3. Configure environment variables:
   Create a `.env` file based on `.env.example`:
```
   DATABASE_URL="mysql://login:password@localhost:5432/db"
   JWT_SECRET="secret"
   PORT="8080"
   JWT_EXPIRY_TIME="1d"
``` 

4. Run database migrations using Prisma:
```bash
   npx prisma migrate dev
```

5. Start the development server:
```bash
   npm run start:dev
```


## Running Tests

- Run unit tests:
```bash
   npm run test
```


## API Endpoints

### Auth
- POST /auth/signup
- POST /auth/login

### Courses
- POST /courses (Instructor only)
- POST /courses/:id/enroll (Student only)

### Lessons
- GET /courses/:id/lessons (Only for enrolled students)

### Q&A
- POST /lessons/:id/questions (Student)
- POST /questions/:id/answer (Instructor)

You can find a full set of testable endpoints in the included Postman collection:
./postman/microlearning-api.postman_collection.json

## Prisma Schema

The Prisma schema is located at:
prisma/schema.prisma

This file defines the database models used in the application, including:
- User (with roles: STUDENT, INSTRUCTOR)
- Course
- Lesson
- Enrollment
- Question

for update of the schema and generation new client code:
```bash
  npx prisma generate
```

To apply schema changes via migration:
```bash
  npx prisma migrate dev --name your_migration_name
```