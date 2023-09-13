import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Grid,
  Box,
  Image,
  Text,
  Button,
  Badge,
  Center,
  Spinner,
  Alert,
  AlertIcon,
  HStack,
  Input,
  VStack, // Import VStack for vertical stacking
} from "@chakra-ui/react";
import { toast } from "react-toastify"; // Import toast from react-toastify
import OTPModel from "../Component/OTPModel";
import { useNavigate } from "react-router-dom";

const fetchProducts = async () => {
  const response = await axios.get("http://localhost:8080/products/products"); // Replace with your API endpoint
  return response.data;
};
let token = localStorage.getItem("Token");

const Product = () => {
  const [product, setProduct] = useState({});

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery("products", fetchProducts);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortByPrice, setSortByPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();

  // Debounce the search query
  let navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 2000); // Adjust the delay time as needed (e.g., 2000ms)

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const handleAddToCart = (data) => {
    // Generate a random OTP (for demonstration purposes)
    const randomOTP = Math.floor(100000 + Math.random() * 900000);
    let token = localStorage.getItem("Token");
    let Auth = JSON.parse(localStorage.getItem("Auth"));

    if (!Auth) {
      Swal.fire("LogIn First!", "Please LogIn First!", "error");
      navigate("/login");
      return;
    }
    console.log(data);
    axios
      .post(`http://localhost:8080/cart/addtocart/${data._id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        toast({
          title: "Product added to cart.",
          description: "Product added to cart.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filter by search query
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title?.toLowerCase().includes(query) ||
          product.availability?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query)
      );
    }

    // Sort by price
    if (sortByPrice === "asc") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortByPrice === "desc") {
      filtered = filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, selectedCategory, sortByPrice, debouncedSearchQuery]);

  if (isLoading) {
    return (
      <Center mt={8}>
        <Spinner size="lg" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error loading products
      </Alert>
    );
  }

  return (
    <VStack spacing={4} align="stretch" width="97%" margin="auto">
      <HStack spacing={4} mb={4} mt={5}>
        <Button
          colorScheme="blue"
          onClick={() => setSelectedCategory("All")}
          isActive={selectedCategory === "All"}
        >
          All
        </Button>
        <Button
          colorScheme="blue"
          onClick={() => setSelectedCategory("men")}
          isActive={selectedCategory === "men"}
        >
          Men
        </Button>
        <Button
          colorScheme="blue"
          onClick={() => setSelectedCategory("women")}
          isActive={selectedCategory === "women"}
        >
          Women
        </Button>
        <Button
          colorScheme="blue"
          onClick={() => setSortByPrice("asc")}
          isActive={sortByPrice === "asc"}
        >
          Price Low to High
        </Button>
        <Button
          colorScheme="blue"
          onClick={() => setSortByPrice("desc")}
          isActive={sortByPrice === "desc"}
        >
          Price High to Low
        </Button>
      </HStack>
      <Input
        placeholder="Search by title, description, or category"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        mb={4}
      />
      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
        {filteredProducts.map((product) => (
          <Box
            key={product._id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.02)" }}
          >
            <Image
              src={product.image}
              alt={product.title}
              height="200px"
              width="100%"
              objectFit="cover"
            />
            <Box p={4}>
              <Text fontWeight="bold" fontSize="xl" mb={2}>
                {product.title}
              </Text>
              <Badge colorScheme={product.availablity ? "green" : "red"} mb={2}>
                {product.availablity ? "In Stock" : "Out of Stock"}
              </Badge>
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                ${product.price.toFixed(2)}
              </Text>
              <Text fontSize="md" color="gray.600">
                Category: {product.category}
              </Text>
              <Button
                colorScheme="blue"
                mt={4}
                w="100%"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </Button>
            </Box>
          </Box>
        ))}
      </Grid>
    </VStack>
  );
};

export default Product;
