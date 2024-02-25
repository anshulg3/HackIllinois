import {
  Box,
  Button,
  Stack,
  Flex,
  VStack,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ListingProps, ListingCardGrid } from "../components/listings";
import { Image } from "@chakra-ui/react";
import Logo from "../media/IlliniMarketLogo.jpg";

function Home() {
  const [listingList, setListingList] = useState<ListingProps[]>([]);

  useEffect(() => {
    // fetch("/api/data")
    fetch("/api/data?limit=8")
      .then((res) => res.json())
      .then((data) => {
        setListingList(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <Box>
    <Box as="section" overflow="hidden" p={4}>
      <Stack mx="auto" py="5" pos="relative" pb="32" px={[4, 0]}>
        <VStack mb="20" spacing={20} alignItems="center">
          <VStack spacing="6" w="full">
            <Image
              src={Logo}
              width="300px"
              height="300px"
              borderRadius="full"
            />
            <Heading
              as="h1"
              fontSize={["4xl", "4xl", "5xl", "7xl"]}
              textAlign="center"
              maxW="1000px"
              bgGradient="linear(to-r, blue.300, orange.300)"
              bgClip="text"
              data-aos="fade-up"
            >
              Welcome to Illini Market
            </Heading>
            <Text
              fontSize={["lg", "xl"]}
              maxW="800px"
              textAlign="center"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Discover a wide range of products from various sellers. Easily
              find the exact product that fits your need and start collecting
              results like magic. 🪄
            </Text>
            <Stack
              direction={["column-reverse", "row"]}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <Button as={Link} to="/search" size="lg" height="4rem" px="2rem">
                Start your next search 🔎
              </Button>
            </Stack>
          </VStack>
          <Flex
            direction="column"
            align="center"
            justify="center"
            w="100%"
            h="100%"
          >
            <Heading as="h2" mb={4}>
              Latest Listings 📈
            </Heading>
            <ListingCardGrid listingList={listingList} />
          </Flex>

          <Box maxW="1200px" pos="absolute" zIndex={-1} top={450}>
            <Box
              pos="absolute"
              left="-40px"
              bgColor="orange.500"
              boxSize={["150px", "150px", "300px", "600px"]}
              rounded="full"
              filter="blur(40px)"
              opacity="0.3"
              className="animated-blob"
              data-aos="fade"
              data-aos-delay="1200"
            />
            <Box
              pos="absolute"
              right="-40px"
              bgColor="blue.500"
              boxSize={["150px", "300px", "600px"]}
              rounded="full"
              filter="blur(40px)"
              opacity="0.3"
              className="animated-blob animation-delay-5000"
              data-aos="fade"
              data-aos-delay="1200"
            />
            <Box
              as="figure"
              shadow="lg"
              data-aos="zoom-out-up"
              data-aos-delay="800"
            ></Box>
          </Box>
        </VStack>
      </Stack>
    </Box>
      <Box p="4" textAlign="center" borderTop="1px solid gray">
        &copy; 2024 Best HackIllinois Team | Made with ❤️
      </Box>
      </Box>
  );
}

export default Home;
