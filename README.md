# 🌐 Multi-language Personal Blog

A full-stack multi-language (English & Dutch) personal blog with an admin panel, article management, likes, and comments functionality.

## ✨ Features

### 👤 Public
- **Multi-language support** (English / Dutch)
- Blog listing with **images** and **like counter**
- Single blog view with **full content**
- **Comments system** for users
- Responsive design

### 🛠 Admin
- Secure authentication
- Create, edit, and delete blog articles
- Upload and manage images
- Manage comments
- Admin dashboard

---

## 📂 Project Structure
The repository contains both **frontend** and **backend** in separate folders:

```
/frontend  # React + Vite client
/backend   # Express.js API
```

---

## 🖥 Tech Stack

### Frontend
- [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- [React Router DOM](https://reactrouter.com/)
- [i18next](https://www.i18next.com/) (multi-language)
- [Framer Motion](https://www.framer.com/motion/) (animations)
- [React Markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm) (Markdown support)
- [Axios](https://axios-http.com/)
- [Lucide-react](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)

### Backend
- [Express.js](https://expressjs.com/)
- [SQLite3](https://www.sqlite.org/index.html)
- [JWT](https://jwt.io/) Authentication
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) (password hashing)
- [Multer](https://github.com/expressjs/multer) (file uploads)
- [Cloudinary](https://cloudinary.com/) (image hosting)
- [cors](https://github.com/expressjs/cors)
- [dotenv](https://github.com/motdotla/dotenv)

---

## 🚀 Installation & Setup

### 1️⃣ Clone repository
```bash
git clone https://github.com/username/project-name.git
cd project-name
```

### 2️⃣ Backend setup
```bash
cd backend
npm install
```
Create `.env` file in `/backend`:
```env
PORT=4000
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Run backend:
```bash
node server.js
```

### 3️⃣ Frontend setup
```bash
cd ../frontend
npm install
```
Run frontend:
```bash
npm run dev
```

---

## 🔗 API Endpoints

| Method | Endpoint             | Description |
|--------|----------------------|-------------|
| POST   | `/api/auth/login`    | User/Admin login |
| POST   | `/api/auth/register` | User registration |
| GET    | `/api/articles`      | Get all articles |
| GET    | `/api/articles/:id`  | Get single article |
| POST   | `/api/articles`      | Create article (admin) |
| PUT    | `/api/articles/:id`  | Update article (admin) |
| DELETE | `/api/articles/:id`  | Delete article (admin) |
| POST   | `/api/likes/:id`     | Like an article |
| POST   | `/api/comments/:id`  | Add comment |

---

## 📸 Screenshots

*(Add screenshots here if you have them)*

---

## 📄 License
This project is licensed under the MIT License.
