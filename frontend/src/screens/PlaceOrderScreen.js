import React, { useEffect } from "react";
import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Button,
  Image,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CheckoutStep from "../components/CheckoutStep";
import Message from "../components/Message";
import { createOrder } from "../actions/orderActions";

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod, cartItems } = cart;

  const addDecimal = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  //calculate price
  cart.itemsPrice = addDecimal(
    cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)
  );

  cart.shippingPrice = addDecimal(cart.itemsPrice > 100 ? 0 : 100);

  cart.taxPrice = addDecimal(Number(0.15 * cart.itemsPrice));

  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  const { order, success, error } = useSelector((state) => state.createOrder);

  useEffect(() => {
    // eslint-disable-next-line
    if (success) navigate(`/order/${order._id}`);
  }, [navigate, success, order]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  return (
    <>
      <CheckoutStep step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroupItem>
              <h2>Shipping</h2>
              <strong>
                Address:
                {shippingAddress.address},{shippingAddress.city}{" "}
                {shippingAddress.postalCode},{shippingAddress.country}
              </strong>
            </ListGroupItem>
            <ListGroupItem>
              <h2>Payment Method</h2>
              <strong>Method:{paymentMethod}</strong>
            </ListGroupItem>
            <ListGroupItem>
              <h2>Order Items</h2>
              {cartItems.length === 0 ? (
                <Message>Your cart is empty!</Message>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item, index) => (
                    <ListGroupItem key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/products/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} * {item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
            </ListGroupItem>
          </ListGroup>
        </Col>
        <Col md={4}>
          <ListGroup>
            <ListGroupItem>
              <h2>Order Summary</h2>
            </ListGroupItem>
            <ListGroupItem>
              <Row>
                <Col>Items</Col>
                <Col>${cart.itemsPrice}</Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem>
              <Row>
                <Col>Shipping</Col>
                <Col>${cart.shippingPrice}</Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem>
              <Row>
                <Col>Tax</Col>
                <Col>${cart.taxPrice}</Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem>
              <Row>
                <Col>TotalPrice</Col>
                <Col>${cart.totalPrice}</Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem>
              {error && <Message variant="danger">{error}</Message>}
            </ListGroupItem>
            <ListGroupItem className="d-grid">
              <Button
                type="button"
                className="btn-block"
                disabled={cartItems.length === 0}
                onClick={placeOrderHandler}
              >
                Place Order
              </Button>
            </ListGroupItem>
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
