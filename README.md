# 💹 BudgetAI — AI-Powered Budget Tracker

A professional personal finance tracker powered by **Claude AI**, built with **Next.js 14**.

## ✨ Features

- 📊 **Dashboard** — Balance, income, expenses, budget progress, donut chart, bar chart
- 📋 **Transactions** — Add / delete income & expenses, filter by category
- 🤖 **AI Insights** — Claude AI analyzes your spending and gives personalized advice
- 📱 **Responsive** — Works on mobile and desktop

---

## 🚀 Deploy to Vercel (3 steps)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/budget-ai.git
git push -u origin main
```

### Step 2 — Import on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repo
4. Click **Deploy**

### Step 3 — Add API Key (for AI Insights)
1. In Vercel dashboard → your project → **Settings → Environment Variables**
2. Add:
   - **Name:** `GROQ_API_KEY`
   - **Value:** your Groq API key from [console.groq.com](https://console.groq.com)
3. Click **Save** → go to **Deployments** → **Redeploy**

Done! ✅

---

## 💻 Run Locally

```bash
npm install
```

Create a `.env.local` file:
```
ANTHROPIC_API_KEY=your_api_key_here
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Project Structure

```
budget-ai/
├── app/
│   ├── layout.js          # Root layout
│   ├── page.js            # Main app (Dashboard, Transactions, AI Insights)
│   └── api/
│       └── insights/
│           └── route.js   # Claude AI API route
├── .gitignore
├── next.config.js
├── package.json
└── README.md
```

---

## 🔑 Get Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / Log in
3. Go to **API Keys** → **Create Key**
4. Copy and paste into Vercel environment variables

---

Built with ❤️ using Next.js + Claude AI
