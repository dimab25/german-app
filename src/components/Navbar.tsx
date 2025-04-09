"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";

function NavbarElement() {
  const { status, data, update } = useSession();

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={Link} href="/">
            PROJECT NAME
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} href="/">
                Home
              </Nav.Link>

              <Nav.Link as={Link} href="/chatbot">
                Chat
              </Nav.Link>
            </Nav>
            <Nav>
              {" "}
              <div>
                {status === "authenticated" ? (
                  <Button>Logout</Button>
                ) : (
                  <Link href={"/login"}>
                    <Button>Login</Button>
                  </Link>
                )}
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarElement;
