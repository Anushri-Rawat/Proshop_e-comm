import React, { useEffect } from "react";
import { Table, Button, Row, Col } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useSelector, useDispatch } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import {
  createProduct,
  deleteProduct,
  getProductList,
} from "../actions/productActions";
import { useNavigate } from "react-router-dom";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";

const ProductListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, products } = useSelector(
    (state) => state.productList
  );
  const { userInfo } = useSelector((state) => state.userLogin);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = useSelector((state) => state.productDelete);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = useSelector((state) => state.productCreate);

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    if (!userInfo.isAdmin) {
      navigate(`/login`);
    }
    if (successCreate) {
      navigate(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(getProductList());
    }
  }, [
    dispatch,
    userInfo,
    navigate,
    successDelete,
    successCreate,
    createdProduct._id,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteProduct(id));
    }
  };
  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <>
      <Row>
        <Col className="text-align-center" md={10}>
          <h1>Products</h1>
        </Col>
        <Col className="text-right" md={2}>
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i>Create Product
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${Number(product.price).toFixed(2)}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(product._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default ProductListScreen;
