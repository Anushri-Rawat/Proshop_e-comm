import React, { useState } from "react";
import {
  FormGroup,
  FormLabel,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import { useSelector, useDispatch } from "react-redux";
import { saveShippingAddress } from "../actions/cartActions";
import CheckoutStep from "../components/CheckoutStep";

const ShippingScreen = () => {
  const { shippingAddress } = useSelector((state) => state.cart);
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [country, setCountry] = useState(shippingAddress.country || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, country, city, postalCode }));
    navigate("/payments");
  };

  return (
    <FormContainer>
      <CheckoutStep step1 step2 />
      <h2>Shipping Address</h2>
      <Form onSubmit={submitHandler}>
        <FormGroup controlId="address" className="py-2">
          <FormLabel>Address</FormLabel>
          <FormControl
            type="text"
            placeholder="Enter the address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          ></FormControl>
        </FormGroup>
        <FormGroup controlId="country" className="py-2">
          <FormLabel>Country</FormLabel>
          <FormControl
            type="text"
            placeholder="Enter the country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          ></FormControl>
        </FormGroup>
        <FormGroup controlId="city" className="py-2">
          <FormLabel>City</FormLabel>
          <FormControl
            type="text"
            placeholder="Enter the city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          ></FormControl>
        </FormGroup>
        <FormGroup controlId="postalCode" className="py-2">
          <FormLabel>Postal Code</FormLabel>
          <FormControl
            type="text"
            placeholder="Enter the postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          ></FormControl>
        </FormGroup>
        <Button type="submit" variant="primary" className="mt-3">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
