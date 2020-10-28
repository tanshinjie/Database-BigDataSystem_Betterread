import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

const NoMatch = () => {
  return (
    <Container style={{ marginTop: "200px", textAlign: "center" }}>
      <Typography variant="h1">Oops!</Typography>
      <br />
      <Typography variant="h3" component="h1">
        Looks like you are in a wrong place
      </Typography>
      <br />
      <Typography variant="h4">
        Click <Link href="/">here</Link> to go home
      </Typography>
    </Container>
  );
};

export default NoMatch;
