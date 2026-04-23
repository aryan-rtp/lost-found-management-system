# Lost & Found Item Management System

A full-stack MERN application for reporting and claiming lost and found items.

## Technologies Used
- MongoDB & Mongoose
- Express.js
- React.js with Bootstrap
- Node.js
- JWT for Authentication

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB URI (local or Atlas)

### Backend Setup
1. Navigate to the `Backend` directory:
   \`\`\`bash
   cd Backend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Create a `.env` file in the Backend root with:
   \`\`\`
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/lostandfound
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   \`\`\`
4. Run the server:
   \`\`\`bash
   npm run dev
   \`\`\`

### Frontend Setup
1. Navigate to the `Frontend` directory:
   \`\`\`bash
   cd Frontend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the Vite development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login a user and get token

### Items (Protected routes require Bearer Token)
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get item by ID
- `GET /api/items/search?name=term` - Search items
- `POST /api/items` - Create an item
- `PUT /api/items/:id` - Update an item (must be owner)
- `DELETE /api/items/:id` - Delete an item (must be owner)