import React from "react";
import { Anchor, Box, Heading } from "grommet";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <Box background="brand" pad="medium" direction="row" align="center">
      <Heading level="1" margin="medium">
        My Generals IO Bot
      </Heading>
      <Box margin="small">
        <Link component={Anchor} to="/play">
          Play
        </Link>
      </Box>
      <Box margin="small">
        <Link component={Anchor} to="/test">
          Test
        </Link>
      </Box>
    </Box>
  );
}