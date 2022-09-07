import React, { useState } from "react";
import {
  FormGroup,
  FormLabel,
  Form,
  Button,
  Col,
  FormCheck,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import { useSelector, useDispatch } from "react-redux";
import CheckoutStep from "../components/CheckoutStep";
import { savePaymentMethod } from "../actions/cartActions";

const PaymentScreen = () => {
  const { shippingAddress } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!shippingAddress) {
    navigate("/shipping");
  }
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutStep step1 step2 step3 />
      <h2>Payment Method</h2>
      <Form onSubmit={submitHandler}>
        <FormGroup>
          <FormLabel as="legend">Select Method</FormLabel>
          <Col>
            <FormCheck
              type="radio"
              label="PayPal or Credit Card"
              value="PayPal"
              name="paymentMethod"
              checked
              onChange={(e) => setPaymentMethod(e.target.method)}
            ></FormCheck>
            <FormCheck
              type="radio"
              label="Stripe"
              value="Stripe"
              name="paymentMethod"
              onChange={(e) => setPaymentMethod(e.target.method)}
            ></FormCheck>
          </Col>
        </FormGroup>
        <Button type="submit" variant="primary" className="mt-3">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
