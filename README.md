# User Management App
A web application for managing user registration, authentication, and administration, built with modern web technologies.

## Technologies Used

- **Frontend:**
  - React
  - Vite
  - Bootstrap
  - Firebase Authentication

- **Backend:**
  - Node.js
  - Express.js
  - MySQL
  - Firebase Admin SDK

- **Deployment:**
  - Netlify (Frontend)
  - Render (Backend)
  - Google Cloud SQL (Database)

## Project Structure

```

user-management-app/
│
├── backend/
│   ├── index.js
│
│
├── client/
│   ├── public/
│   │   ├── asset1.svg
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── firebase.js
│   │   ├── main.jsx
│   │   ├── components/
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── styles.css
│   │   ├── utils/
│   │   │   ├── helpers.jsx
│   ├── index.html
│
└── README.md

```
## Deployment
* The frontend is deployed on Netlify.
* The backend is deployed on Render.
* The database is hosted on Google Cloud SQL.
## Usage
* Register a new user via the registration page.
* Login with the registered user credentials.
* Manage users from the admin panel (accessible after login).
## License
This project is licensed under the MIT License.
