import React, { useState, useEffect, useCallback } from "react";
import { ListingProps, ListingCardGrid } from "../components/listings";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
  Tag,
  Text,
} from "@chakra-ui/react";


function Manage({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [listings, setListings] = useState<ListingProps[]>([]);
  const [selectedListings, setSelectedListings] = useState<number[]>([]); // Track selected listing IDs
  const [checkedListings, setCheckedListings] = useState<number[]>([]); // Track checked listing IDs
  const [isShowDeleteChecklist, setIsShowDeleteChecklist] = useState(false); // Popup visibility state

  // This works
  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = "/";
      return;
    }
    const fetchListings = async () => {
      try {
        const response = await fetch(`/api/data?getmydata=true`);
        if (response.ok) {
          const data = await response.json();
          setListings(data);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, [isLoggedIn]); // Include selectedListings as a dependency... add listings?

  // This works
  const handleDeleteListing = async (selectedIds: number[]) => {
    try {
      const response = await fetch(`/api/data`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (!response.ok) {
        throw new Error(`Error deleting listings: ${response.statusText}`);
      }

      // Update listings independently using a copy
      const updatedListings = [...listings].filter(
        (listing) => !selectedIds.includes(listing.id)
      );
      setListings(updatedListings);

      // Reset selected and checked listings
      setSelectedListings([]);
      setCheckedListings([]);

      setIsShowDeleteChecklist(false);
    } catch (error) {
      console.error("Error deleting listings:", error);
    }
  };

  // Memoized checkbox change handler
  const handleCheckboxChange = useCallback(
    (listingId: number, isChecked: boolean) => {
      setCheckedListings((prevCheckedListings) => {
        const updatedCheckedListings = [...prevCheckedListings]; // Ensure we work with a copy

        if (isChecked) {
          // Add listing to checked if not already present, and update selected if necessary
          if (!updatedCheckedListings.includes(listingId)) {
            updatedCheckedListings.push(listingId);
            setSelectedListings((prevSelectedListings) => [
              ...prevSelectedListings,
              listingId,
            ]); // Update selected if needed
          }
        } else {
          // Remove listing from checked and update selected if necessary
          const index = updatedCheckedListings.indexOf(listingId);
          if (index > -1) {
            updatedCheckedListings.splice(index, 1);
            setSelectedListings((prevSelectedListings) =>
              prevSelectedListings.filter((id) => id !== listingId)
            ); // Update selected if needed
          }
        }

        return updatedCheckedListings;
      });
    },
    [] // Empty dependency array to prevent unnecessary re-renders
  );

  // This works
  const DeleteChecklistPopup = ({
    onConfirm,
    onClose,
    show,
    checkedListings,
  }: {
    onConfirm: any;
    onClose: any;
    show: boolean;
    checkedListings: number[];
  }) => {
    const isChecked = (listingId: number) => checkedListings.includes(listingId);
    return (
      <Modal isOpen={show} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select listings to delete</ModalHeader>
          <ModalBody>
            <ul>
              {listings.map((listing) => (
                <li key={listing.id}>
                  <Checkbox
                    isChecked={isChecked(listing.id)}
                    onChange={(e) =>
                      handleCheckboxChange(listing.id, e.target.checked)
                    }
                  >
                    <Tag id={`listing-checkbox-${listing.id}`}>
                      {listing.name}
                    </Tag>
                  </Checkbox>
                </li>
              ))}
            </ul>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup variant="outline" spacing="3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => onConfirm(selectedListings)}
              >
                Confirm Deletion
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  return (
    <Box as="section" overflow="hidden" p={4}>
      <Flex
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        w="100%"
        h="100%"
      >
        <Heading as="h2" mb={4}>
          My Current Listings ⏱
        </Heading>
        <ListingCardGrid listingList={listings} />

        <Box pt={15}>
          {listings.length > 0 ? (
            <Button
              colorScheme="red"
              onClick={() => setIsShowDeleteChecklist(true)}
            >
              Delete Items
            </Button>
          ) : (
            <Text>No listings found. 🤷‍♂️</Text>
          )}
        </Box>
      </Flex>
      {isShowDeleteChecklist && (
        <DeleteChecklistPopup
          onConfirm={handleDeleteListing}
          onClose={() => setIsShowDeleteChecklist(false)}
          show={isShowDeleteChecklist}
          checkedListings={checkedListings}
        />
      )}
    </Box>
  );
}
export default Manage;