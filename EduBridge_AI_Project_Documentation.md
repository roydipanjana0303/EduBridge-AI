# EduBridge AI
## Project Concept, Implementation Plan, Architecture & Technology Stack

**Project type:** AI-powered digital learning platform  
**Team size:** 5 members  
**Development context:** Hackathon MVP  
**Architecture:** Modular monolith with a separate AI service

---

## 1. Executive Summary

EduBridge AI is an AI-powered learning platform that brings students, teachers, learning resources, and personalized academic support together in one place.

Students can access courses and notes, ask questions, take assessments, track their progress, and receive personalized learning recommendations. Teachers can upload learning materials, create assessments, and support students. An AI assistant helps explain concepts, answer questions based on uploaded study materials, and generate learning and career roadmaps.

A key differentiator is **Study Gap Recovery**: helping learners resume their education after a break by using their saved learning history, completed topics, and assessment results to create a practical revision plan. The platform will also support offline access to previously downloaded learning materials.

The hackathon goal is to deliver a working, demonstrable MVP—not every possible feature of a full-scale education platform.

## 2. The Problem We Are Addressing

Students often need to use several disconnected tools for their learning:

- One place for notes and study materials.
- Another place for courses and assessments.
- Separate channels to ask teachers questions.
- General-purpose AI tools that may not know the content of their class notes.
- No simple way to resume learning after a long study break.
- Limited access to learning materials when the internet is unavailable.

Teachers also need a straightforward way to share resources and assess student understanding.

This fragmented experience can make learning harder to organize, personalize, and continue consistently.

## 3. Our Solution

EduBridge AI provides a shared digital learning environment for students and teachers.

### 3.1 Student Features

- **Student account and dashboard:** View courses, learning progress, assessment results, study activity, and rewards.
- **Courses and subjects:** Browse available learning content and enroll in courses.
- **Notes and resources:** Access teacher-uploaded PDFs and other learning materials.
- **AI learning assistant:** Ask academic questions and receive explanations in accessible language.
- **Ask from my notes:** Ask questions about uploaded course materials. The AI retrieves relevant passages before generating an answer.
- **Assessments:** Attempt quizzes, submit answers, and review scores and explanations.
- **Career roadmap:** Enter a career goal and receive a suggested sequence of skills, topics, and projects.
- **Study Gap Recovery:** Receive a revision plan based on previously completed topics, saved progress, and assessment performance.
- **Progress and rewards:** Track learning activity and earn points for defined learning actions.
- **Offline learning:** Open previously downloaded notes and, where implemented, attempt downloaded quizzes without an internet connection.

### 3.2 Teacher Features

- Teacher registration and role-based access.
- Teacher dashboard.
- Create and manage courses or subjects.
- Upload notes and learning resources.
- Create quizzes and assessments.
- Review student results and learning progress.
- Respond to student questions.

### 3.3 Admin Capabilities (MVP or Future)

An administrator can manage users, courses, content, and platform-level settings. For a short hackathon, this can be a basic role or a future enhancement rather than a complete admin console.

## 4. What Makes EduBridge AI Different?

The platform is more than a conventional Learning Management System (LMS).

Its main differentiators are:

1. **AI grounded in study materials:** Students can ask questions about their own uploaded notes, rather than relying only on generic AI answers.
2. **Study Gap Recovery:** Learners can return after a break and receive a structured plan to revise and continue.
3. **Personalized career roadmaps:** Career goals are translated into manageable learning steps.
4. **Connected learning journey:** Notes, AI assistance, assessments, and progress tracking work together.
5. **Offline access:** Previously downloaded resources remain available when connectivity is lost.

## 5. Target Users and Main User Journeys

### Student journey

1. Register or log in as a student.
2. Open the student dashboard.
3. Browse a course or subject.
4. Read or download notes.
5. Ask the AI assistant a question about a topic or uploaded note.
6. Attempt a quiz.
7. Review the score and progress.
8. Receive a recommended next topic or revision plan.

### Teacher journey

1. Register or log in as a teacher.
2. Open the teacher dashboard.
3. Create or select a course or subject.
4. Upload notes or learning resources.
5. Create a quiz.
6. Review student submissions and results.

### Study Gap Recovery journey

1. A student returns after a period of inactivity.
2. The platform retrieves the student's saved learning progress and previous assessment results.
3. The system identifies incomplete or previously studied topics that may need revision.
4. The AI generates a suggested revision schedule.
5. The student follows the plan and completes revision quizzes.
6. Progress is updated as the student continues learning.

**Important:** In the MVP, this is a recommendation feature, not an automatic diagnosis of a student's knowledge. The plan should be based on available platform activity and should be editable by the student.

## 6. Hackathon MVP: Scope and Priorities

The team should prioritize a small number of complete, connected workflows.

### Priority 1 — Must work in the demo

- Student and teacher login.
- Role-specific dashboards.
- Course and subject listing.
- Teacher note upload and student note access.
- AI chatbot for academic questions.
- A basic notes-based question-answering flow, if time permits.
- Quiz attempt, submission, and score display.
- Basic progress tracking.
- Career roadmap generation.
- Study Gap Recovery plan generation.

### Priority 2 — Implement if time permits

- Offline PDF access using a PWA.
- Downloaded quiz attempts and later synchronization.
- Credit points and study streaks.
- Student doubt/question forum.
- Notifications and richer analytics.

### Future enhancements

- Advanced recommendation models.
- Real-time teacher-student communication.
- More subjects and course content.
- Advanced rewards and partner discounts.
- Native mobile applications.
- More sophisticated AI personalization.
- Scaling selected modules into separate services if required.

**MVP principle:** A complete end-to-end workflow is more valuable than many unfinished features.

## 7. Final Recommended Technology Stack

The stack is selected for a five-person team with mixed experience and a short development timeline.

| Layer | Technology | How it will be used |
|---|---|---|
| Frontend | React.js | Build student and teacher interfaces |
| Frontend language | TypeScript | Add type safety and reduce integration errors |
| Build tooling | Vite | Set up and run the React application |
| Styling | Tailwind CSS | Build responsive layouts quickly |
| Routing | React Router | Navigate between pages |
| API communication | Axios or Fetch | Call backend endpoints |
| Main backend | Java + Spring Boot | Implement application logic and REST APIs |
| Backend security | Spring Security + JWT | Authentication and role-based authorization |
| Database access | Spring Data JPA + Hibernate | Persist and retrieve relational data |
| Database | Supabase-hosted PostgreSQL | Shared cloud relational database |
| Database migrations | Flyway | Version and apply schema changes consistently |
| AI service | Python + FastAPI | Expose AI-specific endpoints |
| Generative AI | One selected LLM API | Chat answers, roadmaps, and revision plans |
| RAG | Embeddings + retrieval + LLM | Answer questions using uploaded study material |
| Vector search | pgvector (optional for MVP) | Store and search document embeddings |
| File storage | Supabase Storage | Store PDFs and uploaded learning materials |
| Offline support | PWA + Service Worker + IndexedDB | Cache the app and store downloaded content |
| API documentation | Springdoc OpenAPI / Swagger | Document and inspect backend APIs |
| API testing | Postman | Test and share API requests |
| Backend testing | JUnit + Mockito | Test Java application logic |
| Frontend testing | Vitest (as time permits) | Test frontend logic |
| Version control | Git + GitHub | Collaborate using branches and pull requests |
| Deployment | Vercel + Render (or equivalent) | Host frontend and backend services |

### Why PostgreSQL and Supabase?

PostgreSQL is a database system; it is not restricted to running locally. It can run on a developer's laptop or be hosted on a cloud server.

For this project, Supabase provides a managed, cloud-hosted PostgreSQL database. All authorized team members can connect to the same development database using credentials stored securely in their local environment.

Use Spring Boot as the main application backend and access PostgreSQL through Spring Data JPA. Supabase Storage can be used for files. Avoid implementing two competing authentication systems: Spring Security and JWT will own application authentication in this architecture.

### Why Spring Boot plus a separate FastAPI service?

Spring Boot will own the main application features: users, roles, courses, notes metadata, assessments, results, progress, and rewards.

FastAPI will own AI-specific processing: chatbot orchestration, document retrieval, roadmap generation, and revision-plan generation.

This keeps the core application consistent while allowing the AI developer to work independently. Spring Boot should call the AI service through documented HTTP endpoints.

### Why a modular monolith?

The main Spring Boot application will be one deployable application organized into feature modules. This is easier to build, test, and deploy during a hackathon than many microservices.

The AI service is separate because it uses a different language and AI ecosystem. Do not introduce Kubernetes or a full microservices platform for the MVP.

## 8. High-Level Architecture

```text
                         STUDENTS / TEACHERS
                                  |
                                  v
                    React + TypeScript + Vite
                       Tailwind CSS / PWA
                                  |
                           HTTPS / REST
                                  |
                                  v
                    JAVA + SPRING BOOT API
                    (Main application backend)
                                  |
             +--------------------+---------------------+
             |                    |                     |
             v                    v                     v
      Spring Security       Feature Modules       AI Service Client
          + JWT          - Users and roles              |
                         - Courses and subjects         | HTTP
                         - Notes metadata               v
                         - Assessments              Python FastAPI
                         - Results                      |
                         - Progress                     v
                         - Rewards                  LLM API
             |                                         |
             |                                         v
             |                                  RAG / Document Search
             |                                         |
             +--------------------+--------------------+
                                  |
                  +---------------+----------------+
                  |                                |
                  v                                v
          Supabase PostgreSQL               Supabase Storage
          Structured application data       PDFs and study files

         Browser offline layer:
         Service Worker + IndexedDB
         (cached app, downloaded notes, pending quiz data)
```

### Request flow examples

**Normal application request:**

1. React sends an API request with the user's JWT.
2. Spring Security validates the token and permissions.
3. The relevant Spring Boot module executes the business logic.
4. Spring Data JPA reads or updates PostgreSQL.
5. Spring Boot returns a response to React.

**AI chatbot request:**

1. React sends a question to `POST /api/ai/chat`.
2. Spring Boot validates the user and forwards the request to FastAPI.
3. FastAPI retrieves relevant content if the question is about uploaded notes.
4. FastAPI sends the question and relevant context to the selected LLM API.
5. The generated response returns through Spring Boot to React.

## 9. Database Design — Initial Tables

The initial relational database can include the following tables:

| Table | Purpose |
|---|---|
| users | Student, teacher, and admin accounts |
| courses | Course information and ownership |
| subjects | Subjects associated with courses |
| enrollments | Student-course relationships |
| notes | File metadata, subject, uploader, and storage key |
| assessments | Quiz or test information |
| questions | Assessment questions and answer data |
| results | Student submissions and scores |
| learning_progress | Completed topics and learning activity |
| roadmaps | Student career goal and generated roadmap |
| rewards | Points earned and reason for earning them |
| doubts | Student questions and responses |

Potential supporting tables:

- `assessment_options` for multiple-choice options, if normalized separately.
- `document_chunks` for extracted document text and embeddings.
- `download_records` if server-side tracking of downloads is needed.
- `activity_log` for learning events used by Study Gap Recovery.

### Database conventions

- Use UUID primary keys.
- Define foreign keys and appropriate indexes.
- Store timestamps consistently.
- Use migrations rather than manually changing shared schemas.
- Store file paths/storage keys in PostgreSQL, not the PDF binary itself.
- Do not store plaintext passwords; use a secure password encoder through Spring Security.
- Keep a separate production database from the development database.

## 10. API Contract — Initial Endpoints

The following endpoints should be agreed upon before parallel development.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/users/me` | Get current user profile |
| GET | `/api/courses` | List available courses |
| POST | `/api/courses` | Create a course (teacher only) |
| GET | `/api/notes` | List accessible notes |
| POST | `/api/notes` | Upload a note (teacher only) |
| GET | `/api/assessments` | List assessments |
| POST | `/api/assessments/{id}/submit` | Submit quiz answers |
| GET | `/api/progress` | Retrieve student progress |
| GET | `/api/rewards` | Retrieve reward balance/history |
| POST | `/api/ai/chat` | Ask the AI assistant |
| POST | `/api/ai/roadmap` | Generate a career roadmap |
| POST | `/api/ai/recovery-plan` | Generate a revision plan |

The endpoint list is an initial contract. The team should define request and response JSON, validation rules, authentication requirements, and error formats in `docs/API_CONTRACT.md`.

### Example AI chatbot request

```json
{
  "question": "Explain linear equations in simple words",
  "documentId": "optional-document-uuid"
}
```

### Example AI chatbot response

```json
{
  "answer": "A linear equation is an equation where the highest power of the variable is one.",
  "sources": [
    {
      "documentId": "example-document-uuid",
      "page": 3
    }
  ]
}
```

The actual response schema should be finalized by the backend and AI developers together.

## 11. AI Implementation Plan

### 11.1 General academic chatbot

- Accept a student's question.
- Send the question to the selected LLM API.
- Request a clear explanation with examples.
- Return the answer to the frontend.

### 11.2 Notes-based chatbot (RAG)

For questions about teacher-uploaded PDFs:

1. Teacher uploads a PDF.
2. The file is stored in Supabase Storage.
3. A processing task extracts text from the PDF.
4. Text is split into manageable chunks.
5. An embedding model converts chunks into vectors.
6. Store chunks, document references, and vectors in PostgreSQL with pgvector.
7. When a student asks a question, convert the question into an embedding.
8. Retrieve relevant chunks using similarity search.
9. Send the question and retrieved context to the LLM.
10. Return an answer with available document/page references.

For a very short hackathon, begin with simple PDF text extraction and retrieval. Add embeddings and pgvector if time and API access allow. The chatbot should clearly indicate when uploaded material does not contain enough information.

### 11.3 Career roadmap

Input:

- Career goal.
- Current skill level.
- Available study time.
- Optional interests or completed topics.

Output:

- Learning stages.
- Topics and skills.
- Suggested sequence.
- Practice tasks or projects.
- Suggested weekly plan.

Save the generated roadmap so the student can revisit it.

### 11.4 Study Gap Recovery

Use existing learning data:

- Last recorded learning activity.
- Completed topics.
- Incomplete topics.
- Previous assessment scores.
- Saved courses and notes.

Generate a suggested revision plan with:

- Topics to revise.
- Recommended order.
- Practice questions.
- Suggested schedule.

Do not claim that the AI can reliably know everything a student remembers. The plan is a recommendation and should allow the student to update their knowledge level.

## 12. Offline Learning Plan

Use a Progressive Web App (PWA).

### MVP offline workflow

1. Student opens a note while online.
2. Student chooses to download it.
3. The PDF is stored in browser-managed local storage or an appropriate IndexedDB-backed cache.
4. Student can reopen the downloaded file offline.
5. If downloaded quizzes are implemented, save quiz answers locally with a pending-sync status.
6. When the connection returns, synchronize pending submissions with the backend.
7. Prevent duplicate submissions by using unique submission IDs and server-side idempotency checks.

The service worker should cache the application shell and static assets. Do not cache private API responses indiscriminately. Offline AI chat is out of scope for the initial MVP.

## 13. Five-Member Team Allocation

Work should be divided by ownership, with shared integration responsibilities.

| Member | Primary ownership | Main technologies | Deliverables |
|---|---|---|---|
| Member 1 | Frontend foundation and dashboards | React, TypeScript, Tailwind | Landing page, student dashboard, teacher dashboard, reusable components |
| Member 2 | Authentication and user management | Java, Spring Boot, Spring Security, JWT | Registration, login, roles, profile APIs |
| Member 3 | Learning management and database | Spring Boot, JPA, PostgreSQL, Supabase Storage | Courses, notes, quizzes, results, progress, rewards |
| Member 4 | AI service | Python, FastAPI, LLM API, RAG | Chatbot, notes Q&A, career roadmap, recovery plan |
| Member 5 | Offline experience and integration | React, PWA, IndexedDB, Postman | Offline notes, downloaded quiz support, integration tests, deployment coordination |

### Shared responsibilities

- Member 1 and Member 5 coordinate frontend components and routing.
- Members 2 and 3 agree on entity relationships, database migrations, and API conventions.
- Members 3 and 4 agree on document metadata and how uploaded files are passed to the AI service.
- Members 2 and 4 agree on the Spring Boot-to-FastAPI request/response contract.
- All members test their features with the integrated application.
- One designated team coordinator tracks blockers, merges, and demo readiness.

The division can be adjusted based on individual strengths, but every module should have one clear owner.

## 14. GitHub and Collaboration Workflow

Use a single repository (monorepo):

```text
edubridge-ai/
|
|-- frontend/
|   |-- src/
|       |-- components/
|       |-- pages/
|       |   |-- student/
|       |   |-- teacher/
|       |   |-- auth/
|       |-- services/
|       |-- hooks/
|       |-- App.tsx
|
|-- backend/
|   |-- src/main/java/com/edubridge/
|       |-- auth/
|       |-- user/
|       |-- course/
|       |-- notes/
|       |-- assessment/
|       |-- progress/
|       |-- rewards/
|       |-- config/
|   |-- pom.xml
|
|-- ai-service/
|   |-- app/
|       |-- main.py
|       |-- chatbot.py
|       |-- roadmap.py
|       |-- recovery.py
|   |-- requirements.txt
|
|-- database/
|   |-- migrations/
|   |-- schema.sql
|
|-- docs/
|   |-- API_CONTRACT.md
|   |-- DATABASE_SCHEMA.md
|
|-- README.md
```

### Branch strategy

- `main`: stable, demo-ready code.
- `develop`: integrated development branch.
- `feature/frontend-dashboard`
- `feature/authentication`
- `feature/learning-management`
- `feature/ai-chatbot`
- `feature/offline-learning`

### Collaboration rules

1. No direct pushes to `main`.
2. Each member works on a feature branch.
3. Use pull requests to merge into `develop`.
4. Review and test changes before merging.
5. Keep commits small and descriptive.
6. Share API changes with affected teammates.
7. Do not commit `.env` files, credentials, tokens, or private keys.
8. Use a shared Postman collection and API documentation.

## 15. Development Checkpoints

The exact schedule should be adapted to the hackathon duration. These checkpoints provide the order of work.

### Checkpoint 1 — Foundation

- Create the GitHub repository.
- Set up frontend, backend, and AI service.
- Create the Supabase project.
- Establish environment variables.
- Agree on database schema and API contracts.
- Prepare basic UI wireframes.

**Exit condition:** All three applications run locally and the team can connect to the shared development database.

### Checkpoint 2 — Parallel implementation

- Build student and teacher dashboards.
- Implement authentication and user roles.
- Implement courses, notes, and assessment APIs.
- Build the chatbot and roadmap service.
- Build offline notes functionality.

**Exit condition:** Each module works independently with mock data or its local dependencies.

### Checkpoint 3 — Integration

- Connect React to Spring Boot.
- Connect Spring Boot to FastAPI.
- Connect the backend to PostgreSQL.
- Connect note uploads to file storage.
- Connect the chatbot to the AI provider.
- Test the main student and teacher journeys.

**Exit condition:** The main workflow works from the browser through the backend and database.

### Checkpoint 4 — Testing and stabilization

- Test student and teacher permissions.
- Test file upload and access controls.
- Test quiz submission and score calculation.
- Test AI errors and missing-context responses.
- Test offline downloads if implemented.
- Fix integration issues and UI bugs.

**Exit condition:** No critical issue blocks the planned demo.

### Checkpoint 5 — Deployment and presentation

- Deploy the frontend.
- Deploy Spring Boot and FastAPI services.
- Configure cloud database and file storage.
- Set production environment variables.
- Create demo student and teacher accounts.
- Prepare sample course material and questions.
- Rehearse the demo.
- Keep a short backup demo recording.

**Exit condition:** The judges can access or watch a reliable demonstration.

## 16. Deployment Plan

A simple initial hosting plan:

| Component | Suggested hosting |
|---|---|
| React frontend | Vercel |
| Spring Boot API | Render or another Java-compatible host |
| FastAPI AI service | Render or another Python-compatible host |
| PostgreSQL | Supabase |
| Uploaded files | Supabase Storage |

Before choosing a hosting plan, verify current free-tier limits, service sleep behavior, database connection limits, and environment-variable support. Free services may sleep or have usage restrictions, so prepare a local demo fallback.

### Environment variables

Example backend configuration:

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

jwt.secret=${JWT_SECRET}
ai.service.url=${AI_SERVICE_URL}
```

Example frontend configuration:

```env
VITE_API_BASE_URL=https://your-backend-host
```

Example AI service configuration:

```env
LLM_API_KEY=your-secret-key
DATABASE_URL=your-database-connection
```

These are placeholders. Real credentials must be stored in local environment files or the hosting provider's secret manager, never committed to GitHub.

## 17. Security and Reliability Considerations

Even for a hackathon prototype:

- Hash passwords using a secure password encoder.
- Enforce student/teacher permissions on the backend, not only in the frontend.
- Validate uploaded file types and sizes.
- Restrict access to private notes and documents.
- Keep API keys and database credentials secret.
- Use HTTPS for deployed services.
- Avoid logging passwords, JWTs, or sensitive student information.
- Validate quiz submissions on the server.
- Prevent users from changing their own reward balances.
- Handle AI API failures and rate limits gracefully.
- Provide clear error messages when an AI response cannot be generated.

## 18. Risks and Mitigation

| Risk | Mitigation |
|---|---|
| Team members block one another | Agree on API contracts and use mock responses |
| Database schema conflicts | One owner for migrations; review schema changes |
| AI API quota or latency | Use one provider, limit requests, prepare fallback responses |
| RAG takes too long | Start with basic retrieval; add embeddings if feasible |
| Deployment problems | Deploy a simple working version early |
| Offline synchronization bugs | Prioritize offline PDF access; treat quiz sync as optional |
| Too many unfinished features | Freeze scope and focus on the main demo journey |

## 19. Hackathon Demonstration Script

The following demo tells one connected story:

1. **Login:** Log in as a teacher and show the teacher dashboard.
2. **Upload:** Upload a sample mathematics PDF.
3. **Student access:** Log in as a student and open the uploaded note.
4. **AI assistant:** Ask the chatbot to explain a concept from the note.
5. **Assessment:** Attempt a short quiz and submit answers.
6. **Progress:** Show the updated result and learning progress.
7. **Career roadmap:** Enter a career goal and generate a roadmap.
8. **Study Gap Recovery:** Show how a student with an earlier learning history can receive a revision plan.
9. **Offline:** If implemented, disconnect the internet and reopen a previously downloaded PDF.

The team should demonstrate only features that have been tested end to end. If a feature is not ready, present it as a planned enhancement rather than implying that it works.

## 20. Success Criteria

The hackathon MVP is successful when:

- A student and a teacher can log in with different permissions.
- A teacher can upload a learning resource.
- A student can access that resource.
- The AI assistant can answer an academic question.
- The platform can generate a career roadmap.
- A student can complete a quiz and see a score.
- Learning progress can be retrieved.
- A Study Gap Recovery plan can be generated from saved learning data.
- The deployed or local demo can run reliably.

Offline access is an additional success criterion if it fits the available development time.

## 21. Project Pitch

**Short pitch:**

EduBridge AI is an AI-powered digital learning platform that connects students, teachers, and personalized learning resources in one place. It combines course and notes management, AI-powered academic assistance, assessments, career roadmaps, and progress tracking. Its distinctive Study Gap Recovery feature helps learners resume their education after a break using their saved learning history and a personalized revision plan. With offline access to downloaded resources, EduBridge AI aims to make learning more continuous, accessible, and personalized.

**One-line tagline:**

*Learn continuously. Recover confidently. Grow with AI.*

---

## 22. Final Technology and Architecture Decisions

For the hackathon, the team will use:

- **React + TypeScript + Vite + Tailwind CSS** for the frontend.
- **Java + Spring Boot** for the main backend.
- **Spring Security + JWT** for authentication and authorization.
- **Supabase PostgreSQL** for shared cloud relational data.
- **Supabase Storage** for uploaded PDFs and notes.
- **Python + FastAPI** for the separate AI service.
- **One LLM API** for chatbot, roadmap, and recovery-plan generation.
- **RAG + pgvector** for notes-based question answering, if time permits.
- **PWA + IndexedDB** for offline access.
- **GitHub + Postman** for collaboration and API testing.
- **Vercel + Render** for initial deployment.

**Architecture decision:** A modular monolithic Spring Boot backend plus one separate FastAPI AI service. Keep the system simple, integrate early, and prioritize a reliable end-to-end student learning journey.
