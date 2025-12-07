# Technical Interview Study Tool

A full-stack learning assistant that helps users master technical interview concepts using **React**, **Express.js**, **MongoDB**, and the **OpenAI API**.
Users can enter any interview question—data structures, algorithms, and even system-design topics—and receive structured LLM-generated explanations, diagrams, examples, and an auto-generated practice quiz.
The app also stores question history for later review.

---

## Features

### **AI-Generated Structured Answers**

* Clear explanations
* Step-by-step reasoning
* Code examples (Python / JS)
* ASCII/Markdown-style diagrams
* Follow-up multiple-choice quiz questions

### **Study History**

* Automatically saves each generated Q&A session
* Users can revisit past questions instantly

### **Designed for Technical Interview Prep**

Supports questions across:

* Algorithms & Data Structures
* System Design
* OS / Concurrency / Networking fundamentals
* Behavioral and conceptual prompts

### **Full-Stack Implementation**

* **Frontend:** React + Vite
* **Backend:** Node.js + Express.js
* **Database:** MongoDB
* **LLM:** OpenAI API
* **State:** Local React state (simple, lightweight)

---

## Architecture Overview

```
frontend (React)
     │
     ▼
backend (Express.js) ───▶ OpenAI API
     │
     ▼
MongoDB (stores questions + answers)
```

* Frontend communicates with backend through REST API
* Backend fetches structured responses using OpenAI Chat Completions
* Responses + quiz saved in MongoDB
* History view provides quick navigation for previously asked questions

---

## Project Structure

```
study-tool/
├── backend/
│   ├── models/
│   │   └── Question.js
│   ├── routes/
│   │   └── questions.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── api.js
    │   ├── main.jsx
    │   └── styles.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Installation & Setup

### **1. Clone the repository**

```bash
git clone https://github.com/<your-username>/study-tool.git
cd study-tool
```

---

## Backend Setup

### **2. Install dependencies**

```bash
cd backend
npm install
```

### **3. Create `.env`**

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/study_tool
OPENAI_API_KEY=YOUR_OPENAI_KEY_HERE
```

### **4. Start backend**

```bash
npm run dev
```

Backend running at:
**[http://localhost:5000](http://localhost:5000)**

---

## Frontend Setup

### **5. Install dependencies**

```bash
cd ../frontend
npm install
```

### **6. Start frontend**

```bash
npm run dev
```

Frontend running at:
**[http://localhost:5173](http://localhost:5173)**

---

## Usage

1. Open the app in your browser
2. Enter any technical interview question
3. Click **Generate Answer**
4. View:

   * Explanation
   * Steps / intuition
   * Code sample
   * Diagram
   * Quiz question
5. Review past questions in the History sidebar

---

## Example Questions to Try

* “Explain how quicksort works and its complexity.”
* “What is a mutex and when is it used?”
* “Design a URL shortening service like TinyURL.”
* “What happens when you type a URL in a browser?”
* “Implement BFS with a queue.”

---

## Future Enhancements (Roadmap)

* User authentication (JWT login + profiles)
* Difficulty-level tagging & topic classification
* Flashcard mode + spaced repetition
* Analytics dashboard (weak topics, progress)
* Read-aloud / audio explanations
* Multi-model support (Claude, Gemini, Qwen, etc.)
* Export Q&A sessions as PDF

---

## Contributions

Pull requests, feature suggestions, and improvements are welcome!
Feel free to open issues or submit PRs.

---

