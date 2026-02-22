# 🛒 MERN E-Commerce Mobile Web Application


A modern, mobile-first E-Commerce web application built using the MERN Stack (MongoDB, Express.js, React.js, Node.js).  
This platform allows users to browse products, manage carts, place orders, and enables admins to manage and accept orders.

---

# 📌 Live Features

## 👤 User Side
- 🔐 Secure Authentication (JWT)
- 🛍️ Browse Products
- 📄 View Product Details
- 🛒 Add to Cart / Remove from Cart
- 📦 Place Orders
- 📱 Fully Responsive Mobile Design

## 👨‍💼 Admin Panel
- 📊 View Order Analytics
- 📦 Manage Orders
- ✅ Accept / Update Order Status
- 🔒 Protected Admin Routes

---

# 🛠️ Tech Stack

## Frontend
- React.js
- React Router DOM
- Axios
- Tailwind CSS / CSS
- Framer Motion (Animations)

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- RESTful APIs

---

# 📂 Folder Structure
mern-ecommerce-mobile/
│
├── client/ # React Frontend
│ ├── components/
│ ├── pages/
│ ├── context/
│ └── App.js
│
├── server/ # Backend (Node + Express)
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ ├── middleware/
│ └── server.js
│
└── README.md


---

# ⚙️ Installation Guide

## 1️⃣ Clone Repository


git clone https://github.com/your-username/mern-ecommerce-mobile.git

cd mern-ecommerce-mobile


---

## 2️⃣ Setup Backend


cd server
npm install


### Create `.env` file inside server folder:


MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000


Run backend:


npm run dev


---

## 3️⃣ Setup Frontend


cd client
npm install
npm start


---

# 🔐 Authentication System

- JWT-based login & registration
- Role-based access (Admin / User)
- Protected routes using middleware
- Token stored securely on client-side

---

# 🌟 Key Functionalities

✔ Mobile-first responsive UI  
✔ Order management system  
✔ Admin-only dashboard access  
✔ REST API integration  
✔ Clean and scalable folder structure  
✔ Modern UI with animations  

---

# 📊 API Endpoints (Example)

### Auth
- POST /api/auth/register
- POST /api/auth/login

### Products
- GET /api/products
- GET /api/products/:id

### Orders
- POST /api/orders
- GET /api/orders (Admin Only)
- PUT /api/orders/:id (Admin Only)

---

# 🚀 Future Improvements

- 💳 Payment Gateway Integration (Stripe / JazzCash / PayPal)
- ⭐ Product Reviews & Ratings
- ❤️ Wishlist System
- 📦 Order Tracking
- 🌙 Dark / Light Mode
- 🔔 Notifications

---

# 📸 Screenshots

(Add screenshots here)

---

# 🧠 Learning Outcomes

- Full MERN Stack Development
- RESTful API Design
- JWT Authentication
- Role-Based Authorization
- State Management
- Mobile Responsive UI Design

---

# 👨‍💻 Author

**Mustafa Safdar**  
Computer Science Student  
MERN Stack Developer  

---

# 📄 License

This project is developed for educational and portfolio purposes.
# 🛍️ E-Commerce Mobile Web – Frontend

A modern, responsive mobile-first E-Commerce frontend built using React.js.  
This application provides a smooth shopping experience with authentication, product browsing, cart management, and protected routes.

---

# 🚀 Features

## 👤 User Features
- 🔐 Login & Registration (JWT Based)
- 🛍️ Product Listing Page
- 📄 Product Details Page
- 🛒 Add to Cart / Remove from Cart
- 📦 Place Order
- 🔒 Protected Routes
- 📱 Fully Responsive Mobile Design
- 🎨 Smooth Animations (Framer Motion)

## 👨‍💼 Admin Features
- 📊 Analytics Dashboard
- 📦 Manage Orders
- ✅ Accept / Update Order Status

---

# 🛠️ Tech Stack

- React.js
- React Router DOM
- Axios
- Context API / Redux (if used)
- Tailwind CSS / CSS
- Framer Motion
- JWT Authentication

---

# 📂 Folder Structure


client/
│
├── src/
│ ├── components/
│ ├── pages/
│ ├── context/
│ ├── services/
│ ├── hooks/
│ ├── App.js
│ └── index.js
│
├── public/
└── package.json


---

# ⚙️ Installation Guide

## 1️⃣ Clone Repository


git clone https://github.com/your-username/ecommerce-mobile-frontend.git

cd ecommerce-mobile-frontend


## 2️⃣ Install Dependencies


npm install


## 3️⃣ Start Development Server


npm start


App will run on:


http://localhost:3000


---

# 🔐 Authentication Flow

- User logs in
- Backend returns JWT token
- Token stored in localStorage
- Protected routes check token
- Admin routes check role-based access

---

# 🌟 Key UI Highlights

✔ Mobile-first layout  
✔ Responsive product grid  
✔ Smooth page transitions  
✔ Clean modern design  
✔ Optimized component structure  

---

# 📡 API Integration

Frontend connects to backend using Axios:

Example Base URL:

http://localhost:5000/api


---

# 🚀 Future Improvements

- Dark / Light Theme Toggle
- Product Filtering & Search
- Wishlist Feature
- Loading Skeleton UI
- Better Animations
- Payment Integration UI

---

# 👨‍💻 Author

Mustafa Safdar  
MERN Stack Developer  

---

# 📄 License

This project is for educational and portfolio purposes.
