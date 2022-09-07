import React, { useEffect, useState } from "react";
import { ListGroup, ListGroupItem, Row, Col, Image } from "react-bootstrap";
import { PayPalButton } from "react-paypal-button-v2";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getOrderDetails, payOrder } from "../actions/orderActions";
import axios from "axios";
import { ORDER_PAY_RESET } from "../constants/orderConstants";

const PlaceOrderScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [sdkReady, setSdkReady] = useState(false);

  const { loading, order, error } = useSelector((state) => state.orderDetails);
  const { loading: loadingPay, success: successPay } = useSelector(
    (state) => state.orderPay
  );

  useEffect(() => {
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get(`/api/config/paypal`);
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    if (!order || successPay) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetails(id));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, id, order, successPay]);

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(id, paymentResult));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroupItem>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>
                  Address:
                  {order.shippingAddress.address},{order.shippingAddress.city}{" "}
                  {order.shippingAddress.postalCode},
                  {order.shippingAddress.country}
                </strong>
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered at {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroupItem>
            <ListGroupItem>
              <h2>Payment Method</h2>
              <p>
                <strong>Method:{order.paymentMethod}</strong>
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid at {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroupItem>
            <ListGroupItem>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Your cart is empty!</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
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
                <Col>${order.itemsPrice}</Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem>
              <Row>
                <Col>Shipping</Col>
                <Col>${order.shippingPrice}</Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem>
              <Row>
                <Col>Tax</Col>
                <Col>${order.taxPrice}</Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem>
              <Row>
                <Col>TotalPrice</Col>
                <Col>${order.totalPrice}</Col>
              </Row>
            </ListGroupItem>
            {!order.isPaid && (
              <ListGroupItem>
                {loadingPay && <Loader />}
                {!sdkReady ? (
                  <Loader />
                ) : (
                  <PayPalButton
                    amount={Number(order.totalPrice)}
                    onSuccess={successPaymentHandler}
                    onApprove={() => {
                      alert(
                        `Amount ${order.totalPrice} has been successfully paid.`
                      );
                    }}
                  />
                )}
              </ListGroupItem>
            )}
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
