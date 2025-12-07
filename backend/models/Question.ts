{
  _id: ObjectId,
  userId: ObjectId,
  prompt: string,                // original question
  answer: {
    summary: string,
    explanation: string,
    examples: string[],
    complexity: {
      time: string,
      space: string,
    },
    visuals: string,             // step-by-step / text diagrams
  },
  quiz: [
    {
      question: string,
      choices: string[],
      correctIndex: number,
      explanation: string,
    }
  ],
  createdAt: Date,
}
