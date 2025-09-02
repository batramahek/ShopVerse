# Ecommerce Frontend

This is the frontend React application for the Ecommerce platform.

## Features

- User authentication (login/signup)
- Product browsing and search
- Shopping cart management
- Order placement and tracking
- User profile management

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will open in your browser at `http://localhost:3000`.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
frontend/
├── public/          # Static files
├── src/             # Source code
│   ├── components/  # React components
│   ├── pages/       # Page components
│   ├── services/    # API services
│   ├── utils/       # Utility functions
│   └── App.js       # Main App component
├── package.json     # Dependencies and scripts
└── README.md        # This file
```

## API Integration

The frontend communicates with the backend API running on `http://localhost:8080`. The proxy is configured in `package.json` to handle CORS during development.

## Technologies Used

- React 18
- React Router for navigation
- Axios for HTTP requests
- CSS for styling
