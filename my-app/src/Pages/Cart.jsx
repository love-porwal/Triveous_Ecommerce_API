import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Button,
  IconButton,
  HStack,
  Image,
  Center,
} from "@chakra-ui/react";
import { toast } from "react-toastify"; // Import toast from react-toastify
import OTPModel from "../Component/OTPModel";
import { useNavigate } from "react-router-dom";
import { AddIcon, MinusIcon, DeleteIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  let navigate = useNavigate();
  const token = localStorage.getItem("Token");

  useEffect(() => {
 
    if (token) {
      axios
        .get("http://localhost:8080/cart/allcart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setCartItems(response.data);
        })
        .catch((error) => {
          console.error("Error fetching cart items:", error);
        });
    }
  }, [token]);

  const handleAddToCart = () => {
    axios
      .get("http://localhost:8080/orders/generate-otp", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        localStorage.setItem("UserId", res.data.Id);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    // Open the OTP verification modal
    setIsModalOpen(true);
  };

  const handleRemoveItem = (productId) => {
    if (token) {
      axios
        .delete(`http://localhost:8080/cart/removetocart/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          // Remove the item from the local cartItems state
          setCartItems((prevCartItems) =>
            prevCartItems.filter((item) => item.product._id !== productId)
          );
        })
        .catch((error) => {
          console.error("Error removing item from cart:", error);
        });
    }
  };

  const handleIncreaseQuantity = (productId) => {
    if (token) {
      axios
        .patch(
          `http://localhost:8080/cart/increment/${productId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          // Update the local cartItems state to reflect the increased quantity
          setCartItems((prevCartItems) =>
            prevCartItems.map((item) =>
              item.product._id === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          );
        })
        .catch((error) => {
          console.error("Error increasing quantity:", error);
        });
    }
  };

  const handleDecreaseQuantity = (productId) => {
    if (token) {
      axios
        .patch(
          `http://localhost:8080/cart/decrement/${productId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          // Update the local cartItems state to reflect the decreased quantity
          setCartItems((prevCartItems) =>
            prevCartItems.map((item) =>
              item.product._id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
          );
        })
        .catch((error) => {
          console.error("Error decreasing quantity:", error);
        });
    }
  };


const handleOrderPlace = (cartItems)=>{
    console.log("cartItems",cartItems)
    axios
    .post(`http://localhost:8080/orders/order-place`, cartItems, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

  return (
    <Container mt={6}>
      <Heading as="h1" mb={6} textAlign="Center">
        Your Cart
      </Heading>
      {cartItems.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        <VStack spacing={4}>
          {cartItems.map((item) => (
            <Box
              key={item.product._id}
              borderWidth="1px"
              p={4}
              borderRadius="md"
              boxShadow="md"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <HStack spacing={4}>
                <Image
                  src={item.product.image}
                  alt={item.product.title}
                  boxSize="100px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <VStack alignItems="flex-start" spacing={2}>
                  <Text fontWeight="bold">{item.product.title}</Text>
                  <Text>Category: {item.product.category}</Text>
                  <Text>Price: ${item.product.price.toFixed(2)}</Text>
                  <HStack spacing={4}>
                    <IconButton
                      icon={<MinusIcon />}
                      colorScheme="red"
                      aria-label="Decrease Quantity"
                      onClick={() => handleDecreaseQuantity(item.product._id)}
                    />
                    <Text>Quantity: {item.quantity}</Text>
                    <IconButton
                      icon={<AddIcon />}
                      colorScheme="blue"
                      aria-label="Increase Quantity"
                      onClick={() => handleIncreaseQuantity(item.product._id)}
                    />
                  </HStack>
                </VStack>
              </HStack>
              <IconButton
                icon={<DeleteIcon />}
                colorScheme="red"
                aria-label="Remove Item"
                onClick={() => handleRemoveItem(item.product._id)}
              />
            </Box>
          ))}
          <Link>
            <Button
              colorScheme="blue"
              mt={4}
              w="100%"
              onClick={() => handleAddToCart()}
            >
              Checkout
            </Button>
          </Link>
           <OTPModel
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onVerify={() => {
                                    
                }}
              /> 
        </VStack>
      )}
    </Container>
  );
};

export default Cart;
