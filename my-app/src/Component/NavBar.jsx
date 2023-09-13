import React,{useEffect,useState} from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if 'Auth' exists in local storage
    const authStatus = localStorage.getItem("Auth");

    if (authStatus) {
      // If 'Auth' exists and is 'true', set isAuthenticated to true
      setIsAuthenticated(authStatus === "true");
    }
  }, []);

  const handleLogout = () => {
   
    localStorage.removeItem("Auth");
    localStorage.removeItem("Token");  
    localStorage.removeItem("UserId");
    setIsAuthenticated(false);
    Swal.fire(
      'LogOut Success!',
      'LogOut successfully!',
      'success'
    )
  };

  return (
    <Box bg="blue.500" p={4} color="white">
      <Flex align="center" justify="space-between">
        <IconButton
          icon={<HamburgerIcon />}
          colorScheme="whiteAlpha"
          aria-label="Menu"
          display={{ base: "block", md: "none" }}
          onClick={onOpen}
        />
        <Link to="/">
        <Text fontSize="xl" fontWeight="bold">
          EComm
        </Text>
        </Link>
        
        <HStack spacing={4} display={{ base: "none", md: "flex" }}>
          <Button colorScheme="blue">Home</Button>
          <Link to="/">
          <Button colorScheme="blue">Products</Button>
          </Link>
          {/* <Button colorScheme="blue">About</Button>
          <Button colorScheme="blue">Contact</Button> */}
        </HStack>
        <HStack spacing={4}>
          <Link to="/cart">
          <IconButton
            icon={<AiOutlineShoppingCart />}
            colorScheme="blue"
            aria-label="Shopping Cart"
          />
          
          </Link>
          <Link to="/login">
            <Button colorScheme="blue">Login</Button>
          </Link>

                   {isAuthenticated ? (
          <Button colorScheme="blue" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Link to="/signup">
            <Button colorScheme="blue">Signup</Button>
          </Link>
        )}

        </HStack>
      </Flex>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4}>
              <Button colorScheme="whiteAlpha">Home</Button>
              <Link to="/">
              <Button colorScheme="whiteAlpha">Products</Button>
              </Link>
              <Button colorScheme="whiteAlpha">About</Button>
              <Button colorScheme="whiteAlpha">Contact</Button>
              <Link to="/login">
              <Button colorScheme="whiteAlpha">Login</Button>
              </Link>
              <Link to="/signup">
              <Button colorScheme="whiteAlpha">Signup</Button>
              </Link>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default NavBar;
