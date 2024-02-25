import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { ListingCardGrid } from "../components/listings";
import { SearchBar } from "../components/searchbar";
import React, { useState, useEffect } from "react";


function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [currentQuery, setCurrentQuery] = useState<string>("");

  useEffect(() => {
    // Fetch search results from the server based on currentQuery
    if (currentQuery.trim() !== "") {
      fetch(`/api/similarity?query=${encodeURIComponent(currentQuery)}`)
        .then((response) => response.json())
        .then((data) => setSearchResults(data));
    } else {
      // Clear search results if the query is empty
      setSearchResults([]);
    }
  }, [currentQuery]);

  const handleSearch = (query: string) => {
    setCurrentQuery(query);
  };

  return (
    <Box p={4}>
      <Flex
        direction="column"
        align="center"
        justify="center"
        w="100%"
        h="100%"
      >
        <Heading as="h2" mb={4}>
          Find Anything 🔎
        </Heading>
        <Text fontSize="lg" mb={8}>
          Explore thousands of listings from across campus!
        </Text>

        <SearchBar onSearch={handleSearch} />

        <ListingCardGrid listingList={searchResults} />
      </Flex>
    </Box>
  );
}

export default Search;
