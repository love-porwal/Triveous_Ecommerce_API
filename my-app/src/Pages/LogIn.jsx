import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  Image,
  Checkbox,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Alert, AlertIcon, AlertTitle } from "@chakra-ui/react";
import axios from "axios";
import Swal from "sweetalert2";
let initial = {
  email: "",
  password: "",
};

export default function Login() {
  const navigate = useNavigate();
  const [showpassword, setShowpassword] = useState(false);
  const [submitButton, setSubmitButton] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [showError, setShowError] = useState(false);

  const [values, setValues] = useState(initial);

  const handleSubmit = () => {
    if (!values.email || !values.password) {
      alert("*Fill all fiels");
      return;
    }
    axios
      .post("http://localhost:8080/users/login", values)
      .then((res) => {
        console.log(res);
        localStorage.setItem("Token", res.data.Token);
        localStorage.setItem("Auth", true);
        Swal.fire("LogIn Success!", "LogIn successfully!", "success");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      })
      .catch((err) => {
        alert("Wrong Credential");
        console.log(err);
      });
  };

  return (
    <>
      <Flex
        align={"center"}
        justify={"center"}
        width={"100%"}
        bg={useColorModeValue("gray.50", "gray.800")}
      ></Flex>

      <Flex minH={"50vh"} align={"center"} justify={"center"}>
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>email address</FormLabel>
                <Input
                  type="email"
                  value={values.email}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>password</FormLabel>
                <InputGroup>
                  <Input
                    value={values.password}
                    type={showpassword ? "text" : "password"}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
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
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox>Remember me</Checkbox>
                  <Link
                    to={"/signup"}
                    style={{ color: "blue", fontWeight: "bold" }}
                  >
                    Create account
                  </Link>
                </Stack>
                {showError ? (
                  <Alert status="error">
                    <AlertIcon />
                    <AlertTitle>{errorMsg}</AlertTitle>
                  </Alert>
                ) : (
                  <hr />
                )}
                <Button
                  bg={"yellow.400"}
                  color={"white"}
                  _hover={{
                    bg: "yellow.500",
                  }}
                  onClick={handleSubmit}
                  isDisabled={submitButton}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}
