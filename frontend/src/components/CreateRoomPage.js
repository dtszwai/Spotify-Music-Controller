import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormControlLabel,
  FormHelperText,
  FormControl,
  Radio,
  RadioGroup,
  Collapse,
  Alert,
} from "@mui/material";

const CreateRoomPage = (props) => {
  const [update, roomCode] = [props.update || false, props.roomCode || null];
  const [guestCanPause, setGuestCanPause] = useState(props.guestCanPause || true);
  const [votesToSkip, setVotesToSkip] = useState(props.votesToSkip || 2);
  const [updateMsg, setUpdateMsg] = useState("");
  const navigate = useNavigate();

  const handleRoomButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };
    fetch("/api/create-room", requestOptions)
      .then((res) => res.json())
      .then((data) => navigate("/room/" + data.code));
  };

  const title = update ? "Update Room" : "Create a Room";
  const renderCreateButtons = () => (
    <>
      <Grid item xs={12} align="center">
        <Button color="primary" variant="contained" onClick={handleRoomButtonPressed}>
          Create a Room
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </>
  );

  const renderUpdateButtons = () => (
    <Grid item xs={12} align="center">
      <Button color="primary" variant="contained" onClick={handleUpdateButton}>
        Update Room
      </Button>
    </Grid>
  );

  const SUCCESS_MESSAGE = "Room updated successfully!";
  const ERROR_MESSAGE = "Error updating room.";
  const handleUpdateButton = () => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: roomCode,
      }),
    };
    fetch("/api/update-room", requestOptions).then((res) => {
      if (res.ok) {
        setUpdateMsg(SUCCESS_MESSAGE);
      } else {
        setUpdateMsg(ERROR_MESSAGE);
      }
    });
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Collapse in={updateMsg != ""}>
          <Alert
            severity={updateMsg === ERROR_MESSAGE ? "error" : "success"}
            onClose={() => setUpdateMsg("")}
          >
            {updateMsg}
          </Alert>
        </Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup
            row
            defaultValue={props.guestCanPause === undefined ? true : props.guestCanPause}
            onChange={(e) => setGuestCanPause(e.target.value)}
          >
            <FormControlLabel
              value={true}
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value={false}
              control={<Radio color="secondary" />}
              label="No control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type="number"
            defaultValue={votesToSkip}
            inputProps={{ min: 1, style: { textAlign: "center" } }}
            onChange={(e) => setVotesToSkip(e.target.value)}
          />
          <FormHelperText>
            <div align="center">Votes required to Skip Songs</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      {update ? renderUpdateButtons() : renderCreateButtons()}
    </Grid>
  );
};

export default CreateRoomPage;
