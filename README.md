


# 🌐 Community Learning Hub

A platform that aggregates and curates high-quality learning content from Reddit using the **Reddit API**, providing a centralized space for learners to discover, discuss, and share knowledge.

Built with a **Next.js frontend** and an **Express.js backend**, this hub empowers communities to grow through collaborative learning.

---

## 🚀 Features

- 🔍 Curated Reddit posts from selected educational subreddits  
- 🗂️ Categorized learning resources by topics, tags, and popularity  
- 💬 Upvote/downvote system and user discussions *(planned)*  
- 🧠 Personalized recommendations based on interests  
- 📦 Fully decoupled frontend and backend architecture  

---

## 🛠️ Tech Stack

### 🔧 Backend

- **Express.js** – Lightweight, fast Node.js backend  
- **Reddit API** – To fetch learning content from Reddit communities  
- **Axios / Node-Fetch** – API requests to Reddit  
- **MongoDB** *(optional)* – For storing user data and bookmarks  

### 🖥️ Frontend

- **Next.js** – Server-rendered React app  
- **Tailwind CSS** – Modern utility-first CSS framework  
- **SWR / Axios** – Data fetching and revalidation  

---

## 📁 Project Structure

```

community-learning-hub/
├── backend/                # Express.js backend
│   ├── routes/             # API routes for fetching Reddit data
│   └── server.js           # Entry point
├── frontend/               # Next.js frontend app
│   ├── pages/              # Next.js pages
│   └── components/         # Reusable UI components
├── .env                    # API keys and secrets
└── README.md               # You're here!

````

---

## ⚙️ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/community-learning-hub.git
cd community-learning-hub
````

### 2️⃣ Setup Environment Variables

Create a `.env` file in the backend directory:

```env
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_USER_AGENT=your_user_agent
PORT=5000
```

### 3️⃣ Run the Backend

```bash
cd backend
npm install
npm run dev
```

### 4️⃣ Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be live at `http://localhost:3000`
Backend will be available at `http://localhost:5000`

---

## 🧠 Use Case

Designed as a **Community Learning Hub**, this app targets learners, students, and knowledge seekers by gathering top educational discussions and posts from Reddit. It simplifies discovering quality content and organizing it into structured formats for easy navigation.

---

## 📌 Future Roadmap

* ✅ User login and personalized bookmarks
* 🔔 Notification system for trending discussions
* 📊 Analytics dashboard for moderators
* 📝 In-app content summaries and AI-generated highlights

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have ideas or bug fixes.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Developed By

**Mayank Jonwal**
B.Tech AI & Data Science, IIT Jodhpur
[LinkedIn](https://www.linkedin.com/in/mayankjonwal) • [GitHub](https://github.com/<your-username>)




