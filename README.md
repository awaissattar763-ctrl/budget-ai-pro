# 🧠 FIN-IQ — Neural Financial Intelligence

FIN-IQ is a premium, AI-driven financial intelligence dashboard designed to provide deep insights into personal wealth management. Leveraging the power of **Llama 3.3 via Groq**, it transforms raw transaction data into actionable cognitive analysis, wrapped in a stunning glassmorphic interface.

---

## 🚀 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **AI Engine:** [Llama 3.3](https://groq.com/) (via Groq SDK)
- **Visualization:** [Recharts](https://recharts.org/)
- **Reporting:** [jsPDF](https://github.com/parallax/jsPDF) & [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)
- **Icons & Motion:** [Lucide React](https://lucide.dev/) & [Framer Motion](https://www.framer.com/motion/)

---

## ✨ Core Features

### 🤖 AI Cognitive Analysis
Harness the power of Llama 3.3 to analyze your spending habits. FIN-IQ doesn't just track numbers; it understands them, providing personalized financial advice and identifying potential savings.

### 📈 Historical Trend Mapping
Visualize your financial journey with dynamic, interactive charts powered by Recharts. Track income vs. expenses over time and monitor category-wise distribution with precision.

### 💎 Glassmorphism UI
Experience a state-of-the-art interface featuring sleek glassmorphic components, subtle micro-animations, and a responsive design that feels premium on any device.

### 📄 PDF Ledger Export
Generate professional financial reports with a single click. Export your transaction history into a beautifully formatted PDF ledger for offline tracking or tax purposes.

---

## 🛠️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-username/budget-ai.git
cd budget-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and add your Groq API Key:
```env
GROQ_API_KEY=your_groq_api_key_here
```
> [!NOTE]
> You can obtain an API key from the [Groq Console](https://console.groq.com/).

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🗂️ Project Structure

```text
budget-ai/
├── app/
│   ├── api/             # Backend API routes (AI Integration)
│   ├── components/      # Reusable UI components (Glassmorphic)
│   ├── context/         # React Context for state management
│   ├── layout.js        # Root layout with premium fonts
│   └── page.js          # Main Dashboard & Intelligence Hub
├── public/              # Static assets
├── .env.local           # Environment secrets
├── next.config.js       # Next.js configuration
└── package.json         # Project dependencies
```

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.

Built with ✨ by [Antigravity](https://github.com/antigravity-ai)
