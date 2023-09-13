import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input, Button, useToast } from '@chakra-ui/react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const OTPModel = ({ isOpen, onClose, onVerify }) => {
  const [otp, setOTP] = useState('');
  const toast = useToast();
const navigate = useNavigate()

const handleOrderPlace = ()=>{
  let token = localStorage.getItem("Token");
  const Id = localStorage.getItem("UserId");
  let obj={}
  axios
  .post("http://localhost:8080/orders/order-place",obj,{
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
  const handleVerify = () => {
 
    let token = localStorage.getItem("Token");
    const Id = localStorage.getItem("UserId");
    const obj ={otp,Id}
    console.log(obj)
    axios
      .post("http://localhost:8080/orders/verified-otp",obj,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setOTP("")
        toast({
          title: 'OTP Verification Successful',
          description: 'You have successfully verified the OTP.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        handleOrderPlace()
        navigate("/Ship")
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

   };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>OTP Verification</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleVerify}>
            Verify
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OTPModel;