import React, {useState} from "react";
import { Start, Join, Team } from "../../src/bot.js";
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
    },
    3: {
      id: config.BOT_USER_ID3,
      username: config.username3
    },
    4: {
      id: config.BOT_USER_ID4,
      username: config.username4
    },
  };
  
  setTimeout(() => {
    Join(bots[bot].id, bots[bot].username);
  });

  const [team, setTeam] = useState()
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
          label="Join Game"
        ></Button>
        <Button
          onClick={() => {
            Team(config.custom_game_id, team);
          }}
          label="Join Team"
        ></Button>
        <input onChange={(evt) => setTeam(evt.target.value)}></input>
      </div>
    </Box>
  );
}