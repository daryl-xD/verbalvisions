import { useEffect, useState } from "react";
import { Container, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Navigation from "../components/navigation";


export default function PostPageHome() {
  const [movies, setPosts] = useState([]);

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

  const ImagesRow = () => {
    return movies.map((post, index) => <ImageSquare key={index} post={post} />);
  };

  return (
    <>
      <Navigation />
      <Container>
        <Row>
          <ImagesRow />
        </Row>
      </Container>
    </>
  );
}

function ImageSquare({ post }) {
  const { image, id } = post;
  return (
    <Link
      to={`movie/${id}`}
      style={{
        width: "18rem",
        marginLeft: "1rem",
        marginTop: "2rem",
      }}
    >
      <Image
        src={image}
        style={{
          objectFit: "cover",
          width: "18rem",
          height: "18rem",
        }}
      />
    </Link>
  );
}
