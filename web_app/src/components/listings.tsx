import {
  Box,
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Link as ChakraLink,
  Image,
  Heading,
  Stack,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { LuMail } from "react-icons/lu";
import { Link } from "react-router-dom";
import PlaceholderImage from "../media/NoImageFound.jpg";

export type ListingProps = {
  id: number;
  name: string;
  description: string;
  date: string;
  price: number;
  imageurl: string;
  sellername: string;
  selleremail: string;
  category: string;
};

function ListingCard(props: ListingProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      <Card onClick={onOpen}>
        <CardBody>
          <Image
            src={props.imageurl}
            fallbackSrc={PlaceholderImage}
            alt={props.name}
            borderRadius="lg"
            objectFit={"cover"}
            h="200px"
            w="100%"
          />
          <Stack mt="6" spacing={3}>
            <Heading size="md" minH="3rem" noOfLines={2}>
              {props.name}
            </Heading>
            <HStack spacing={3}>
              <Badge fontSize="xl" colorScheme="green">
                ${props.price}
              </Badge>
              <Badge fontSize="xl">{props.category}</Badge>
            </HStack>
            <Text textColor={"gray.500"}>{props.date}</Text>
          </Stack>
        </CardBody>
      </Card>

      <Modal
        isOpen={isOpen}
        size={"full"}
        scrollBehavior={"outside"}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={4}
            overflow="visible"
          >
            <HStack spacing={100} my={50}>
              <Image
                src={props.imageurl}
                fallbackSrc={PlaceholderImage}
                alt={props.name}
                borderRadius="lg"
                objectFit={"cover"}
                h="300px"
                w="375px"
              />
              <Stack maxW={500}>
                <Heading size="xl">{props.name}</Heading>
                <HStack spacing={8}>
                  <Badge fontSize="2xl" colorScheme="green">
                    ${props.price}
                  </Badge>
                  <Badge fontSize="2xl">{props.category}</Badge>
                  <Text textColor={"gray.500"} fontSize="2xl">
                    {props.date}
                  </Text>
                </HStack>
                <Text as="b">Description:</Text>
                <Text
                  style={{
                    maxHeight: "15em",
                    overflow: "auto",
                  }}
                >
                  {props.description}
                </Text>
              </Stack>
            </HStack>
            <ButtonGroup variant="outline" spacing="3">
              <Button
                as={Link}
                to={`/search/?query=${encodeURIComponent(
                  props.name + " " + props.description
                )}`}
                colorScheme="blue"
              >
                Find Similar Listings
              </Button>
              <Tooltip label={props.sellername} placement="top">
                <Button
                  as={ChakraLink}
                  href={`mailto:${props.selleremail}`}
                  colorScheme="blue"
                  leftIcon={<LuMail />}
                >
                  Contact Seller
                </Button>
              </Tooltip>
            </ButtonGroup>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export function ListingCardGrid({
  listingList,
}: {
  listingList: ListingProps[];
}) {
  return (
    <SimpleGrid columns={[1, 2, 3, 4]} spacing={2}>
      {listingList.map((listing) => (
        <Box key={listing.id} p={2} px={2} w={300}>
          <ListingCard
            id={listing.id}
            category={listing.category}
            name={listing.name}
            description={listing.description}
            date={listing.date}
            price={listing.price}
            imageurl={listing.imageurl}
            sellername={listing.sellername}
            selleremail={listing.selleremail}
          />
        </Box>
      ))}
    </SimpleGrid>
  );
}
