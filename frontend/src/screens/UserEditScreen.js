import React, { useEffect, useRef, useState } from "react";
import {
  FormGroup,
  FormLabel,
  Form,
  FormControl,
  Button,
  FormCheck,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useSelector, useDispatch } from "react-redux";
import { getUserDetails, updateUser } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../constants/userConstants";

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const nameRef = useRef();
  const emailRef = useRef();
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();

  const { loading, error, user } = useSelector((state) => state.userDetails);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((state) => state.userUpdate);

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      navigate(`/admin/userList`);
    } else {
      if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(userId));
      } else {
        nameRef.current.value = user.name;
        emailRef.current.value = user.email;
        setIsAdmin(user.isAdmin);
      }
    }
  }, [user, dispatch, userId, navigate, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateUser({
        _id: userId,
        name: nameRef.current.value,
        email: emailRef.current.value,
        isAdmin,
      })
    );
  };

  return (
    <>
      <Link to="/admin/userList">Go Back</Link>
      <FormContainer>
        <h1>Edit user</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
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
            <FormGroup controlId="isAdmin" className="py-2">
              <FormCheck
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></FormCheck>
            </FormGroup>
            <Button type="submit" variant="primary" className="mt-3">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
