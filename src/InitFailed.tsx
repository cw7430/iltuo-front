import { Container, Card, Button, Alert } from "react-bootstrap";

interface Props {
  retry: () => void;
}

export default function InitFailed(props: Props) {
  const { retry } = props;

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Card style={{ width: "100%", maxWidth: "500px" }} className="text-center shadow-lg">
        <Card.Body>
          <Alert variant="danger">
            <Alert.Heading>앱 초기화 실패</Alert.Heading>
            <p>네트워크 상태를 확인하거나, 아래 버튼을 눌러 다시 시도해주세요.</p>
          </Alert>
          <Button variant="primary" onClick={retry}>
            다시 시도
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
