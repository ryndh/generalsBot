import React from "react";
import { Start, Join } from "../../src/bot.js";
import { Button, Box } from "grommet";
import config from '../config'

export default function Play({ match }) {
  const bot = match.params.bot;
  const bots = {
    1: {
      id: config.BOT_USER_ID,
      username: config.username
    },
    2: {
      id: config.BOT_USER_ID2,
      username: config.username2
    }
  };
  
  setTimeout(() => {
    Join(bots[bot].id, bots[bot].username);
  });

  setTimeout(() => {
    Start();
  }, 500);

  return (
    <Box pad="medium">
      <div>
        <Button
          onClick={() => {
            Start();
          }}
          label="Force Start"
        ></Button>
        <Button
          onClick={() => {
            Join(bots[bot].id, bots[bot].username);
          }}
          label="Join"
        ></Button>
      </div>
    </Box>
  );
}