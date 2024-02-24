import { Link as ChakraLink, Box, Flex, Heading } from "@chakra-ui/react";
import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Post from "./pages/post";
import Login from "./pages/login";

import React from "react";

function App() {
  return (
    <Box className="App">
      <Flex align="center" justify="space-between" p="4">
        <Heading as="h1" size="lg">
          My App
        </Heading>
        <Flex>
          <ChakraLink as={Link} to="/" mx="2">
            Home
          </ChakraLink>
          <ChakraLink as={Link} to="/post" mx="2">
            Post
          </ChakraLink>

          <ChakraLink as={Link} to="/login" mx="2">
            Login
          </ChakraLink>
        </Flex>
      </Flex>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post" element={<Post />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Box>
  );
}

export default App;
