import React, { useEffect, useRef, useState } from "react";
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
import { register } from "../actions/userActions";

const RegisterScreen = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [message, setMessage] = useState(null);

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, userInfo } = useSelector(
    (state) => state.userRegister
  );
  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      navigate(`/${redirect}`);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      setMessage("Passwords do not match");
    } else {
      setMessage(null);
      dispatch(
        register(
          nameRef.current.value,
          emailRef.current.value,
          passwordRef.current.value
        )
      );
    }
  };
  return (
    <FormContainer>
      <h1>Sign Up</h1>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
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
        <FormGroup controlId="password" className="py-2">
          <FormLabel>Password</FormLabel>
          <FormControl
            type="password"
            placeholder="Enter the password"
            ref={passwordRef}
          ></FormControl>
        </FormGroup>
        <FormGroup controlId="confirmPassword" className="py-2">
          <FormLabel>Confirm Password</FormLabel>
          <FormControl
            type="password"
            placeholder="Enter the confirmPassword"
            ref={confirmPasswordRef}
          ></FormControl>
        </FormGroup>
        <Button type="submit" variant="primary" className="mt-3">
          Sign Up
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          Already have an account?
          <Link to={redirect ? `/login?redirect=${redirect}` : `/login`}>
            Sign In
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
