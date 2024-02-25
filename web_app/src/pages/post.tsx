import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { Radio, RadioGroup, Textarea } from "@chakra-ui/react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Flex,
  Text,
} from "@chakra-ui/react";

function Post({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageurl: "",
    price: 0,
    category: ""
  });
  const [successMessage, setSuccessMessage] = useState("");

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const new_value = event.target.value;
    setFormData({ ...formData, [event.target.name]: new_value });
  }

  function handleTextAreaChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const new_value = event.target.value;
    setFormData({ ...formData, [event.target.name]: new_value });
  }

  const handleRadioChange = (nextValue: string) => {
    setFormData({ ...formData, category: nextValue });
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Form data: ", formData);
    try {
      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error creating listing: ${response.statusText}`);
      }

      const data = await response.json();

      console.log("Listing created successfully: ", data);
      setSuccessMessage("Listing submitted successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error creating listing:", error);
      // Display an error message to the user
    }
  }

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = "/";
      return;
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (successMessage !== "") {
      setTimeout(() => {
        setFormData({ name: "", description: "", imageurl: "", price: 0 , category: ""});
        setSuccessMessage("");
      }, 3000); // Reset form after 3 seconds
    }
  }, [successMessage]);

  return (
    <Box p={4} as="form" onSubmit={handleSubmit}>
      <Flex
        direction="column"
        align="center"
        justify="center"
        w="100%"
        h="100%"
      >
        <Heading as="h2" mb={4}>
          Create a New Listing 📦
        </Heading>
        <Text fontSize="lg" mb={8}>
          Thousands of UIUC students are ready to buy!
        </Text>
      
      <FormControl isRequired pt={2} maxW={800}>
        <FormLabel htmlFor="name">Category</FormLabel>
        <RadioGroup colorScheme="blue" onChange={handleRadioChange} value={formData.category}>
          <Radio name="category" value="School Supply">School Supply</Radio>
          <Radio px={3} name="category" value="Sublease">Sublease</Radio>
          <Radio px={3} name="category" value="Ticket">Ticket</Radio>
          <Radio px={3} name="category" value="Event">Event</Radio>
          <Radio px={3} name="category" value="Other">Other</Radio>
        </RadioGroup>
      </FormControl>
      <FormControl isRequired pt={2} maxW={800}>
        <FormLabel htmlFor="name">Title</FormLabel>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl isRequired pt={2} maxW={800}>
        <FormLabel htmlFor="description">Description</FormLabel>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleTextAreaChange}
          height={"200px"}
        />
      </FormControl>
      <FormControl isRequired pt={2} maxW={800}>
        <FormLabel htmlFor="price">Price</FormLabel>
        <Input
          type="number"
          name="price"
          min={0}
          value={formData.price}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl pt={2} maxW={800}>
        <FormLabel htmlFor="imageurl">Image URL</FormLabel>
        <Input
          type="string"
          name="imageurl"
          value={formData.imageurl}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl isRequired pt={6} maxW={800} >
        <Button type="submit" colorScheme="blue">
          Submit Listing
        </Button>
      </FormControl>
      {successMessage && <p>{successMessage}</p>}
      </Flex>
    </Box>
  );
}

export default Post;
