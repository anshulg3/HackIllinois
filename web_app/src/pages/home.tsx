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
    fetch("/api/protected_area")
      .then((res) => {
        if (res.ok) {
          window.localStorage.setItem('isLoggedIn', JSON.stringify(true));
        }
        else{
          return
        }
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
