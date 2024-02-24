import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { Box, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";

function Post() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    date: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const new_value = event.target.value;
    setFormData({ ...formData, [event.target.name]: new_value });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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
    } catch (error) {
      console.error("Error creating listing:", error);
      // Display an error message to the user
    }
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch("/api/data");
        const initialData = await response.json();
        setFormData(initialData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (successMessage !== "") {
      setTimeout(() => {
        setFormData({ name: "", description: "", price: 0, date: "" });
        setSuccessMessage("");
      }, 3000); // Reset form after 3 seconds
    }
  }, [successMessage]);

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <FormControl isRequired>
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor="description">Description</FormLabel>
        <Input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor="price">Price</FormLabel>
        <Input
          type="number"
          name="price"
          min={0}
          value={formData.price}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor="date">Date</FormLabel>
        <Input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl isRequired>
        <Button type="submit" colorScheme="blue">
          Submit Listing
        </Button>
      </FormControl>
      {successMessage && <p>{successMessage}</p>}
    </Box>
  );
}

export default Post;
