# backend_c

A minimal C API server with JWT-based user authentication middleware, following the structure and principles of the Node.js backend.

## Structure

- src/main.c: Entry point and server logic
- src/middleware/fetchuser.c: Middleware for JWT authentication
- src/middleware/fetchuser.h: Header for fetchuser middleware
- Makefile: Build instructions

## Build & Run

```
make
./backend_c_server
```
