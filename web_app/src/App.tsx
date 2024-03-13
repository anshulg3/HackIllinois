import {
  Link as ChakraLink,
  Box,
  Button,
  ButtonGroup,
  Image,
  HStack,
  Flex,
  Text,
  Heading,
} from "@chakra-ui/react";
import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Logout from "./pages/logout";
import Manage from "./pages/manage";
import Post from "./pages/post";
import Search from "./pages/search";
import Logo from "./media/UofI.png";

import React from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/protected_area")
      .then((res) => {
        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <Box className="App">
      <Flex align="center" justify="space-between" p="4" >
        <Heading as="h1" size="lg">
          <ChakraLink as={Link} to="/">
            <HStack spacing={5}>
            <Image
              src={Logo}
              width="30px"
              height="45px"
            />
              <Text>Illini Market</Text>
              </HStack>
          </ChakraLink>
        </Heading>
        <ButtonGroup spacing={5}>
          <Button as={Link} to="/" variant={"outline"}>
            Home
          </Button>
          <Button as={Link} to="/search" variant={"outline"}>
            Search
          </Button>
          {isLoggedIn && (
            <Button as={Link} to="/post" variant={"outline"}>
              Post
            </Button>
          )}
          {isLoggedIn && (
            <Button as={Link} to="/manage" variant={"outline"}>
              Manage
            </Button>
          )}
          {!isLoggedIn && (
            <Button as={Link} to="/login">
              <Box pr={2}>
              <Image
              src={Logo}
              width="10px"
              height="15px"
            />
            </Box>
            <Text>Login</Text>
            </Button>
          )}
          {isLoggedIn && (
            <Button as={Link} to="/logout">
              Logout
            </Button>
          )}
        </ButtonGroup>
      </Flex>

      <Box>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/post" element={<Post isLoggedIn={isLoggedIn} />} />
          <Route path="/manage" element={<Manage isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout isLoggedIn={isLoggedIn} />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
