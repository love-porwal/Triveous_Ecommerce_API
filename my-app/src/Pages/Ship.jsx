import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from 'dayjs';
import {
  Box,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

const Ship = () => {
  const [shipmentData, setShipmentData] = useState([]);
  const token = localStorage.getItem("Token");

  useEffect(() => {
    // Fetch shipment data from your API
    if (token) {
      axios
        .get("http://localhost:8080/orders/order-details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          let ship = response.data;
          ship.map((items) => {
            const orderDateStr = items.orderDate;
            const orderDate = new Date(orderDateStr);
            // Extract the date components (year, month, and day)
            const year = orderDate.getFullYear();
            const month = (orderDate.getMonth() + 1)
              .toString()
              .padStart(2, "0");
            const day = orderDate.getDate().toString().padStart(2, "0");

            // Extract the time components (hours, minutes, seconds, milliseconds)
            const hours = orderDate.getUTCHours().toString().padStart(2, "0");
            const minutes = orderDate
              .getUTCMinutes()
              .toString()
              .padStart(2, "0");
            const seconds = orderDate
              .getUTCSeconds()
              .toString()
              .padStart(2, "0");
            const milliseconds = orderDate
              .getUTCMilliseconds()
              .toString()
              .padStart(3, "0");
              items.dateStr = `${year}-${month}-${day}`;
              items.timeStr = `${hours}:${minutes}:${seconds}`;
              const parsedDate = dayjs(items.dateStr);
              const newDate = parsedDate.add(3, 'day');
              const formattedNewDate = newDate.format('YYYY-MM-DD');
              items.extstr = formattedNewDate;
              return items;
            
          });
          console.log(ship)
          setShipmentData(ship);
        })
        .catch((error) => {
          console.error("Error fetching shipment data:", error);
        });
    }
  }, [token]);

  return (
    <Container mt={6}>
      <Box>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Order Status</Th>
              <Th> Order Booking Date</Th>
              <Th> Order Booking Time</Th>
              {/* <Th>Time</Th> */}
              <Th>Expected Delivery Date</Th>
              <Th>Amount to be Paid</Th>
            </Tr>
          </Thead>
          <Tbody>
            {shipmentData.map((shipment) => (
              <Tr key={shipment.id}>
                <Td>Confirmed</Td>
                <Td>{shipment.dateStr}</Td>
                <Td>{shipment.timeStr}</Td>
                <Td>{shipment.extstr}</Td>
                <Td>{shipment.totalOrderValue}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
};

export default Ship;
