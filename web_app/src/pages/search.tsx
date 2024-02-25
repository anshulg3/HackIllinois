import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { ListingCardGrid } from "../components/listings";
import { SearchBar } from "../components/searchbar";
import React, { useState, useEffect } from "react";

function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [currentQuery, setCurrentQuery] = useState<string>("");
  const [currentCategory, setCurrentCategory] = useState<string>("");

  useEffect(() => {
    // Fetch search results from the server based on currentQuery
    // if (currentQuery.trim() !== "") {
    let url = `/api/similarity?query=${encodeURIComponent(currentQuery)}`;
    if (currentCategory !== "") {
      url += `&category=${currentCategory}`;
    }
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "No matches found") {
          data = [];
        }
        setSearchResults(data);
      });
    // } else {
    //   // Clear search results if the query is empty
    //   setSearchResults([]);
    // }
  }, [currentQuery, currentCategory]);

  const handleSearch = (query: string, category: string) => {
    setCurrentQuery(query);
    setCurrentCategory(category);
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
