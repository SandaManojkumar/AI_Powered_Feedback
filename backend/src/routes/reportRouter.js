// controllers/reportController.js
import Report from "../models/report.js";

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find();

    // Parse summary if it's stored as a stringified object
    const formattedReports = reports.map((r, index) => {
      let summaryText = r.summary;

      try {
        // If summary is stringified JSON (e.g., { parts: [...] })
        const parsed = JSON.parse(r.summary);
        if (parsed.parts) {
          summaryText = parsed.parts.map((p) => p.text).join("\n");
        }
      } catch {
        // fallback if it's plain text already
        summaryText = r.summary;
      }

      return {
        serial: index + 1,
        _id: r._id,
        feedback: r.feedback,
        summary: summaryText,
        sentiment: r.sentiment,
        createdAt: r.createdAt,
      };
    });

    res.json(formattedReports);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};
