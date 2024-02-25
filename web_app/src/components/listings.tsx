import {
  Box,
  Button,
  ButtonGroup,
  Stack,
  Card,
  CardBody,
  Link as ChakraLink,
  Image,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Text,
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
          <Stack mt="6" spacing="3">
            <Heading size="md" minH="3rem">{props.name}</Heading>
            <Text fontSize="2xl">${props.price}</Text>
            <Text textColor={"gray.500"}>{props.date}</Text>
          </Stack>
        </CardBody>
      </Card>

      <Modal
        isOpen={isOpen}
        size={"xl"}
        scrollBehavior={"inside"}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{props.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{props.description}</Text>
            <Text>{props.date}</Text>
            <Text fontWeight="bold">${props.price}</Text>
            <Text>
              <strong>Seller:</strong> {props.sellername}
            </Text>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup variant="outline" spacing="3">
              <Button
                as={Link}
                to={`/search/?query=${encodeURIComponent(props.description)}`}
                colorScheme="blue"
              >
                Find Similar Listings
              </Button>
              <Button
                as={ChakraLink}
                href={`mailto:${props.selleremail}`}
                colorScheme="blue"
                leftIcon={<LuMail />}
              >
                Contact Seller
              </Button>
            </ButtonGroup>
          </ModalFooter>
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
