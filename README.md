
<img src="front/public/logo.png" alt="Logo" width="200" height="200">

# LLMrest
- **Live Demo:** [https://igot-this.vercel.app/](https://igot-this.vercel.app/)
- Please use: **admin.admin@com** and **admin** to fast access the demo  

A full-stack prompt management and sharing platform built with:

- **Frontend:** React (Vite)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (via Mongoose)
- **Authentication:** JWT, Google OAuth
- **Deployment:** Frontend on Vercel, Backend on Render

---

## Features

- User registration, login, and Google OAuth
- Prompt creation, listing, and detail view
- Tag-based filtering and search
- Password reset via email (secure token)
- Responsive, modern UI with dark mode
- Secure, RESTful API with proper error handling

---

## Local Development

### 1. **Clone the repository**

```bash
git clone https://github.com/yourusername/llmrest.git
cd llmrest
```

### 2. **Backend Setup (`back/`)**

- Install dependencies:
  ```bash
  cd back
  npm install
  ```
- Create a `.env` file in `back/` with:
  ```
  MONGODB_URI=your_mongodb_atlas_uri
  JWT_SECRET=your_jwt_secret
  SESSION_SECRET=your_session_secret
  EMAIL_USER=your_email@gmail.com
  EMAIL_PASS=your_gmail_app_password
  FRONTEND_URL=http://localhost:5173
  ```
- Start the backend:
  ```bash
  npm start
  ```
  The backend will run on `http://localhost:3001`.

### 3. **Frontend Setup (`front/`)**

- Install dependencies:
  ```bash
  cd ../front
  npm install
  ```
- Create a `.env` file in `front/` with:
  ```
  VITE_API_URL=http://localhost:3001/api
  ```
- Start the frontend:
  ```bash
  npm run dev
  ```
  The frontend will run on `http://localhost:5173`.

---

## Deployment

### **Backend: Render**

1. **Push your backend code to GitHub.**
2. **Create a new Web Service on [Render](https://render.com/):**
   - Root directory: `back`
   - Build command: `npm install`
   - Start command: `npm start`
3. **Set environment variables in Render:**
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `SESSION_SECRET`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `FRONTEND_URL=https://your-frontend-url.vercel.app`
4. **Deploy.**  
   Your backend will be available at `https://your-backend.onrender.com`.

### **Frontend: Vercel**

1. **Push your frontend code to GitHub.**
2. **Import your repo on [Vercel](https://vercel.com/):**
   - Set the root directory to `front/` if prompted.
3. **Set environment variable in Vercel:**
   - `VITE_API_URL=https://your-backend.onrender.com/api`
4. **Deploy.**  
   Your frontend will be available at `https://yourproject.vercel.app`.

---

## Environment Variables

### **Backend (`back/.env` or Render dashboard):**
- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — Secret for JWT signing
- `SESSION_SECRET` — Secret for Express session
- `EMAIL_USER` — Email address for sending password reset emails (use Gmail App Password)
- `EMAIL_PASS` — App password for the above email
- `FRONTEND_URL` — URL of your deployed frontend (for password reset links)

### **Frontend (`front/.env` or Vercel dashboard):**
- `VITE_API_URL` — URL of your deployed backend (e.g., `https://your-backend.onrender.com/api`)

---

## Security Notes

- **Never commit your `.env` files to git.**
- Use strong secrets for JWT and session.
- Use an App Password for Gmail, not your real password.
- Restrict MongoDB Atlas IP access for production.

---

