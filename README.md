Event Planner Application
Welcome to the Event Planner application! This project is a full-stack web application designed to help users organize and manage various events efficiently. Whether it's a birthday party, a corporate meeting, or a wedding, this application provides the tools to plan and track all necessary details.

✨ Features
User Authentication: Secure user registration and login.

Event Creation & Management: Users can create, view, update, and delete their events.

Detailed Event Information: Add event name, date, time, location, description, and guest lists.

Guest Management: Track attendees, RSVPs, and guest details.

Responsive Design: Optimized for various screen sizes, from mobile to desktop.

🚀 Technologies Used
This project leverages a modern MERN (MongoDB, Express.js, React, Node.js) stack to deliver a robust and scalable solution.

Frontend
React: A JavaScript library for building user interfaces.

React Router: For declarative routing in React applications.

Tailwind CSS: A utility-first CSS framework for rapid UI development.

Axios: A promise-based HTTP client for making API requests.

Backend
Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine.

Express.js: A fast, unopinionated, minimalist web framework for Node.js.

MongoDB: A NoSQL database for storing event and user data.

Mongoose: An ODM (Object Data Modeling) library for MongoDB and Node.js.

JWT (JSON Web Tokens): For secure user authentication.

Bcrypt.js: For password hashing.

CORS: Middleware to enable Cross-Origin Resource Sharing.

⚙️ Setup and Installation
Follow these steps to get the project up and running on your local machine.

Prerequisites
Node.js (LTS version recommended)

npm (comes with Node.js) or Yarn

MongoDB installed and running, or a MongoDB Atlas account

1. Clone the repository
git clone <your-repository-url>
cd sdnproject # Or whatever your project's root folder is named

2. Backend Setup
Navigate to the backend directory, install dependencies, and configure your environment.

cd backend
npm install # Or yarn install

Create a .env file in the backend directory with the following variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string # e.g., mongodb://localhost:27017/eventplanner_db or your Atlas URI
JWT_SECRET=your_jwt_secret_key # Use a strong, random string

3. Frontend Setup
Navigate to the frontend directory, install dependencies, and configure your environment.

cd ../frontend # Go back to root and then into frontend
npm install # Or yarn install

Create a .env file in the frontend directory with the following variables:

REACT_APP_API_BASE_URL=http://localhost:5000/api # Or your backend API URL

▶️ How to Run the Application
1. Start the Backend Server
From the backend directory:

npm start # Or node server.js (if your start script is not defined)

The backend server will run on http://localhost:5000 (or your specified PORT).

2. Start the Frontend Development Server
From the frontend directory:

npm start

The frontend application will open in your browser at http://localhost:3000 (or a similar port).

📄 License
This project is open source and available under the MIT License. (You can change this to your preferred license).
