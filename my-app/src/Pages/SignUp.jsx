import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { Alert, AlertIcon, AlertTitle } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from "axios";
import Swal from "sweetalert2";
let initial = {
  name: "",
  email: "",
  password: "",
};

export default function Signup() {
  const navigate = useNavigate();
  const [showpassword, setShowpassword] = useState(false);

  const [submitButton, setSubmitButton] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const [showError, setShowError] = useState(false);

  const [values, setValues] = useState(initial);

  const handleSubmit = () => {
    let { name, email, password } = values;
    if (!name || !email || !password) {
      alert("*plase Fill all fiels");
      return;
    }
    console.log(values);
    axios
      .post("http://localhost:8080/users/register", values)
      .then((res) => {
        // alert("Account Created Successfully");
        Swal.fire("SignUp Success!", "Account Created Successfully!", "success");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      })
      .catch((err) => console.log(err));

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Create Account
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="nameName" isRequired>
                  <FormLabel> Name</FormLabel>
                  <Input
                    type="text"
                    value={values.name}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </FormControl>
              </Box>
            </HStack>

            <FormControl id="email" isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                value={values.email}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showpassword ? "text" : "password"}
                  value={values.password}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, password: e.target.value }))
                  }
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowpassword((showpassword) => !showpassword)
                    }
                  >
                    {showpassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Stack spacing={10} pt={2}>
              {showError ? (
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle>{errorMsg}</AlertTitle>
                </Alert>
              ) : (
                <hr />
              )}
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"yellow.400"}
                color={"white"}
                _hover={{
                  bg: "yellow.500",
                }}
                onClick={handleSubmit}
                isDisabled={submitButton}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?
                <Link
                  to="/login"
                  style={{ color: "blue", margin: "5px", fontWeight: "bold" }}
                >
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
