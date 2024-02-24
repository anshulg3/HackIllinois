import React, { useEffect, useState } from "react";

function Login() {
  useEffect(() => {
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        /* Add your request body here */
      }),
    })
      .then((res) => res.json())
      .then((apiData) => {
        // Handle the response data
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  return (
    <div>
      <h1>Login</h1>
    </div>
  );
}

export default Login;
