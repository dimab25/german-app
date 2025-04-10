"use client"
import { Flashcard } from '@/app/flashcard/page'
import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

function CreateFlashcard() {

  const [newFlashcard, setNewFlashcard] = useState<Flashcard| null>(null) 
  const [success, setSuccess] = useState(null)
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleInput =(e:React.ChangeEvent<HTMLInputElement >)=>{
    console.log('e.target.value :>> ', e.target.value );
    setNewFlashcard({ ...newFlashcard!, [e.target.name]: e.target.value });
  }

const submitNewFlashcard=async(e)=>{
  e.preventDefault();
  try {
    const myHeaders = new Headers();
myHeaders.append("Content-Type", "text/plain");

// const raw = `{\"backside\":\`${newFlashcard?.backside}\", \"frontside\":\"front1\", \"imageUrl\":\"asdf2\", \"user_id\":\"67ee55b7fcafbc953cfe0f56\"}`;

const raw = JSON.stringify({
  backside: newFlashcard?.backside,
  frontside: newFlashcard?.frontside,
  imageUrl: "asdf2",
  user_id: "67ee55b7fcafbc953cfe0f56"
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};
const response= await fetch("http://localhost:3000/api/flashcards", requestOptions);
const result = await response.json();
setSuccess(result.success)
console.log('result :>> ', result);
  
  } catch (error) {
    console.error(error)
  }
}
console.log('newFlashcard :>> ', newFlashcard);

  return (
    <>
     <Button variant="primary" onClick={handleShow}>
       Create new Flashcard
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create a new Flashcard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={submitNewFlashcard}>
    <Form.Group className="mb-3" controlId="formBasicEmail">
    <Form.Label>Frontside</Form.Label>
    <Form.Control onChange={handleInput} type="text" name='frontside' placeholder="" />
    </Form.Group>
    <Form.Group className="mb-3" controlId="formBasicEmail">
    <Form.Label>Backside</Form.Label>
    <Form.Control onChange={handleInput} type="text" name='backside' placeholder="" />
    </Form.Group>
 <Button type="submit">
        Create
    </Button>
    </Form>
    {success &&  <div>Flashcard created</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
    
        </Modal.Footer>
      </Modal>
    
 
        </>
  )
}

export default CreateFlashcard