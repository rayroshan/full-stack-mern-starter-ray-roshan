import React, { useState, useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/shared/context/auth-context";
import Avatar from "@/components/avatar/Avatar";
import classes from "./Navigation.module.scss";
import {
  Container,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  UncontrolledDropdown,
} from "reactstrap";

const Navigation = (props) => {
  const { user } = props;
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const auth = useContext(AuthContext);

  return (
    <>
      <Navbar expand="md" className={classes.navigation}>
        <Container fluid>
          <NavbarBrand>
            <Link as="/" href="/">
              <img src="/logo.png" className="logo" />
            </Link>
          </NavbarBrand>

          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar className={classes.navItem}>
            <Nav className="ml-auto" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle nav className={classes.navItemAvatar}>
                  <Avatar
                    image={user?.image}
                    firstname={user?.firstname}
                    lastname={user?.lastname}
                  />
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                    <Link as="/account" href="/account">
                      My Account
                    </Link>
                  </DropdownItem>
                  <DropdownItem onClick={auth.logout}>Logout</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;
