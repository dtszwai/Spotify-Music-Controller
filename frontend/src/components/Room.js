import React, { useEffect } from "react";
import { useParams } from "react-router";
import { Grid, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

const defaultVotes = 2;

const Room = (props) => {
  const [guestCanPause, setGuestCanPause] = React.useState(false);
  const [votesToSkip, setVotesToSkip] = React.useState(defaultVotes);
  const [isHost, setIsHost] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = React.useState(false);
  const [song, setSong] = React.useState({});
  const roomCode = useParams().roomCode;
  const navigate = useNavigate();
  const leaveRoomCallback = props.leaveRoomCallback;

  const getRoomDetail = () => {
    fetch("/api/get-room" + "?code=" + roomCode)
      .then((res) => {
        if (!res.ok) {
          leaveRoomCallback();
          navigate("/");
        }
        return res.json();
      })
      .then((data) => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);
      });
  };

  const getCurrentSong = () => {
    fetch("/spotify/current-song")
      .then((res) => {
        return res.ok ? res.json() : {};
      })
      .then((data) => {
        setSong(data);
      });
  };

  useEffect(() => {
    getRoomDetail();
    const getSong = setInterval(getCurrentSong, 1000);
    getCurrentSong();
    return () => clearInterval(getSong);
  }, []);

  useEffect(() => {
    isHost && authenticateSpotify();
  }, [isHost]);

  const updateShowSettings = (value) => {
    setShowSettings(value);
  };

  const SettingsButton = () => (
    <Grid item xs={12} align="center">
      <Button variant="contained" color="primary" onClick={() => updateShowSettings(true)}>
        Settings
      </Button>
    </Grid>
  );

  const authenticateSpotify = () => {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        setSpotifyAuthenticated(data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  };

  const RenderSettings = () => (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <CreateRoomPage
          update
          votesToSkip={votesToSkip}
          guestCanPause={guestCanPause}
          roomCode={roomCode}
          updateCallback={getRoomDetail}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" onClick={() => updateShowSettings(false)}>
          Close
        </Button>
      </Grid>
    </Grid>
  );

  const leaveButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then((res) => {
      leaveRoomCallback();
      navigate("/");
    });
  };

  return showSettings ? (
    <RenderSettings />
  ) : (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {roomCode}
        </Typography>
      </Grid>
      {Object.keys(song).length > 0 && <MusicPlayer {...song} />}
      {isHost && <SettingsButton />}
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          to="/"
          component={Link}
          onClick={leaveButtonPressed}
        >
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
};

export default Room;
