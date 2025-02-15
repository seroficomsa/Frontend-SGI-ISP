import React from "react";
import { Row, Col, Typography, Space } from "antd";

export default function SeroficomFooter() {
    return (
        <footer style={{ textAlign: "center", background: "#ffffff", padding: "16px 0" }}>
            <Row justify="space-between">
                <Col>
                    <Typography.Text>© 2025 Seroficom. All rights reserved.</Typography.Text>
                </Col>
                <Col>
                    <Space>
                        <Typography.Link>About Us</Typography.Link>
                        <Typography.Link>Contact</Typography.Link>
                        <Typography.Link>Privacy</Typography.Link>
                    </Space>
                </Col>
            </Row>
        </footer>
    );
}
