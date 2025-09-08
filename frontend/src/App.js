import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ShortenerApp from "./ShortenerApp";
import StatsApp from "./StatsApp";
import { Button, AppBar, Toolbar, Typography } from "@mui/material";

export default function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            URL Shortener
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Shortener
          </Button>
          <Button color="inherit" component={Link} to="/stats">
            Statistics
          </Button>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<ShortenerApp />} />
        <Route path="/stats" element={<StatsApp />} />
      </Routes>
    </Router>
  );
}
