import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const { transactions, budget } = await request.json();

    const summary = transactions
      .slice(0, 25)
      .map(
        (t) =>
          `${t.date} | ${t.category} | ${t.desc} | ${t.amount > 0 ? '+' : ''}${t.amount}`
      )
      .join('\n');

    const chatCompletion = await groq.chat.completions.create({
      "messages": [
        {
          "role": "system",
          "content": "You are a senior financial analyst AI. Analyze the user's budget data and provide exactly 3 actionable, bulleted saving tips. Use a professional, data-driven tone. Each tip should be concise and highly specific based on the provided transactions."
        },
        {
          "role": "user",
          "content": `Analyze these transactions and budget: \nBudget Limit: $${budget}\n\nTransactions:\n${summary}`
        }
      ],
      "model": "llama-3.3-70b-versatile",
      "temperature": 0.5,
      "max_tokens": 512,
      "top_p": 1,
      "stream": false,
      "stop": null
    });

    const text = chatCompletion.choices[0]?.message?.content || 'Unable to generate insights.';

    return Response.json({ insight: text });
  } catch (error) {
    console.error("Groq API Error:", error);
    return Response.json({ error: 'Failed to fetch AI insights. Check Groq API key.' }, { status: 500 });
  }
}
