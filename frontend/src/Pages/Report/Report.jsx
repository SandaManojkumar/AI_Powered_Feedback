import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Loader, Text, Group } from "@mantine/core";
import { saveAs } from "file-saver";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:5000/reports");
        setReports(res.data);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Export to CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "S.No,Feedback,Summary,Sentiment\n";

    reports.forEach((r, i) => {
      // Parse summary if stored as JSON string
      let summaryText = "";
      try {
        const parsed = JSON.parse(r.summary);
        if (parsed.parts) {
          summaryText = parsed.parts.map((p) => p.text).join(" ");
        } else {
          summaryText = JSON.stringify(parsed);
        }
      } catch {
        summaryText = r.summary;
      }

      csvContent += `"${i + 1}","${r.feedback}","${summaryText}","${r.sentiment}"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "feedback_reports.csv");
  };

  if (loading)
    return (
      <div style={{ padding: 20 }}>
        <Loader size="lg" variant="dots" />
        <Text>Loading reports...</Text>
      </div>
    );

  return (
    <div style={{ padding: 20 }}>
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={700}>
          Feedback Reports
        </Text>
        <Button color="teal" onClick={handleExportCSV}>
          Export CSV
        </Button>
      </Group>

      {reports.length === 0 ? (
        <Text>No feedback reports available.</Text>
      ) : (
        <Table striped highlightOnHover withTableBorder>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Feedback</th>
              <th>Summary (Gemini Response)</th>
              <th>Sentiment</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, idx) => {
              let summaryText = "";
              try {
                const parsed = JSON.parse(report.summary);
                if (parsed.parts) {
                  summaryText = parsed.parts.map((p) => p.text).join(" ");
                } else {
                  summaryText = JSON.stringify(parsed);
                }
              } catch {
                summaryText = report.summary;
              }

              return (
                <tr key={report._id}>
                  <td>{idx + 1}</td>
                  <td>{report.feedback}</td>
                  <td>{summaryText}</td>
                  <td>{report.sentiment}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}
