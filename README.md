# Result Portal

## Project Overview

Result Portal is a React-based web application designed for managing and viewing student exam results. It provides user authentication, a dashboard to search and filter results, detailed views of individual results, and a CSV upload feature for bulk result import.

### Features

- User authentication (login/signup) with session persistence
- Dashboard for viewing exam results with search, subject filter, and date range filter
- Paginated and sortable results table for better data navigation
- Detailed view of individual result records
- CSV upload form for bulk uploading results
- Responsive styling using styled-components
- Routing with protected routes using react-router-dom
- API communication via axios with error handling
- Unit and integration tests for critical components
- Docker support for easy local development and production deployment

---

## Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)
- Docker and Docker Compose (for containerized setup, optional)
- A backend API server exposing endpoints for `/results` and `/results/upload` (or use the placeholder backend)

---

## Installation

1. Clone the repository:

    git clone https://github.com/yourusername/result-portal.git
    cd result-portal

2. Install dependencies:

    npm install

3. Create a `.env` file based on `.env.example`:

    cp .env.example .env

4. Configure the backend API URL in `.env`:

    REACT_APP_API_BASE_URL=http://localhost:5000/api

---

## Running the Application

### Development Mode

Start the React app locally:

    npm start

This will run the app at `http://localhost:3000/`. The app expects the backend API to be running at the URL specified in `.env`.

### Running with Docker Compose

Ensure Docker and Docker Compose are installed. Then run:

    docker-compose up --build

- Frontend will be available at `http://localhost:3000/`
- Backend API placeholder will run at `http://localhost:5000/`

---

## Testing

Run unit and integration tests with:

    npm test

This will launch the test runner in watch mode.

---

## Configuration

### Environment Variables

- `REACT_APP_API_BASE_URL`: URL of the backend API endpoint (e.g., `http://localhost:5000/api`)

Make sure to set this variable correctly in `.env` before running the app.

---

## Usage

1. Open the app in a browser at `http://localhost:3000/`
2. Sign up or log in with your credentials
3. Use the dashboard to search and filter exam results
4. Click on a result row to view detailed information
5. Navigate to the Upload page to upload a CSV file with results

### CSV Upload Format

The CSV must contain the following columns (in any order):

- `studentName` (string)
- `subject` (string)
- `score` (number)
- `date` (ISO date string or YYYY-MM-DD)
- `remarks` (optional string)

Example CSV content:

    studentName,subject,score,date,remarks
    John Doe,Mathematics,88,2023-05-01,Excellent performance
    Jane Smith,Physics,79,2023-05-01,Good effort

---

## Troubleshooting

- **App does not load or shows network errors:**
  - Verify your backend API is running and accessible at the URL set in `.env`.
  - Check the browser console for detailed error messages.

- **Login/Signup fails:**
  - Ensure backend authentication service is running.
  - Check network requests in browser dev tools.

- **CSV upload fails:**
  - Confirm your CSV file is correctly formatted.
  - Check API response messages for errors.

- **Docker issues:**
  - Ensure Docker and Docker Compose are installed and running.
  - Check container logs with `docker-compose logs`.

---

## Project Structure

