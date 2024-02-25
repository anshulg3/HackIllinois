import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Button,
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import React, { useState, ChangeEvent, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

interface SearchBarProps {
  onSearch: (query: string, searchCategory: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchCategory, setSearchCategory] = useState<string>("");

  const handleSearch = () => {
    setSearchParams({ query: searchQuery });
    setSearchParams({ category: searchCategory });
    onSearch(searchQuery, searchCategory);
  };

  useEffect(() => {
    const query = searchParams.get("query");
    const category = searchParams.get("category");
    if (query && query !== searchQuery) {
      setSearchQuery(query);
      setSearchCategory(category || "");
      
      onSearch(query, category || "");
    }
  }, [searchParams]);

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      w="100%"
      h="100%"
      p={4}
    >
      <InputGroup maxW={800}>
        <InputLeftElement pointerEvents="none">
          <LuSearch />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="From subleases, to game tickets, to IOLabs, you can find it all here."
          value={searchQuery}
          onChange={ (e) => setSearchQuery(e.target.value) }
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <Select ml={2} maxW={40} placeholder="Select category" onChange={(e) => setSearchCategory(e.target.value)}>
          <option value="School Supply"> School Supply </option>
          <option value="Sublease"> Sublease </option>
          <option value="Ticket"> Ticket </option>
          <option value="Event"> Event </option>
          <option value="Other"> Other </option>
        </Select>
        <Button
          ml={2}
          onClick={handleSearch}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        >
          Search
        </Button>
      </InputGroup>
    </Flex>
  );
}
