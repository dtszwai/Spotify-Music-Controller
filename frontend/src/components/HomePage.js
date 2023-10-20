import React, { useEffect, useState } from "react";
import JoinRoomPage from "./JoinRoomPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";
import Info from "./Info";

const HomePage = () => {
  const [roomCode, setRoomCode] = useState("");
  const clearRoomCode = () => {
    setRoomCode(null);
  };

  useEffect(() => {
    fetch("/api/user-in-room")
      .then((res) => res.json())
      .then((data) => {
        setRoomCode(data.code);
      });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={roomCode ? <Navigate to={`/room/${roomCode}`} /> : <HomePageView />}
        />
        <Route path="/join" element={<JoinRoomPage />} />
        <Route path="/info" element={<Info />} />
        <Route path="/create" element={<CreateRoomPage />} />
        <Route path="/room/:roomCode" element={<Room leaveRoomCallback={clearRoomCode} />} />
      </Routes>
    </BrowserRouter>
  );
};

const HomePageView = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} align="center">
        <Typography variant="h3" component="h3">
          House Party
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <ButtonGroup disableElevation variant="contained" color="primary">
          <Button color="primary" to="/join" component={Link}>
            Join a Room
          </Button>
          <Button color="inherit" to="/info" component={Link}>
            Info
          </Button>
          <Button color="secondary" to="/create" component={Link}>
            Create a Room
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
};

export default HomePage;
