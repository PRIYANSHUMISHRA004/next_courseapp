import { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button, Card, Typography } from "@mui/material";
import type{LoginProps} from 'store'

export function Login({onClick}:LoginProps) {
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 5,
        margin: 2,
        width: {
          xs: "90%",
          sm: 400,
        },
      }}
    >
      <Typography variant="h4" textAlign="center" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Name"
        value={username}
        onChange={(event) => setName(event.target.value)}
      />
      <TextField
        label="Password"
    
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button variant="contained" onClick={()=>{onClick({username,password})}}>Submit</Button>
    </Card>
  );
}
