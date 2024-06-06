import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Form } from 'react-bootstrap';

export default function Navigation() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    let status = "Sign In";
    if (loading) return null;
    if (user) status = "Sign Out";

    return (
        <Navbar variant="dark" bg="dark">
            <Container>
                <Navbar.Brand href="/">VerbalVisionS</Navbar.Brand>
                <Form>
                    <Form.Control 
                        type="text" 
                        placeholder="Search" 
                        className="mr-sm-2" 
                        style={{ width: '500px' }} 
                    />
                </Form>
                <Nav>
                    <Nav.Link onClick={() => {
                        if (status === "Sign In") {
                            navigate("/login");
                        } else {
                            signOut(auth);
                        }
                    }}>{status}</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}