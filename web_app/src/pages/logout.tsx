import React, { useEffect } from "react";
import { Box, Heading } from "@chakra-ui/react";

function Logout({ isLoggedIn }: { isLoggedIn: boolean }) {
  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = "/";
      return;
    }
    fetch("/api/logout", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((apiData: Response) => {
        if (apiData.ok) {
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  });
  return (
    <Box p={4}>
      <Heading>Logging out...</Heading>
    </Box>
  );
}

export default Logout;
