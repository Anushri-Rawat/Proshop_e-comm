import React, { useEffect, useRef } from "react";
import {
  FormGroup,
  FormLabel,
  Form,
  FormControl,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../actions/userActions";

const LoginScreen = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, userInfo } = useSelector((state) => state.userLogin);
  const redirect = location.search ? location.search.split("=")[1] : "";

  useEffect(() => {
    if (userInfo) {
      navigate(`/${redirect}`);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(emailRef.current.value, passwordRef.current.value));
  };
  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <FormGroup controlId="email" className="py-2">
          <FormLabel>Email</FormLabel>
          <FormControl
            type="email"
            placeholder="Enter the email"
            ref={emailRef}
          ></FormControl>
        </FormGroup>
        <FormGroup controlId="password" className="py-2">
          <FormLabel>Password</FormLabel>
          <FormControl
            type="password"
            placeholder="Enter the password"
            ref={passwordRef}
          ></FormControl>
        </FormGroup>
        <Button type="submit" variant="primary" className="mt-3">
          Sign In
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          New Customer?
          <Link to={redirect ? `/register?redirect=${redirect}` : `/register`}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
