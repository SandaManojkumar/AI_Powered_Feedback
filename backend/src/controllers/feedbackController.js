import axios from "axios";
import { config } from "../config.js";
import report from "../models/report.js";

export const analyzeFeedback = async (req, res) => {
  const { feedback } = req.body;
    console.log(feedback)
  try {
    const response = await axios.post(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,    {
        contents: [{ parts: [{ text: feedback }], role: "user" }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": config.GEMINI_API_KEY
        }
      }
    );

    

    // return response.data;
    //Example: parse summary & sentiment from Gemini response
    const summary = response.data?.candidates?.[0]?.content || "No summary";
    const sentiment = "Positive"; // you can add sentiment detection logic here
    console.log(summary)
    const create_db = await report.create({
        feedback, 
        summary:JSON.stringify(summary),
        sentiment
    })
    res.json({ success: true, summary, sentiment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to analyze feedback" });
  }
};
