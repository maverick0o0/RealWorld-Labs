Docker Setup

Ensure Docker + Docker Compose are installed.

(Optional) Create .env in project root.

Build & run:
```
docker compose up --build
```

Stop:
```
docker compose down
```

Login Credentials
```
User:  user / user
Admin: admin / admin
```

API Endpoints (JWT required)
POST /login

Returns authentication token.

GET /notes

Fetch all notes (fields vary by role).

POST /notes

Create a new note.

DELETE /notes/:id

Delete note (authorized users only).