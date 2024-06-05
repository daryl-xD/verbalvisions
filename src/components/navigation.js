import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
// Remove the declaration and assignment of the 'state' variable

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