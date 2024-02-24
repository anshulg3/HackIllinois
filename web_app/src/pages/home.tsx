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

type ListingCardProps = {
  id: number;
  name: string;
  description: string;
  date: string;
  price: number;
};

function ListingCard(props: ListingCardProps) {
  return (
    <Card>
      <CardHeader>{props.name}</CardHeader>
      <CardBody>
        <Text>{props.description}</Text>
        <Text>{props.date}</Text>
      </CardBody>
      <CardBody>
        <Text fontWeight="bold">${props.price}</Text>
      </CardBody>
    </Card>
  );
}

const dummyListings: ListingCardProps[] = [
  {
    id: 1,
    name: "Apartment 1",
    description: "A beautiful apartment in the heart of the city.",
    date: "2021-01-01",
    price: 1000,
  },
  {
    id: 2,
    name: "Apartment 2",
    description: "A cozy apartment with a view of the water.",
    date: "2021-01-01",
    price: 800,
  },
  {
    id: 3,
    name: "Apartment 3",
    description: "A spacious apartment with a large garden.",
    date: "2021-01-01",
    price: 1200,
  },
];

function ListingCardList({ listingList }: { listingList: ListingCardProps[] }) {
  return (
    <Flex>
      {listingList.map((listing) => (
        <Box key={listing.id} p={2} px={4} w={300}>
          <ListingCard
            id={listing.id}
            name={listing.name}
            description={listing.description}
            date={listing.date}
            price={listing.price}
          />
        </Box>
      ))}
    </Flex>
  );
}

function Home() {
  const [listingList, setListingList] = useState<ListingCardProps[]>([]);

  useEffect(() => {
    // Using fetch to fetch the API from the flask server (redirected to proxy)
    fetch("/api/data")
      .then((res) => res.json())
      .then((apiData) => {
        // Assuming apiData is an array of listings
        setListingList(apiData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      <Heading as="h1" mb={4}>
        Welcome to Illini Market
      </Heading>

      <Text fontSize="xl" mb={6}>
        Discover a wide range of products from various sellers. Whether you're
        looking for unique handmade items, vintage treasures, or everyday
        essentials, our marketplace has something for everyone.
      </Text>

      <Text fontSize="lg" mb={8}>
        Explore the latest listings below and find the perfect items to add to
        your collection.
      </Text>

      <ListingCardList listingList={listingList} />
    </div>
  );
}

export default Home;
