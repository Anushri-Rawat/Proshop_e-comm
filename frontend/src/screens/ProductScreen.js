import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  ListGroupItem,
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  Form,
} from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Rating from "../components/Rating";
import {
  createProductReview,
  getProductDetails,
} from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";
import Meta from "../components/Meta";

const ProductScreen = () => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, product } = useSelector(
    (state) => state.productDetails
  );

  const { userInfo } = useSelector((state) => state.userLogin);

  const {
    loading: loadingReview,
    error: errorReview,
    success,
  } = useSelector((state) => state.productCreateReview);

  useEffect(() => {
    if (success) {
      alert("Review submitted");
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(getProductDetails(id));
  }, [dispatch, id, success]);

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReview(id, { rating, comment }));
  };

  return (
    <>
      <Link to="/">
        <Button className="btn btn-dark my-3">GO BACK</Button>
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message varaint="error">{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroupItem>
                  <h3>{product.name}</h3>
                </ListGroupItem>
                <ListGroupItem>
                  <Rating
                    value={product?.rating}
                    text={`${product?.numReviews} reviews`}
                  />
                </ListGroupItem>
                <ListGroupItem>Price: ${product.price}</ListGroupItem>
                <ListGroupItem>
                  Description: {product.description}
                </ListGroupItem>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup>
                  <ListGroupItem>
                    <Row>
                      <Col>Price</Col>
                      <Col>${product.price}</Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem>
                    <Row>
                      <Col>Status</Col>
                      <Col>
                        {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                      </Col>
                    </Row>
                  </ListGroupItem>
                  {product.countInStock > 0 && (
                    <ListGroupItem>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <FormControl
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </FormControl>
                        </Col>
                      </Row>
                    </ListGroupItem>
                  )}
                  <ListGroupItem className="d-grid">
                    <Button
                      onClick={addToCartHandler}
                      className="btn-block"
                      type="submit"
                      disabled={product.countInStock === 0}
                    >
                      Add to cart
                    </Button>
                  </ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className="mt-1">
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && (
                <Message>No Reviews yet!</Message>
              )}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroupItem key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroupItem>
                ))}
                <ListGroupItem>
                  <h2>Write a customer review.</h2>
                  {errorReview && (
                    <Message variant="danger">{errorReview}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={formSubmitHandler}>
                      <FormGroup controlId="rating">
                        <FormLabel>Rating</FormLabel>
                        <FormControl
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </FormControl>
                      </FormGroup>
                      <FormGroup controlId="comment" className="my-3">
                        <FormLabel>Comment</FormLabel>
                        <FormControl
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></FormControl>
                      </FormGroup>
                      <Button type="submit" variant="primary">
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="/login">sign in</Link> to write a review
                    </Message>
                  )}
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
