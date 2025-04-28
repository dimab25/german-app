"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";

function NavbarElement() {
  const { status } = useSession();
  const router = useRouter();

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={Link} href="/">
            DeutschInContext
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
              <Nav.Link as={Link} href="/dashboard">
                Dashboard
              </Nav.Link>
              <Nav.Link as={Link} href="/flashcards">
                Flashcards
              </Nav.Link>
            </Nav>
            <Nav>
              {" "}
              <div>
                {status === "authenticated" ? (
                  <Button
                    onClick={() => {
                      signOut({ redirect: false }).then(() => {
                        router.push("/");
                      });
                    }}
                  >
                    Logout
                  </Button>
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
