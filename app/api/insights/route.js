import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  if (!process.env.GROQ_API_KEY) {
    return Response.json({ error: 'AI Neural Link Offline: API Configuration Error.' }, { status: 500 });
  }

  try {
    const { transactions, budget } = await request.json();

    const summary = transactions
      .slice(0, 30)
      .map(
        (t) =>
          `${t.date} | ${t.category} | ${t.desc} | ${t.amount > 0 ? '+' : ''}${t.amount}`
      )
      .join('\n');

    const chatCompletion = await groq.chat.completions.create({
      "messages": [
        {
          "role": "system",
          "content": `You are a Senior Financial Intelligence Architect (FIN-IQ). 
          Analyze the user's budget and transaction streams for predictive trends and actionable intelligence.
          
          SYSTEM CONTEXT:
          - Current Monthly Budget: $${budget}
          - Analysis Model: Llama 3.3-70B Neural Network
          
          OUTPUT REQUIREMENTS:
          1. Provide exactly 3 high-impact intelligence bullet points.
          2. Each point MUST start with a **BOLD NEURAL HEADER** (all caps) followed by a colon.
          3. Perform TREND ANALYSIS: Identify if spending in a category is increasing or if they are on track to exceed the $${budget} budget.
          4. Use a professional, technical, and data-driven tone.
          5. If they are close to or over budget, prioritize a warning.`
        },
        {
          "role": "user",
          "content": `ANALYZE NEURAL STREAM:\n\nTransactions:\n${summary}`
        }
      ],
      "model": "llama-3.3-70b-versatile",
      "temperature": 0.4,
      "max_tokens": 512,
      "top_p": 1,
      "stream": false,
      "stop": null
    });

    const text = chatCompletion.choices[0]?.message?.content || 'Unable to synthesize neural insights.';

    return Response.json({ insight: text });
  } catch (error) {
    console.error("Neural Link Error:", error);
    return Response.json({ error: 'AI Neural Link Offline. System capacity reached or network unstable.' }, { status: 500 });
  }
}
