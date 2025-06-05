import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { DaumPostCodeModal, ConfirmModal, AlertModal } from "../../Modals";
import { Loader } from "../../Gif";
import { fetchAddAddress } from "../../../apis/server/Auth";
import { AddressRequestDto } from "../../../apis/dto/request/Auth";
import { ApiError } from "../../../apis/server";
import { logoutUser } from "../../../utils/auth";

interface Props {
  setShowAddressForm: Dispatch<SetStateAction<boolean>>;
  updateData: () => Promise<void>;
}

export default function AddressFormCard(props: Props) {
  const { setShowAddressForm, updateData } = props;

  const detailAddressRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [postalCode, setPostalCode] = useState<string>("");
  const [defaultAddress, setDefaultAddress] = useState<string>("");
  const [detailAddress, setDetailAddress] = useState<string>("");
  const [extraAddress, setExtraAddress] = useState<string>("");
  const [main, setMain] = useState<boolean>(false);
  const [isAddressError, setIsAddressError] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const requestBody: AddressRequestDto = {
    postalCode: postalCode,
    defaultAddress: defaultAddress,
    detailAddress: detailAddress,
    extraAddress: extraAddress,
    main: main,
  };

  const [showDaumPostCodeModal, setShowDaumPostCodeModal] = useState<boolean>(false);

  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertText, setAlertText] = useState<string>("");

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const handelShowDaumPostCodeModal = () => setShowDaumPostCodeModal(true);

  const handleCloseDaumPostCodeModal = () => setShowDaumPostCodeModal(false);

  const handleShowAlertModal = (title: string, text: string) => {
    setAlertTitle(title);
    setAlertText(text);
    setShowAlertModal(true);
  };

  const handleCloseAlertModal = () => setShowAlertModal(false);

  const handleShowConfirmModal = () => setShowConfirmModal(true);

  const handleCloseConfirmModal = () => setShowConfirmModal(false);

  const handleValidate = () => {
    if (!postalCode.trim() || !defaultAddress.trim()) {
      setIsAddressError(true);
      return;
    }
    setIsAddressError(false);
    handleShowConfirmModal();
  };

  const handleAddAddress = async () => {
    handleCloseConfirmModal();
    setLoading(true);
    try {
      const response = await fetchAddAddress(requestBody);
      if (response) {
        handleShowAlertModal("완료", "주소가 등록되었습니다.");
        await updateData();
        setShowAddressForm(false);
      }
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.code === "VE") {
          setIsAddressError(true);
        }
        if (e.code === "UA") {
          handleShowAlertModal("세션만료", "세션이 만료되었습니다. 로그아웃합니다.");
          logoutUser();
        } else {
          setIsError(true);
          setErrorMessage("서버 오류입니다. 나중에 다시 시도하세요.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postalCode.trim()) setIsAddressError(false);
  }, [postalCode]);

  return (
    <>
      <Card>
        <Card.Header>
          <h5 className="mb-0">{"주소등록"}</h5>
        </Card.Header>
        <Card.Body>
          <Row className="mb-2">
            <Col style={{ maxWidth: "200px" }}>
              <InputGroup>
                <Form.Control
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="우편번호"
                  isInvalid={isAddressError}
                  readOnly={true}
                />
              </InputGroup>
            </Col>
            <Col xs="auto">
              <Button variant="secondary" type="button" onClick={handelShowDaumPostCodeModal}>
                {"주소 검색"}
              </Button>
            </Col>
          </Row>
          <Form.Group className="mb-2">
            <InputGroup>
              <Form.Control
                type="text"
                value={defaultAddress}
                onChange={(e) => setDefaultAddress(e.target.value)}
                placeholder="주소"
                isInvalid={isAddressError}
                readOnly={true}
              />
              <Form.Control.Feedback type="invalid">
                {"주소를 입력하여주세요"}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Row className="mb-2">
            <Form.Group as={Col}>
              <InputGroup>
                <Form.Control
                  type="text"
                  ref={detailAddressRef}
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                  placeholder="상세 주소"
                />
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col}>
              <InputGroup>
                <Form.Control
                  type="text"
                  value={extraAddress}
                  onChange={(e) => setExtraAddress(e.target.value)}
                  placeholder="참고 항목"
                  readOnly={true}
                />
              </InputGroup>
            </Form.Group>
          </Row>
          <Form.Check
            type="checkbox"
            label="메인 주소로 설정"
            className="mb-2"
            checked={main}
            onChange={(e) => setMain(e.target.checked)}
          />
          <Form.Group className="mb-3">
            {isError && (
              <div className="invalid-feedback" style={{ display: "block" }}>
                {errorMessage}
              </div>
            )}
          </Form.Group>
        </Card.Body>
        <Card.Footer className="text-end">
          <Button variant="success" type="button" onClick={handleValidate}>
            {"등록"}
          </Button>
        </Card.Footer>
      </Card>
      <DaumPostCodeModal
        showDaumPostCodeModal={showDaumPostCodeModal}
        handleCloseDaumPostCodeModal={handleCloseDaumPostCodeModal}
        setPostalCode={setPostalCode}
        setDefaultAddress={setDefaultAddress}
        setDetailAddress={setDetailAddress}
        setExtraAddress={setExtraAddress}
        detailAddressRef={detailAddressRef}
      />
      <AlertModal
        showAlertModal={showAlertModal}
        handleCloseAlertModal={handleCloseAlertModal}
        handleAfterAlert={handleCloseAlertModal}
        alertTitle={alertTitle}
        alertText={alertText}
      />
      <ConfirmModal
        confirmTitle="확인"
        confirmText="주소를 등록 하시겠습니까?"
        showConfirmModal={showConfirmModal}
        handleCloseConfirmModal={handleCloseConfirmModal}
        handleConfirm={handleAddAddress}
      />
      {loading && <Loader />}
    </>
  );
}
