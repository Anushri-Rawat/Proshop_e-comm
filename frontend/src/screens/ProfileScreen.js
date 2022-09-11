import React, { useEffect, useRef, useState } from "react";
import {
  FormGroup,
  FormLabel,
  Form,
  FormControl,
  Button,
  Row,
  Col,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useSelector, useDispatch } from "react-redux";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { OrdersList } from "../actions/orderActions";
import { LinkContainer } from "react-router-bootstrap";

const ProfileScreen = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const currentPasswordRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [message, setMessage] = useState(null);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.userLogin);

  const { loading, error, user } = useSelector((state) => state.userDetails);

  const {
    loading: loadingOrders,
    error: errorOrders,
    orders,
  } = useSelector((state) => state.myOrdersList);

  const { error: updateMsg, success } = useSelector(
    (state) => state.userUpdateProfile
  );

  useEffect(() => {
    if (!userInfo) {
      navigate(`/login`);
    } else {
      if (!user?.name) {
        dispatch(getUserDetails("profile"));
        dispatch(OrdersList());
      } else {
        nameRef.current.value = user.name;
        emailRef.current.value = user.email;
      }
    }
  }, [navigate, userInfo, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    setMessage(null);
    if (
      passwordRef.current &&
      passwordRef.current.value !== confirmPasswordRef.current.value
    ) {
      setMessage("Passwords do not match");
    } else {
      dispatch(
        updateUserProfile({
          name: nameRef.current.value,
          email: emailRef.current.value,
          currentPassword: currentPasswordRef?.current?.value,
          password: passwordRef?.current?.value,
        })
      );
    }
  };
  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {updateMsg && <Message variant="danger">{updateMsg}</Message>}
        {success && <Message variant="success">Profile updated!</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <FormGroup controlId="name" className="py-2">
            <FormLabel>Name</FormLabel>
            <FormControl
              type="text"
              placeholder="Enter the name"
              ref={nameRef}
            ></FormControl>
          </FormGroup>
          <FormGroup controlId="email" className="py-2">
            <FormLabel>Email</FormLabel>
            <FormControl
              type="email"
              placeholder="Enter the email"
              ref={emailRef}
            ></FormControl>
          </FormGroup>
          <a
            href=""
            style={{
              display: "block",
              textDecoration: "underline",
              padding: "5px 0",
            }}
            onClick={(e) => setOpen(!open)}
          >
            Update Password
          </a>
          {open && (
            <>
              <FormGroup controlId="currentPassword" className="py-2">
                <FormLabel> Current Password</FormLabel>
                <FormControl
                  type="password"
                  placeholder="Enter the current password"
                  ref={currentPasswordRef}
                ></FormControl>
              </FormGroup>
              <FormGroup controlId="password" className="py-2">
                <FormLabel>New password</FormLabel>
                <FormControl
                  type="password"
                  placeholder="Enter the new password"
                  ref={passwordRef}
                ></FormControl>
              </FormGroup>
              <FormGroup controlId="confirmPassword" className="py-2">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl
                  type="password"
                  placeholder="Enter the Password"
                  ref={confirmPasswordRef}
                ></FormControl>
              </FormGroup>
            </>
          )}
          <Button type="submit" variant="primary" className="mt-3">
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My orders</h2>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant="danger">{errorOrders}</Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button variant="light" className="btn-sm">
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
