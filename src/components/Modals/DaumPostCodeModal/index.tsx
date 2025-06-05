import { Dispatch, SetStateAction, useEffect, useState } from "react";
import DaumPostcodeEmbed from "react-daum-postcode";
import { Address } from "react-daum-postcode";
import { Modal, Button } from "react-bootstrap";
import { Loader } from "../../Gif";

interface Props {
  showDaumPostCodeModal: boolean;
  handleCloseDaumPostCodeModal: () => void;
  setPostalCode: Dispatch<SetStateAction<string>>;
  setDefaultAddress: Dispatch<SetStateAction<string>>;
  setDetailAddress: Dispatch<SetStateAction<string>>;
  setExtraAddress: Dispatch<SetStateAction<string>>;
  detailAddressRef: React.RefObject<HTMLInputElement | null>;
}

export default function DaumPostCodeModal(props: Props) {
  const {
    showDaumPostCodeModal,
    handleCloseDaumPostCodeModal,
    setPostalCode,
    setDefaultAddress,
    setDetailAddress,
    setExtraAddress,
    detailAddressRef,
  } = props;

  const [isLoading, setIsLoading] = useState(true);

  const handleComplete = (data: Address) => {
    let postalCode = data.zonecode;
    let defaultAddress = "";
    let extraAddress = "";

    if (data.userSelectedType === "R") {
      defaultAddress = data.roadAddress;
      if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "" && data.apartment === "Y") {
        extraAddress += extraAddress !== "" ? ", " + data.buildingName : data.buildingName;
      }
      if (extraAddress !== "") {
        extraAddress = "(" + extraAddress + ")";
      }
    } else {
      defaultAddress = data.jibunAddress;
    }
    setPostalCode(postalCode);
    setDefaultAddress(defaultAddress);
    setExtraAddress(extraAddress);

    handleCloseDaumPostCodeModal();
  };

  useEffect(() => {
    if (showDaumPostCodeModal) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showDaumPostCodeModal]);

  return (
    <Modal
      backdrop="static"
      show={showDaumPostCodeModal}
      onHide={handleCloseDaumPostCodeModal}
      onExited={() => {
        requestAnimationFrame(() => {
          setDetailAddress("");
          detailAddressRef.current?.focus();
        });
      }}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>{"카카오 우편번호 서비스"}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: 0, overflow: "visible" }}>
        {isLoading ? (
          <Loader />
        ) : (
          <div style={{ width: "100%" }}>
            <DaumPostcodeEmbed
              onComplete={handleComplete}
              autoClose={false}
              style={{ width: "100%", height: "450px" }}
            />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" type="button" onClick={handleCloseDaumPostCodeModal}>
          {"닫기"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
