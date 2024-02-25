import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import React, { useState, ChangeEvent } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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
          onChange={handleInputChange}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
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
