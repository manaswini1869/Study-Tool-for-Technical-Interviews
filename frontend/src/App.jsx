import { useEffect, useState } from "react";
import { fetchQuestions, submitQuestion } from "./api";
import "./styles.css";

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString();
}

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  // Load recent history on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchQuestions();
        setHistory(data);
        if (data.length > 0) {
          setCurrent(data[0]);
        }
      } catch (err) {
        console.error(err);
        setError("Could not load history");
      }
    })();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setStatus("");
    setQuizSelection(null);
    setQuizResult(null);

    if (!prompt.trim()) {
      setError("Please type a question or concept first.");
      return;
    }

    try {
      setLoading(true);
      setStatus("Generating answer with AI…");
      const newItem = await submitQuestion(prompt);
      setCurrent(newItem);
      setHistory((prev) => [newItem, ...prev]);
      setStatus("Done!");
      setPrompt("");
    } catch (err) {
      console.error(err);
      setError("Failed to generate answer. Check backend logs.");
    } finally {
      setLoading(false);
    }
  }

  function handleSelectHistory(item) {
    setCurrent(item);
    setQuizSelection(null);
    setQuizResult(null);
  }

  function handleQuizClick(index) {
    if (!current?.answer?.quiz) return;
    setQuizSelection(index);
    const correctIndex = current.answer.quiz.correctIndex ?? 0;
    const isCorrect = index === correctIndex;
    setQuizResult({ isCorrect, explanation: current.answer.quiz.explanation });
  }

  const answer = current?.answer;

  return (
    <div className="app-root">
      <div className="app-container">
        <header className="app-header">
          <div className="app-title">Tech Interview Study Tool</div>
          <p className="app-subtitle">
            Ask about algorithms, data structures, system design, or coding patterns. Get structured explanations,
            code examples, and a mini quiz.
          </p>
        </header>

        <form className="form" onSubmit={handleSubmit}>
          <textarea
            placeholder="e.g., Explain the time and space complexity of quicksort and compare it with mergesort."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="button-row">
            <button type="submit" disabled={loading}>
              {loading ? "Thinking…" : "Generate Answer"}
            </button>
            {status && <span className="status-text">{status}</span>}
            {error && <span className="error-text">{error}</span>}
          </div>
        </form>

        <div className="main-content">
          {/* Left: current answer */}
          <section className="card">
            <h2 className="card-title">Current Answer</h2>

            {!current && <p className="status-text">No question yet — ask something above to get started.</p>}

            {current && (
              <>
                <p className="status-text">
                  <strong>Question:</strong> {current.prompt}
                </p>

                {answer?.explanation && (
                  <>
                    <h3 className="section-title">Explanation</h3>
                    <p style={{ fontSize: "0.92rem", lineHeight: 1.5 }}>{answer.explanation}</p>
                  </>
                )}

                {answer?.steps?.length > 0 && (
                  <>
                    <h3 className="section-title">Key Steps / Ideas</h3>
                    <ol style={{ paddingLeft: "1.2rem", fontSize: "0.9rem" }}>
                      {answer.steps.map((step, i) => (
                        <li key={i} style={{ marginBottom: "0.25rem" }}>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </>
                )}

                {answer?.codeExample && (
                  <>
                    <h3 className="section-title">Code Example</h3>
                    <pre className="code-block">
                      <code>{answer.codeExample}</code>
                    </pre>
                  </>
                )}

                {answer?.diagram && (
                  <>
                    <h3 className="section-title">Visual / Diagram</h3>
                    <pre className="code-block">
                      <code>{answer.diagram}</code>
                    </pre>
                  </>
                )}

                {answer?.quiz && answer.quiz.question && (
                  <>
                    <h3 className="section-title">Quick Quiz</h3>
                    <p style={{ fontSize: "0.92rem" }}>{answer.quiz.question}</p>
                    <div className="quiz-options">
                      {answer.quiz.options?.map((opt, idx) => {
                        const isSelected = quizSelection === idx;
                        const isCorrect = answer.quiz.correctIndex === idx;
                        let className = "quiz-option-btn";
                        if (quizSelection != null) {
                          if (isSelected && isCorrect) className += " correct";
                          else if (isSelected && !isCorrect) className += " incorrect";
                        }
                        return (
                          <button
                            key={idx}
                            type="button"
                            className={className}
                            onClick={() => handleQuizClick(idx)}
                          >
                            {String.fromCharCode(65 + idx)}. {opt}
                          </button>
                        );
                      })}
                    </div>
                    {quizResult && (
                      <div
                        className={
                          "quiz-feedback " + (quizResult.isCorrect ? "correct" : "incorrect")
                        }
                      >
                        {quizResult.isCorrect ? "Correct! 🎉 " : "Not quite. "}
                        {quizResult.explanation}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </section>

          {/* Right: history */}
          <aside className="card">
            <h2 className="card-title">Recent Questions</h2>
            {history.length === 0 && <p className="status-text">No history yet.</p>}
            {history.length > 0 && (
              <ul className="history-list">
                {history.map((item) => (
                  <li
                    key={item._id}
                    className="history-item"
                    onClick={() => handleSelectHistory(item)}
                  >
                    <div className="history-prompt">
                      {item.prompt.length > 80
                        ? item.prompt.slice(0, 80) + "…"
                        : item.prompt}
                    </div>
                    <div className="history-time">{formatDate(item.createdAt)}</div>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
