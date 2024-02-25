import React, { useEffect } from "react";
import { Box, Heading } from "@chakra-ui/react";

function Login() {
  useEffect(() => {
      fetch("/api/login", {
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        }
      })
        .then((apiData: Response) => apiData.text())
        .then((res: string) => {window.location.href = res;})
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  , []);
  return (
    <Box p={4}>
      <Heading>Redirecting to Google for login</Heading>
    </Box>
  );
}

export default Login;
