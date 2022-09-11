import React, { useEffect, useRef, useState } from "react";
import {
  FormGroup,
  FormLabel,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useSelector, useDispatch } from "react-redux";
import { getProductDetails, updateProduct } from "../actions/productActions";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";
import axios from "axios";

const UserEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const nameRef = useRef();
  const brandRef = useRef();
  const categoryRef = useRef();
  const descriptionRef = useRef();
  const countInStockRef = useRef();
  const priceRef = useRef();
  const [image, setImage] = useState();
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const { loading, error, product } = useSelector(
    (state) => state.productDetails
  );

  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((state) => state.productUpdate);

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate(`/admin/productList`);
    } else {
      if (!product.name || product?._id !== productId) {
        dispatch(getProductDetails(productId));
      } else {
        nameRef.current.value = product.name;
        priceRef.current.value = product.price;
        setImage(product.image);
        descriptionRef.current.value = product.description;
        brandRef.current.value = product.brand;
        categoryRef.current.value = product.category;
        countInStockRef.current.value = product.countInStock;
      }
    }
  }, [product, dispatch, productId, navigate, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name: nameRef.current.value,
        image,
        brand: brandRef.current.value,
        category: categoryRef.current.value,
        price: priceRef.current.value,
        countInStock: countInStockRef.current.value,
        description: descriptionRef.current.value,
      })
    );
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const { data } = await axios.post("/api/upload", formData, config);
      setImage(data);
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  return (
    <>
      <Link to="/admin/productList">Go Back</Link>
      <FormContainer>
        <h1>Edit product</h1>
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
            <FormGroup controlId="price" className="py-2">
              <FormLabel>Price</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter the price"
                ref={priceRef}
              ></FormControl>
            </FormGroup>
            <FormGroup controlId="brand" className="py-2">
              <FormLabel>Brand</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter the brand"
                ref={brandRef}
              ></FormControl>
            </FormGroup>
            <FormGroup controlId="category" className="py-2">
              <FormLabel>Category</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter the category"
                ref={categoryRef}
              ></FormControl>
            </FormGroup>
            <FormGroup controlId="countInStock" className="py-2">
              <FormLabel>Count in stock</FormLabel>
              <FormControl
                type="number"
                placeholder="Enter the countInStock"
                ref={countInStockRef}
              ></FormControl>
            </FormGroup>
            <FormGroup controlId="image" className="py-2">
              <FormLabel>Image</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter the image"
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                }}
              ></FormControl>
              <FormControl
                type="file"
                id="image-file"
                label="Choose File"
                custom
                onChange={uploadFileHandler}
              ></FormControl>
              {uploading && <Loader />}
            </FormGroup>
            <FormGroup controlId="description" className="py-2">
              <FormLabel>Description</FormLabel>
              <FormControl
                type="text"
                placeholder="Enter the description"
                ref={descriptionRef}
              ></FormControl>
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
