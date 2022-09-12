import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Product from "../components/Product";
import { Row, Col, Button } from "react-bootstrap";
import { getProductList } from "../actions/productActions.js";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useParams } from "react-router-dom";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";
import { Link } from "react-router-dom";

const HomeScreen = () => {
  let { keyword, pageNumber } = useParams();
  pageNumber = pageNumber || 1;

  const dispatch = useDispatch();
  const { loading, error, products, pages, page } = useSelector(
    (state) => state.productList
  );

  useEffect(() => {
    dispatch(getProductList(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <Meta />
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/">
          <Button>Go Back</Button>
        </Link>
      )}
      <h1>Latest products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
