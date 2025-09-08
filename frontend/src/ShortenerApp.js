import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Grid, Alert } from "@mui/material";

export default function ShortenerApp() {
  const [rows, setRows] = useState([
    { url: "", validity: "", shortcode: "", error: "" },
  ]);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const addRow = () => {
    if (rows.length < 5)
      setRows([...rows, { url: "", validity: "", shortcode: "", error: "" }]);
  };

  const removeRow = (index) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
  };

  const handleSubmit = async () => {
    let anySuccess = false;
    const newRows = [...rows];

    for (let i = 0; i < newRows.length; i++) {
      const row = newRows[i];
      row.error = "";

      if (!row.url || !/^https?:\/\/.+/.test(row.url)) {
        row.error = "Invalid URL";
        continue;
      }

      try {
        await axios.post("http://localhost:5000/shorturls", {
          url: row.url,
          validity: row.validity ? Number(row.validity) : undefined,
          shortcode: row.shortcode || undefined,
        });
        anySuccess = true;
        row.url = "";
        row.validity = "";
        row.shortcode = "";
      } catch (err) {
        row.error = err.response?.data?.error || "Server error";
      }
    }

    if (anySuccess) setSuccessMsg("URLs successfully shortened!");
    setRows(newRows);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>

      <Grid container spacing={2}>
        {rows.map((row, index) => (
          <Grid
            container
            spacing={2}
            key={index}
            alignItems="center"
            style={{ marginBottom: "10px" }}
          >
            <Grid item xs={5}>
              <TextField
                fullWidth
                label="URL"
                value={row.url}
                onChange={(e) => handleChange(index, "url", e.target.value)}
                error={!!row.error}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                fullWidth
                label="Validity (min)"
                value={row.validity}
                onChange={(e) => handleChange(index, "validity", e.target.value)}
                type="number"
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="Custom Shortcode"
                value={row.shortcode}
                onChange={(e) => handleChange(index, "shortcode", e.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              {rows.length > 1 && (
                <Button color="error" onClick={() => removeRow(index)}>
                  Remove
                </Button>
              )}
            </Grid>
            {row.error && (
              <Grid item xs={12}>
                <Alert severity="error">{row.error}</Alert>
              </Grid>
            )}
          </Grid>
        ))}
      </Grid>

      {rows.length < 5 && (
        <Button variant="outlined" onClick={addRow} style={{ marginTop: "10px" }}>
          Add Row
        </Button>
      )}

      <div style={{ marginTop: "20px" }}>
        <Button variant="contained" onClick={handleSubmit}>
          Shorten
        </Button>
      </div>

      {successMsg && (
        <Alert severity="success" style={{ marginTop: "20px" }}>
          {successMsg}
        </Alert>
      )}
    </div>
  );
}
