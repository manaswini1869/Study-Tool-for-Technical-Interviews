const API_BASE_URL = "http://localhost:5000";

export async function fetchQuestions() {
  const res = await fetch(`${API_BASE_URL}/api/questions`);
  if (!res.ok) throw new Error("Failed to fetch questions");
  return res.json();
}

export async function submitQuestion(prompt) {
  const res = await fetch(`${API_BASE_URL}/api/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) throw new Error("Failed to generate answer");
  return res.json();
}
