import { useState } from "react";
import axios from "axios";
import { Button, Textarea } from "@mantine/core";

export default function Feedback() {
  const [feedback, setFeedback] = useState("");
  const [summary, setSummary] = useState("");
  const [sentiment, setSentiment] = useState("");

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      alert("Please enter feedback before submitting!");
      return;
    }
    
    try {
      const res = await axios.post("http://localhost:3000/api/feedback", { feedback });
      if (res.data.success) {
        setSummary(res.data.summary);
        setSentiment(res.data.sentiment);
        alert("Feedback submitted and analyzed ✅");
        setFeedback("");
      }
    } catch (err) {
      console.error(err);
      alert("Error analyzing feedback");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Submit Feedback</h2>
      <Textarea
        value={feedback}                  // ✅ connect state here
        onChange={(e) => setFeedback(e.target.value)} // ✅ update state
        variant="filled"
        size="md"
        radius="lg"
        withAsterisk
        placeholder="Enter your feedback"
      />
      <br />
      <Button mt="md" onClick={handleSubmit}>
        Submit
      </Button>

      {summary && (
        <div style={{ marginTop: 20 }}>
          <h3>AI Summary:</h3>
          <p>{summary}</p>
          <h3>Sentiment:</h3>
          <p>{sentiment}</p>
        </div>
      )}
    </div>
  );
}
