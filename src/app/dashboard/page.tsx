"use client";
import CreateFlashcard from "@/components/createFlashcard";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { APIOkResponseUser, User } from "../../../types/customTypes";
import { Container, Row, Col, Button, Card, CardImg } from "react-bootstrap";
import { CldImage } from "next-cloudinary";

function Dashboard() {
  const { data, status } = useSession();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const getMyProfile = async () => {
    try {
      if (data?.user?.id) {
        const requestOptions = {
          method: "GET",
          redirect: "follow",
        };
        const response = await fetch(
          `http://localhost:3000/api/users/${data.user.id}`,
          requestOptions
        );
        const result: APIOkResponseUser = await response.json();
        setUserProfile(result.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      getMyProfile();
    }
  }, [status]);

  return (
    <>
      <div>
        <Container className="mt-4">
        
          <Row>
            {/* Sidebar with user info */}
            <Col md={4}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>User Info</Card.Title>

                  <>
                    {userProfile?.imgUrl && (
                      <CardImg
                        as={CldImage}
                        width={200}
                        height={200}
                        crop="fill"
                        src={userProfile?.imgUrl}
                        alt=""
                      />
                    )}

                    <p>
                      <strong>Name:</strong> {userProfile && userProfile.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {userProfile && userProfile.email}
                    </p>
                    <p>
                      <strong>Native Language:</strong>{" "}
                      {userProfile && userProfile.native_language}
                    </p>
                    <Button
                      variant="outline-primary"
                      onClick={() => setEditingUser(true)}
                    >
                      Edit Info
                    </Button>
                  </>
                </Card.Body>
              </Card>
            </Col>

            {/* Main area */}
            <Col md={8}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Welcome back, {userProfile?.name}!</Card.Title>
                  <div style={{display:"flex", flexDirection:"row", flexWrap:"wrap", justifyContent:"center"}}>
                  <div>   <Link
                      href="/userFlashcards"
                      className="btn btn-outline-success mx-2"
                    >
                      My Flashcards
                    </Link></div>
                 <div>   <Link
                      href="/flashcards"
                      className="btn btn-outline-secondary mx-2"
                    >
                      Public Decks
                    </Link></div>
                   <CreateFlashcard />
                  
                  </div>
                </Card.Body>
              </Card>

              {/* Optional: Flashcard preview section */}
              <Card>
                <Card.Body>
                  <Card.Title>Chats</Card.Title>
                  <div>   <Link href="/chatbot" className="btn btn-outline-primary mx-2">
                  Chat
                </Link></div>
                  {/* Add flashcard previews here */}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Dashboard;
