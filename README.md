# 🌾 FasalSaathi - Backend API

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)

The robust backend service powering **FasalSaathi**, an AI-powered smart farming dashboard. This API handles user authentication, farm & crop management, live weather data fetching, AI-driven crop recommendations, and secure subscription handling.

---

## ✨ Key Features

* **🔐 Secure Authentication:** JWT-based user authentication and profile management.
* **🌱 Farm & Crop Management:** CRUD operations for tracking multiple farms, active crops, and crop histories.
* **🧪 Soil Health Tracking:** Logs and analyzes NPK values, pH, moisture, and temperature.
* **🧠 AI Crop Insights:** Integrates with Google's Gemini AI to provide real-time, context-aware agricultural advice.
* **🌦️ Weather Integration:** Delivers localized, real-time weather and rainfall data.
* **💳 Payment Processing:** Integrated with Razorpay for handling premium "Kisan Pro" subscription upgrades.

---

## 🛠️ Tech Stack

* **Framework:** FastAPI (Python)
* **Database:** SQLite (Lightweight, serverless relational database)
* **AI Engine:** Google Generative AI (Gemini)
* **Payments:** Razorpay SDK
* **Mailing:** EmailJS (Triggered via API/Frontend)

---

## ⚙️ Prerequisites

Before running this backend, ensure you have the following installed on your machine:
* [Python](https://www.python.org/downloads/) (v3.10 or higher)
* `pip` (Python package installer)

---

## 🔐 Environment Variables (`.env`)

Create a `.env` file in the root directory of your backend project and add the following keys. 

*(Note: The `VITE_` prefix is strictly for your React frontend `.env` file. Below are the backend equivalents you will need).*

```env
# Application 
APP_ENV=development
API_PREFIX=/api/v1

# Security
SECRET_KEY=your_super_secret_jwt_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Third-Party APIs
RAZORPAY_KEY_ID=rzp_test_0yx0AGbEbJaWtH
RAZORPAY_KEY_SECRET=your_razorpay_secret_here

# EmailJS (If triggering emails directly from backend)
EMAILJS_SERVICE_ID=service_odydvna
EMAILJS_TEMPLATE_ID=template_iyb9b5s
EMAILJS_PUBLIC_KEY=INBK6fk7HoErTapy0tlUK

# AI & Weather
GEMINI_API_KEY=your_google_gemini_api_key
WEATHER_API_KEY=your_openweather_or_weather_api_key


fasalsaathi/
├── backend/                  # FastAPI Application
│   ├── main.py               # Application entry point
│   ├── models/               # SQLite Database Models
│   ├── routers/              # API Endpoints (Auth, Farms, Crops, Soil)
│   └── requirements.txt      # Python dependencies
└── frontend/                 # React + Vite Application
    ├── src/
    │   ├── components/       # Reusable UI components (Radix UI, Framer Motion)
    │   ├── hooks/            # Custom React Hooks (e.g., useLanguage)
    │   ├── services/         # Axios API configuration & Tanstack hooks
    │   ├── types/            # TypeScript interfaces
    │   └── App.tsx           # Main application router
    ├── package.json          # Node dependencies
    └── vite.config.ts        # Vite configuration