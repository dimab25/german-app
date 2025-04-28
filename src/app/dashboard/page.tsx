"use client";
import CreateFlashcard from "@/components/createFlashcard";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { APIOkResponseUser, User } from "../../../types/customTypes";
import { Container, Row, Col, Button, Card, CardImg } from "react-bootstrap";
import { CldImage } from "next-cloudinary";
import UpdateProfile from "@/components/UpdateProfile";
import DeleteProfile from "@/components/DeleteProfile";
import "@/styles/global.css";
import styles from "./page.module.css";
import { FiUser } from "react-icons/fi";
import { PiCards } from "react-icons/pi";
import { IoEarth } from "react-icons/io5";
import { BsChatSquareText } from "react-icons/bs";
import { IoAddOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { Loader } from "@/utils/loader";

function Dashboard() {
  const { data, status } = useSession();
    const router = useRouter();

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

  const handleRefresh: () => void = () => {
    getMyProfile();
  };

  useEffect(() => {
    if (status === "authenticated") {
      getMyProfile();
    }
  }, [status]);

    useEffect(() => {
      if (status === "unauthenticated") {
        router.push("/login"); // Redirect to login if not authenticated
      }
    }, [status, router]);
  
    if (status === "loading") {
      return <Loader/>; 
    }
  return (
    <>
      <div className={styles.pageLayout}>
        <Container className="mt-3">
          <Row>
            {/*User info */}
            <Col md={4}>
              <Card className="mb-2">
                <Card.Body>
                  <Card.Title>User Info</Card.Title>

                  <>
                    {userProfile?.image && (
                      <CardImg
                        as={CldImage}
                        width={100}
                        height={100}
                        sizes="60vw"
                        crop="fill"
                        src={userProfile?.image}
                        alt=""
                        style={{
                          height: "60%",
                          width: "100%",
                          padding: "1rem 4rem 1rem 4rem",
                          borderRadius: "50%",
                        }}
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
                    <div className={styles.userInfoButtons}>
                      {" "}
                      <UpdateProfile refresh={handleRefresh} />
                      <DeleteProfile refresh={handleRefresh} />
                    </div>
                  </>
                </Card.Body>
              </Card>
            </Col>

            {/* Main area */}
            <Col md={8}>
              <Card className="mb-2">
                <Card.Body>
                  <Card.Title>Flashcards</Card.Title>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    <div className={styles.flashcardButtons}>
                      <Link
                        href="/userFlashcards"
                        className="btn btn-outline-secondary "
                        style={{ width: "12rem" }}
                      >
                        <FiUser size={30} />
                        <PiCards size={50} />
                        <br /> My Flashcards
                      </Link>{" "}
                      <Link
                        href="/flashcards"
                        className="btn btn-outline-secondary"
                        style={{ width: "12rem" }}
                      >
                        <IoEarth size={30} />
                        <PiCards size={50} />
                        <br />
                        Public Decks
                      </Link>
                      <CreateFlashcard />
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Chats*/}
              <Card className="mb-2">
                <Card.Body>
                  <Card.Title>Chats</Card.Title>
                  <div className={styles.flashcardButtons}>
                    {" "}
                    <Link
                      href="/chatbot"
                      className="btn btn-outline-secondary"
                      style={{ width: "12rem" }}
                    >
                      <IoAddOutline size={30} />
                      <BsChatSquareText size={40} />
                      <br />
                      New chat
                    </Link>
                    <Link
                      href="/chatbot"
                      className="btn btn-outline-secondary"
                      style={{ width: "12rem" }}
                    >
                      <FiUser size={30} />
                      <BsChatSquareText size={40} />
                      <br />
                      Saved chat
                    </Link>
                  </div>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Card.Title>Links</Card.Title>
                  <div className={styles.flashcardButtons}>
                    {" "}
                    <Link href="https://www.italki.com/en/teachers/german" style={{ width: "8rem" }} target="_blank">
                      <CardImg
                        as={CldImage}
                        width={100}
                        height={100}
                        sizes="60vw"
                        crop="fill"
                        src="https://res.cloudinary.com/dggcfjjc3/image/upload/v1745832375/unnamed_pahege.png"
                        alt=""
                        style={{
                          height: "100%",
                          width: "100%",
                        }}
                      />
                    </Link>
                    <Link href="https://migaku.com/"  target="_blank" style={{ width: "8rem" }}>
                      <CardImg
                        as={CldImage}
                        width={100}
                        height={60}
                        sizes="60vw"
                        crop="fill"
                        src="https://res.cloudinary.com/dggcfjjc3/image/upload/v1745832370/og_kdfqfk.png"
                        alt=""
                        style={{
                          height: "100%",
                          width: "100%",
                        }}
                      />
                    </Link>
                    <Link href="https://www.easygerman.org/" style={{ width: "8rem" }} target="_blank">
                      <CardImg
                        as={CldImage}
                        width={100}
                        height={100}
                        sizes="60vw"
                        crop="fill"
                        src="https://res.cloudinary.com/dggcfjjc3/image/upload/v1745832367/channels4_profile_pxsx9r.jpg"
                        alt=""
                        style={{
                          height: "100%",
                          width: "100%",
                      
                        }}
                      />
                    </Link>
                    <Link href="https://www.duden.de/" style={{ width: "8rem" }} target="_blank">
                      <CardImg
                        as={CldImage}
                        width={100}
                        height={100}
                        sizes="60vw"
                        crop="fill"
                        src="https://res.cloudinary.com/dggcfjjc3/image/upload/v1745832361/Duden_FB_Profilbild_ll46zh.jpg"
                        alt=""
                        style={{
                          height: "100%",
                          width: "100%",
                      
                        }}
                      />
                    </Link>

                   
                  </div>
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
