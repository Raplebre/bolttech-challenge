import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Navigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown'

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <span style={{cursor: "pointer"}}
        href=""
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
        &#x25bc;
    </span>
));

const NavbarComponent = () => {
    const [dropdown, setDropdown] = useState(false)
    const [logout, setLogout] = useState(false)

    const username = localStorage.getItem("username")

    const logoutUser = () => {
        localStorage.removeItem("token")
        setLogout(true)
    }

    return (
        <>
            <Navbar style={{ borderBottom: "1px solid #c4c4c4" }} bg="light" variant="light">
                <Container>
                    <Navbar.Brand>TODO List</Navbar.Brand>
                    <Nav className="ms-auto">
                        <div className='bg-light'>
                            <Dropdown>
                                <Dropdown.Toggle as={CustomToggle}>
                                    {username}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => logoutUser()}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </Nav>
                </Container>
            </Navbar>
            {logout && <Navigate to="/login" replace={true} />}
        </>
    );
}

export default NavbarComponent;