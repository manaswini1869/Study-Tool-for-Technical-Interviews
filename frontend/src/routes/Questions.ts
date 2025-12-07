// routes/questions.ts
router.post('/generate', authMiddleware, async (req, res) => {
  const { prompt } = req.body;
  const userId = req.user.id;

  const systemPrompt = `
You are a technical interview tutor. Given a single question, respond in strict JSON with:
- summary
- explanation
- examples (array of strings)
- complexity { time, space }
- visuals (step-by-step bullet explanation)
  `;

  const userMessage = `Question: ${prompt}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  });

  const data = JSON.parse(completion.choices[0].message.content);

  const doc = await Question.create({
    userId,
    prompt,
    answer: data,
    createdAt: new Date(),
  });

  res.json(doc);
});
