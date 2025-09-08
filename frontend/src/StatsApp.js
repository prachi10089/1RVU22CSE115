import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Link,
} from "@mui/material";

export default function StatsApp() {
  const [urls, setUrls] = useState([]);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/shorturls");
      setUrls(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchStats(); 
    const interval = setInterval(fetchStats, 5000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener Statistics
      </Typography>

      {urls.length === 0 ? (
        <Typography>No URLs found yet.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Short URL</TableCell>
                <TableCell>Original URL</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Expiry</TableCell>
                <TableCell>Total Clicks</TableCell>
                <TableCell>Click Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {urls.map((u) => (
                <TableRow key={u.shortcode}>
                  <TableCell>
                    <Link
                      href={`http://localhost:5000/${u.shortcode}`}
                      target="_blank"
                      rel="noopener"
                    >
                      {`http://localhost:5000/${u.shortcode}`}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={u.url} target="_blank" rel="noopener">
                      {u.url}
                    </Link>
                  </TableCell>
                  <TableCell>{new Date(u.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{new Date(u.expiry).toLocaleString()}</TableCell>
                  <TableCell>{u.clicks}</TableCell>
                  <TableCell>
                    {u.clickDetails.length > 0 ? (
                      <ul style={{ paddingLeft: "15px" }}>
                        {u.clickDetails.map((c, i) => (
                          <li key={i}>
                            {new Date(c.timestamp).toLocaleString()} — {c.ip}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
