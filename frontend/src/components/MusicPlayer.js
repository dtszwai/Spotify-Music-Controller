import React from "react";
import { Grid, Typography, IconButton, Card, LinearProgress } from "@mui/material";
import { PlayArrow, SkipNext, Pause } from "@mui/icons-material";

const MusicPlayer = (props) => {
  const { image_url, title, artist, is_playing, time, duration, votes, votes_required } = props;
  const songProgress = (time / duration) * 100;

  const songControl = (action, method = "PUT") => {
    const requestOptions = {
      method: method,
      headers: { "Content-Type": "application/json" },
    };
    fetch(`/spotify/${action}`, requestOptions);
  };

  return (
    <Card>
      <Grid container alignItems="center">
        <Grid item align="center" xs={4}>
          <img src={image_url} height="100%" width="100%" />
        </Grid>
        <Grid item align="center" xs={8}>
          <Typography component="h5" variant="h5">
            {title}
          </Typography>
          <Typography color="textSecondary" variant="subtitle1">
            {artist}
          </Typography>
          <div>
            <IconButton>
              {is_playing ? (
                <Pause onClick={() => songControl("pause")} />
              ) : (
                <PlayArrow onClick={() => songControl("play")} />
              )}
            </IconButton>
            <IconButton>
              <SkipNext onClick={() => songControl("skip", "POST")} /> {votes} / {votes_required}
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <LinearProgress variant="determinate" value={songProgress} />
    </Card>
  );
};

export default MusicPlayer;
