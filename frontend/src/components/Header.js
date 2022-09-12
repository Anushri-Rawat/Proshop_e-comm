import React from "react";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  NavbarBrand,
  NavLink,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../actions/userActions";
import SearchBar from "./SearchBar";

const Header = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userLogin);

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <NavbarBrand>ShopZee</NavbarBrand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="d-lg-flex justify-content-end"
          >
            <SearchBar />
            <Nav className="ml-auto">
              <LinkContainer to="/cart">
                <NavLink>
                  <i className="fas fa-shopping-cart"></i>
                  {"  "}Cart
                </NavLink>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <NavLink>
                    <i className="fas fa-user"></i> Sign in
                  </NavLink>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="admin" id="adminMenu">
                  <LinkContainer to="/admin/userList">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/productList">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderList">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
