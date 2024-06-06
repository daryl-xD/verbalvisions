import { useEffect, useState } from "react";
import { Container, Image, Row, Carousel, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Navigation from "../components/navigation";


export default function PostPageHome() {
  const [movies, setPosts] = useState([]);
  const trendingMovies = movies.filter(movies => movies.trending === 'true');
  const otherMovies = movies.filter(movies => movies.trending === 'false');

  async function getAllMovies() {
    const query = await getDocs(collection(db, "movies"));
    const movies = query.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    setPosts(movies);
  }


  useEffect(() => {
    getAllMovies();
  }, []);

  return (
    <>
<Navigation />
<Container className="d-flex flex-column vh-100 my-4">
    <Row className="mb-1">
    <Col>
      <h2>Trending Movies</h2>
    </Col>
  </Row>
  <Row className="justify-content-center">
  <Col>
    <Carousel className="mx-auto">
      {trendingMovies.map((movie, index) => (
        <Carousel.Item key={index} style={{ height: "500px" }}>
          <Link to={`movie/${movie.id}`}>
            <Image
              src={movie.landscape}
              style={{
                objectFit: "cover",
                width: "1200px",
                height: "500px",
              }}
            />
      <Carousel.Caption style={{ backgroundColor: 'rgba(128, 128, 128, 0.5)', display: 'inline-block', padding: '0.5rem 1rem', maxWidth: '80%', textAlign: 'center'  }}>
        <h3>{movie.title}</h3>
      </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  </Col>
</Row>
<Row className="mb-1">
  <Col>
    <br></br>
    <h2>Explore More</h2>
    <h3>Top Picks</h3>
    <Row>
      {otherMovies.map((movie, index) => (
        <Col md={3} key={index}>
          <Card>
            <Card.Header>{movie.title}</Card.Header>
            <Link to={`movie/${movie.id}`}>
              <Card.Img
                src={movie.image}
              />
            </Link>
          </Card>
        </Col>
      ))}
    </Row>
  </Col>
</Row>
</Container>
</>
  );
}
