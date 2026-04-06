# PrepBuddy 🚀 - Turn Interviews into Insights

PrepBuddy is an AI-powered interview preparation platform designed to help candidates bridge the gap between their skills and industry expectations. By analyzing resumes and generating tailored interview reports, PrepBuddy provides actionable insights, technical questions, and behavioral guidance to help you ace your next interview.

---

## 🌟 Features

- **AI-Led Interview Reports**: Get personalized feedback based on your resume and target role.
- **PDF Resume Parsing**: Upload your resume in PDF format for instant analysis.
- **Smart Question Generation**:
- **Technical Questions**: Deep dive into your tech stack.
- **Behavioral Questions**: Master the STAR method and soft skills.
- **Skill Gap Analysis**: Identify what you're missing and how to improve.
- **Preparation Tips**: Curated advice to help you stand out.
- **History Tracking**: Keep track of your previous interview simulations and progress.

---

## 🚀 Live Demo: [https://prep-buddy-xi.vercel.app/]
<img width="1902" height="911" alt="image" src="https://github.com/user-attachments/assets/9856226b-e5b1-462c-9eab-3bdd6c2881f1" />


---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Vanilla CSS / Sass
- **Routing**: React Router 7
- **State Management**: React Context API

### Backend
- **Environment**: Node.js & Express
- **Database**: MongoDB (Mongoose)
- **AI Integration**: Google Gemini AI (Generative AI)
- **Authentication**: JWT & Bcrypt

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/creativeprem789/PrepBuddy.git
cd PrepBuddy
```

### 2. Setup Backend
```bash
cd GEN-AI
npm install
```
Create a `.env` file in the `GEN-AI` directory:
```env
MONGO_URI=your_mongodb_uri
JWT_KEY=your_secret_key
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```
Start the server:
```bash
npm start
```

### 3. Setup Frontend
```bash
cd ../Frontend
npm install
```
Create a `.env` file in the `Frontend` directory:
```env
VITE_API_URL=http://localhost:5000 # Or your Render URL
```
Start the development server:
```bash
npm run dev
```

---

## 📁 Project Structure

```text
PrepBuddy/
├── Frontend/           # React + Vite application
│   ├── src/
│   │   ├── features/   # Feature-based modules (Auth, Interview)
│   │   ├── services/   # API communication
│   │   └── style/      # Global and component styles
├── GEN-AI/             # Node.js + Express + Gemini AI backend
│   ├── src/
│   │   ├── controllers/# Request handlers
│   │   ├── models/     # Mongoose schemas
│   │   └── routes/     # API endpoints
└── README.md           # Project documentation
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🤝 Contact

**Prem** - [@creativeprem789](https://github.com/creativeprem789)  
Project Link: [https://github.com/creativeprem789/PrepBuddy](https://github.com/creativeprem789/PrepBuddy)

Built with ❤️ by PrepBuddy Team
