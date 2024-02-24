import React, { useEffect, useState } from "react";

function Login() {
  useEffect(() => {
    if (window.localStorage.isLoggedIn) {
      window.location.href = "/";
    } else {
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
  }, []);
  return (
    <div>
      <h1>Redirecting to Google for login</h1>
    </div>
  );
}

export default Login;
