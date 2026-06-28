# Technical Notes

This assignment was approached with the assumption that it is a time-boxed take-home exercise. Rather than optimizing for a highly scalable production system, I prioritized delivering a complete, maintainable, and well-structured application while demonstrating architectural thinking, separation of concerns, and clean code practices. Throughout the implementation, I intentionally made several trade-offs, which are described below. I tried to make this as lean as possible in order to deliver this as the MVP, so it shouldn't take much time.

## Installation

### Install dependencies for both applications.

```
- Frontend
cd frontend
npm install

- Backend
cd backend
npm install
```

### Running the Application
```
cd backend
npm run start

The backend will start at: http://localhost:3000
```
```
cd frontend
cp .env.example .env
npm run dev

The frontend will start at: http://localhost:5173
```

## Tech Stack

### Frontend

- Vue 3
- Vite
- TypeScript
- Pinia
- Vue Router

### Backend

- NestJS
- TypeScript


## Frontend Architecture

### Goal

The frontend architecture prioritizes maintainability, readability, and fast development over premature optimization or large-scale extensibility.

### Project Structure

The application is organized around pages and business entities.

```
pages/
components/
  product/
  common/
  layout/
store/
assets/
models/
router/
```

* `pages/` represent application routes and compose business components.
* `components/` are grouped by business entity rather than by page, encouraging reuse across multiple screens (Product List, Product Detail, Product Form, etc.). If there will be more business entity, it will be seperated here. Shared UI components (buttons, inputs, modal, search bar) are placed under `common/`.

This approach keeps related functionality close together while remaining easy to navigate for a project of this size.

### State Management

The application uses a centralized store (Pinia) as the single source of truth for frontend state.

Each store represents a business entity (e.g. Product) and is responsible for:

- Maintaining application state
- Communicating with the backend API
- Encapsulating application logic related to the entity
- Exposing a clean interface for pages and components

By moving data fetching and state management into the store, page components remain focused on presentation and user interaction instead of networking concerns.

## Backend Architecture

### Goal

The backend follows a lightweight layered architecture that separates concerns while remaining intentionally lean for a time-boxed assignment. Implemented with NestJS since we're trying accelerate development while providing a solid architectural foundation, and easy to growth for maintainability.

### Separation of Concerns

Each layer has a single responsibility.

* **Controller**

  * Handles HTTP requests and responses.

* **Application Service**

  * Contains business rules.

* **Repository**

  * Responsible only for loading, querying, and persisting product data.
  * Abstracts the storage mechanism from the rest of the application.
  * Only load data from `products.json` when application is started, to prevent mutation of source of truth

## Future Improvements

Given additional time, I would continue improving the project in the following areas:

- Testing (Unit tests, Integration tests, E2E)
- Authentication and Authorization
- Performance
    - Pagination
    - Sorting
    - Caching
- Logging and structured error