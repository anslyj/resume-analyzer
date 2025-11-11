# AI Resume Scanner & Job Matching Platform

An AI-powered full-stack application that analyzes resumes, optimizes job applications, and matches candidates with relevant career opportunities using real-time job market data.

---

## 📋 Project Overview

The AI Resume Scanner & Job Matching Platform is a production-ready, full-stack TypeScript application designed to help job seekers optimize their resumes and discover relevant career opportunities through artificial intelligence. This web-based platform leverages cutting-edge AI technology to analyze uploaded PDF resumes, extract valuable insights, and match candidates with real-time job postings from the market. The application features a clean, intuitive user interface built with React 19 and a robust backend powered by Node.js and Express, all deployed and accessible to users online.

---

## 🚀 Key Features

- **📄 PDF Resume Upload**: Drag-and-drop or browse to upload PDF resumes
- **🤖 AI-Powered Analysis**: Cerebras AI (Llama 4 Scout 17B) extracts skills and provides insights
- **💼 Real-Time Job Matching**: Integration with Adzuna Jobs API for live job recommendations
- **📊 Match Scoring**: Intelligent 0-100 scoring system comparing resumes to job requirements
- **🎯 Three Analysis Modes**:
  - **Resume Only**: Get comprehensive feedback and job recommendations
  - **Job Description**: Optimize your resume for specific roles
  - **Compare Both**: Detailed resume-job matching with gap analysis
- **🔐 Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **⚡ Fast Processing**: Sub-5-second analysis with instant results

---

## 🛠️ Technical Architecture & Implementation

The platform is built on a modern TypeScript stack, ensuring type safety and maintainability across both frontend and backend codebases. The backend architecture follows a microservices; inspired pattern with distinct service layers: the Analysis Engine orchestrates the overall workflow, the Cerebras Service handles AI interactions, and the Adzuna Service manages job market data retrieval. This separation of concerns makes the codebase modular, testable, and scalable.

File handling is implemented using Multer for multipart form data processing, combined with PDF-Parse library to extract text content from uploaded PDF documents. This extracted text is then processed by the Cerebras AI API, which utilizes the Llama 4 Scout 17B Instruct model; a powerful large language model optimized for understanding and analyzing professional documents. The AI identifies key skills, assesses proficiency levels, highlights strengths, and generates actionable recommendations for improvement.

---

## 💡 Core Features & Functionality

The platform offers three distinct analysis modes to accommodate different user needs. In "Resume Only" mode, users upload their PDF resume and receive comprehensive feedback including skill extraction, strength identification, areas for improvement, and personalized job recommendations fetched from Adzuna's live job database. The "Job Description" mode allows users to paste a job posting and receive tailored advice on how to optimize their resume for that specific role. The "Compare Both" mode provides the most detailed analysis, comparing the user's resume directly against a job description with a calculated match score ranging from 0 to 100, skill gap analysis, and specific recommendations to improve their candidacy.

The Adzuna Jobs API integration provides real-time access to thousands of job postings, particularly focusing on government positions. When analyzing resumes, the system intelligently generates search queries based on extracted skills and user-specified experience levels (entry, mid, senior), returning 20+ relevant job listings with calculated match scores, salary information, location details, and reasons why each position aligns with the candidate's profile.

---

## 🔒 Security & Data Management

Security is implemented through industry-standard practices including JWT (JSON Web Token) authentication for session management and bcrypt for password hashing. The Express backend includes rate limiting middleware to prevent API abuse and ensure fair resource allocation. User data, including authentication credentials and analysis history, is stored in MongoDB with Mongoose ODM providing schema validation and data modeling. Environment variables securely manage sensitive information like API keys for Cerebras and Adzuna services, database connection strings, and JWT secrets.

---

## 🌐 Deployment & Production Considerations

The application is fully deployed and accessible online, demonstrating real-world production capabilities. The deployment handles CORS configuration for secure cross-origin communication between the React frontend and Express backend, manages environment-specific configurations, and includes comprehensive error handling and logging for debugging and monitoring. The system architecture supports concurrent requests, manages API rate limits from external services, and provides fallback mechanisms when AI services are temporarily unavailable, ensuring a reliable user experience even under varying conditions.

---

## 🧰 Tech Stack

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **CSS3** - Responsive styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM

### APIs & Services
- **Cerebras AI API** - Llama 4 Scout 17B for resume analysis
- **Adzuna Jobs API** - Real-time job market data

### Libraries & Tools
- **Multer** - File upload handling
- **PDF-Parse** - PDF text extraction
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Axios** - HTTP client
- **Zod** - Schema validation
- **Express-Rate-Limit** - API rate limiting
- **CORS** - Cross-origin resource sharing

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cerebras API Key
- Adzuna API Credentials (App ID & App Key)

### Backend Setup

1. Clone the repository:
```bash
git clone [your-repo-url]
cd resume-scanner/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resume_scanner
DB_USER=your_username
DB_PASSWORD=your_password

# Cerebras AI
CEREBRAS_API_KEY=your_cerebras_api_key_here
CEREBRAS_API_URL=https://api.cerebras.ai/v1

# Adzuna Jobs API
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Server
PORT=5000
NODE_ENV=development
```

4. Build and run:
```bash
npm run build
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

---

## 🧪 API Endpoints

### Analysis Routes
- `POST /api/analysis/resume-only` - Analyze resume only
- `POST /api/analysis/job-only` - Analyze job description only
- `POST /api/analysis/both` - Compare resume and job description

### Health & Testing
- `GET /api/health` - Server health check
- `GET /api/analysis/test-cerebras` - Test Cerebras AI connection
- `GET /api/analysis/test-adzuna` - Test Adzuna API connection

