import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Loader, Text, Group } from "@mantine/core";
import { saveAs } from "file-saver";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/reports");
        setReports(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Export reports as CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Feedback,Summary,Sentiment\n";
    reports.forEach((r) => {
      // Parse summary JSON if needed
      const summaryText = Array.isArray(r.summary)
        ? r.summary.map((part) => part.text).join("\n")
        : r.summary;

      csvContent += `"${r.feedback}","${summaryText}","${r.sentiment}"\n`;
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
      <Group position="apart" mb="md">
        <Text size="xl" weight={700}>
          Feedback Reports
        </Text>
        <Button color="teal" onClick={handleExportCSV}>
          Export CSV
        </Button>
      </Group>

      {reports.length === 0 ? (
        <Text>No feedback reports available.</Text>
      ) : (
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>Feedback</th>
              <th>Summary</th>
              <th>Sentiment</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, idx) => {
              const summaryText = Array.isArray(report.summary)
                ? report.summary.map((part) => part.text).join("\n")
                : report.summary;

              return (
                <tr key={idx}>
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
