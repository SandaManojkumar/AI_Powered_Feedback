import axios from "axios";
import { config } from "../config.js";
import report from "../models/report.js";

export const analyzeFeedback = async (req, res) => {
  const { feedback } = req.body;
  console.log("Feedback:", feedback);

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [{ parts: [{ text: feedback }], role: "user" }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": config.GEMINI_API_KEY,
        },
      }
    );

    // ✅ Extract summary text properly
    const summaryText =
      response.data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .join("\n") || "No summary";

    // For now just keep sentiment fixed or use another API
    const sentiment = "Positive";

    // ✅ Save to DB
    const create_db = await report.create({
      feedback,
      summary: summaryText, // clean string, not JSON.stringify
      sentiment,
    });

    console.log("Saved report:", create_db);

    res.json({ success: true, summary: summaryText, sentiment });
  } catch (err) {
    console.error("Error analyzing feedback:", err.response?.data || err.message);
    res.status(500).json({ success: false, error: "Failed to analyze feedback" });
  }
};
