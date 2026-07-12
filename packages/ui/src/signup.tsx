import { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button, Card, Typography } from "@mui/material";
import type{SignupProps} from 'store'

export function Signup({onClick}:SignupProps) {
  const [username, setUserName] = useState("");
   const [name, setName] = useState("");

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
        Sign Up
      </Typography>
      <TextField
        label="Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        margin="normal"
      />
      <TextField
        label="userName"
        value={username}
        onChange={(event) => setUserName(event.target.value)}
        margin="normal"
      />
     
      <TextField
        label="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        margin="normal"
      />
      <Button variant="contained" onClick={()=>{onClick({name,
        username,
        password
      })}} sx={{ marginTop: 2 }}>Submit</Button>
    </Card>
  );
}
