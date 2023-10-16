import React, { useContext } from 'react'
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Store } from '../Store';

export default function AdminMorefields() {
    const { state } = useContext(Store);
    const { toggleState, userInfo } = state;
    const theme = toggleState ? 'dark' : 'light';
    return (
        <div>
            <Card className={`projectScreenCard2 ${theme}CardBody`}>
                <Card.Header className={`${theme}CardHeader`}>Chats</Card.Header>
                <Card.Body className="d-flex flex-wrap gap-3 ">
                    {/* -------- */}

                    return (
                    <Card className="chatboxes">
                        <Card.Header>Chat</Card.Header>
                        <Card.Body>
                            <Link to={`/chatWindowScreen/`}>
                                <Button
                                    className="chatBtn"
                                    type="button"
                                >

                                </Button>
                            </Link>
                        </Card.Body>
                    </Card>
                    );


                    {/* -------- */}
                </Card.Body>
            </Card>
        </div>
    )
}
