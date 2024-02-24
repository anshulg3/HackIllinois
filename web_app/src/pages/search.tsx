import {
  Flex,
  Heading,
  Box,
  Card,
  CardHeader,
  CardBody,
  Text,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

function Search() {
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Fetch search results from the server
    fetch("/api/search")
      .then((response) => response.json())
      .then((data) => setSearchResults(data));
  }, []);

  return (<div></div>);
}

export default Search;
