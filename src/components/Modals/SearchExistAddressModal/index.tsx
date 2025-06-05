import React, { Dispatch, SetStateAction } from "react";
import { Button, Card, Col, ListGroup, Modal, Row } from "react-bootstrap";
import { AddressResponseDto } from "../../../apis/dto/response/Auth";

interface Props {
  showSearchExistAddressModal: boolean;
  handleCloseSearchExistAddressModal: () => void;
  addressList: AddressResponseDto[];
  setPostalCode: Dispatch<SetStateAction<string>>;
  setDefaultAddress: Dispatch<SetStateAction<string>>;
  setDetailAddress: Dispatch<SetStateAction<string>>;
  setExtraAddress: Dispatch<SetStateAction<string>>;
}

export default function SearchExistAddressModal(props: Props) {
  const {
    showSearchExistAddressModal,
    handleCloseSearchExistAddressModal,
    addressList,
    setPostalCode,
    setDefaultAddress,
    setDetailAddress,
    setExtraAddress,
  } = props;

  return (
    <Modal
      backdrop="static"
      show={showSearchExistAddressModal}
      onHide={handleCloseSearchExistAddressModal}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>{"주소 선택"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card>
          <Card.Body>
            <ListGroup variant="flush">
              {addressList.map((addr, idx) => (
                <ListGroup.Item
                  key={idx}
                  className="py-2"
                  action
                  onClick={() => {
                    setPostalCode(addr.postalCode);
                    setDefaultAddress(addr.defaultAddress);
                    setDetailAddress(addr.detailAddress ?? "");
                    setExtraAddress(addr.extraAddress ?? "");
                    handleCloseSearchExistAddressModal();
                  }}
                >
                  <Row>
                    <Col>
                      <div>{addr.postalCode}</div>
                      <div>
                        {addr.defaultAddress} {addr.detailAddress}
                      </div>
                      <div>{addr.extraAddress}</div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" type="button" onClick={handleCloseSearchExistAddressModal}>
          {"닫기"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
