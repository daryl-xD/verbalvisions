import React, { useEffect, useState } from "react";
import { Card, Form, Col, Button, Container, Row, Image, Badge, Modal, ListGroup } from 'react-bootstrap';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams, Link } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getDoc, writeBatch } from "firebase/firestore";
import Navigation from "../components/navigation";

export default function MoviePageDetails() {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(10);
  const [trailer, setTrailer] = useState("");
  const [releasedate, setReleasedate] = useState("");
  const [origin, setOrigin] = useState("");
  const [site, setSite] = useState("");
  const [location, setLocations] = useState("");
  const [production, setProduction] = useState("");
  const params = useParams();
  const id = params.id;
  const [showModal, setShowModal] = useState(false);
  const [updatedComment, setUpdatedComment] = useState('');
  const [commentToUpdate, setCommentToUpdate] = useState(null);
  const [authuser, loading] = useAuthState(auth);
  const navigate = useNavigate();


  async function getmovie(id) {
    const movieDocument = await getDoc(doc(db, "movies", id));
    const movie = movieDocument.data();
    setCaption(movie.caption);
    setImage(movie.image);
    setTitle(movie.title);
    setComments(movie.comments || []);
    setTrailer(movie.trailer);
    setReleasedate(movie.releasedate);
    setOrigin(movie.origin);
    setSite(movie.site); 
    setLocations(movie.location);
    setProduction(movie.production);
  }

async function addComment(e){
  e.preventDefault();

  try {
      const newCommentObj = {
      id: new Date().getTime(), // Add a unique id
      comment: newComment,
      rating: rating + "/10",
      time: new Date().toISOString(),
      user: authuser.email,
    };
    const movieRef = doc(db, 'movies', id);
    await updateDoc(movieRef, {
      comments: arrayUnion(newCommentObj)
    });

    // Update comments state and clear the form
    setComments(prevComments => [...prevComments, newCommentObj]);
    setNewComment('');
    setRating(10);
  } catch (e) {
    console.error('Error adding comment: ', e);
  }
};

async function deleteComment(commentId) {
  const movieRef = doc(db, 'movies', id);
  const commentToDelete = comments.find(comment => comment.id === commentId);
  await updateDoc(movieRef, {
    comments: arrayRemove(commentToDelete)
  });
  setComments(comments.filter(comment => comment.id !== commentId));
}

const openModal = (comment) => {
  setCommentToUpdate(comment);
  setUpdatedComment(comment.comment);
  setShowModal(true);
};

const closeModal = () => {
  setShowModal(false);
};

const handleUpdate = async () => {
  const movieRef = doc(db, 'movies', id);
  const updatedCommentObj = {
    ...commentToUpdate,
    comment: updatedComment
  };

  // Start a batch
  const batch = writeBatch(db);

  // Remove the old comment
  batch.update(movieRef, {
    comments: arrayRemove(commentToUpdate)
  });

  // Add the updated comment
  batch.update(movieRef, {
    comments: arrayUnion(updatedCommentObj)
  });

  // Commit the batch
  await batch.commit();

  // Update the local state
  setComments(comments.map(comment => comment.id === commentToUpdate.id ? updatedCommentObj : comment));
  closeModal();
};

  useEffect(() => {

    if (loading) return;
    getmovie(id);
  }, [id, navigate, authuser, loading]);


  return (
    <>
      <Navigation />
   <Container>
  <Row className="g-1" style={{ marginTop: "2rem" }}>
    <Col md={3}>
      <Image src={image} style={{ width: "100%" }} />
    </Col>
    <Col md={6}>
      <iframe width="100%" height="100%" src={trailer} title={title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ></iframe>
    </Col>
    <Col md={3}>
      <Card className="h-100">
        <Card.Header as="h2">Details</Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item><strong>Title: </strong>{title}</ListGroup.Item>
          <ListGroup.Item><strong>Release Date:</strong> {releasedate}</ListGroup.Item>
          <ListGroup.Item><strong>Country of Origin:</strong> {origin}</ListGroup.Item>
          <ListGroup.Item><strong>Official Sites:</strong> <a href={site} target="_blank" rel="noopener noreferrer">{site}</a></ListGroup.Item>
          <ListGroup.Item><strong>Filming Locations:</strong> {location}</ListGroup.Item>
          <ListGroup.Item><strong>Production Companies:</strong> {production}</ListGroup.Item>
        </ListGroup>
      </Card>
    </Col>
    <Col style={{ marginTop: "1rem" }}>
      <Card>
        <Card.Body>
          <h2><Card.Text>Synopsis</Card.Text></h2>
          <Card.Text>{caption}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  </Row>
</Container>
     
      <Container style={{ marginTop: "2rem" , marginBottom:"2rem"}}>
      {console.log("comments are here" +comments)}
  <h4>Reviews:</h4>
  {comments.length === 0 ? (
    <p>No reviews yet, be the first to review</p>
  ) : (
    comments.map((comment, index) => (
      <Card key={index} className="mb-3">
        <Card.Header>{comment.user}:</Card.Header>
        <Card.Body>
          <blockquote className="blockquote mb-0">
            <p>{comment.comment}</p>
            <footer className="blockquote-footer">
              {comment.rating} <br /> <cite title="Source Title">{comment.time}</cite>
            </footer>
          </blockquote>
          {authuser && authuser.email === comment.user && (
            <div className="d-flex justify-content-end">
            <Button variant="warning" onClick={() => openModal(comment)} style={{ marginRight: '10px' }}>
            Update
          </Button>
            <Button variant="danger" onClick={() => deleteComment(comment.id)}>
              Delete
            </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    ))
  )}
<Card>
  <Card.Header>
    <Card.Title style={{ fontSize: '16px' }}>
    {authuser ? `Commenting as: ${authuser.email}` : 'Not logged in'}
    </Card.Title>
  </Card.Header>
  <Card.Body>
    {authuser ? (
      <Form onSubmit={addComment}>
        <Form.Group controlId="commentForm">
          <Form.Label>Add a comment:</Form.Label>
          <Form.Control as="textarea" rows={1} value={newComment} onChange={e => setNewComment(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="ratingForm">
          <Form.Label>Rating: <small className="text-muted">(drag to rate)</small></Form.Label>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <Col sm={4}>
              <Form.Control type="range" min="0" max="10" step="1" value={rating} onChange={e => setRating(e.target.value)} />
            </Col>
            <Col sm={1} style={{ marginLeft: '10px' }}>
              <Badge variant="secondary">{rating}/10</Badge>
            </Col>
          </div>
        </Form.Group>

        <div className="d-flex justify-content-end">
          <Button variant="success" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    ) : (
      <div style={{ backgroundColor: 'lightgray', padding: '1em', textAlign: 'center' }}>
        Please <Link to="/login">log in</Link> to comment
      </div>
    )}
  </Card.Body>
</Card>
</Container>

<Modal show={showModal} onHide={closeModal}>
  <Modal.Header closeButton>
    <Modal.Title>Update Comment</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="comment">
        <Form.Label>Comment</Form.Label>
        <Form.Control type="text" value={updatedComment} onChange={e => setUpdatedComment(e.target.value)} />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={closeModal}>
      Close
    </Button>
    <Button variant="primary" onClick={handleUpdate}>
      Save Changes
    </Button>
  </Modal.Footer>
</Modal>
    </>
  );
}