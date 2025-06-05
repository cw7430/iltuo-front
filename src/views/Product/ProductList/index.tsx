import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMajorCategoryStore } from "../../../stores";
import { Container, Row, Col, Button, Nav } from "react-bootstrap";
import { MinerCategoryResponseDto, ProductResponseDto } from "../../../apis/dto/response/Products";
import { fetchMinerCategoryList, fetchProductList } from "../../../apis/server/Products";
import { Loader } from "../../../components/Gif";
import { ProductCard } from "../../../components/Cards";
import CustomPagination from "../../../components/CustomPagination";
import { sortDate, sortNumber } from "../../../utils/sort";
import { MAIN_PATH } from "../../../constants/url";
import { AlertModal } from "../../../components/Modals";

export default function ProductList() {
  const navigate = useNavigate();

  const { majorCategoryId } = useParams<{ majorCategoryId: string }>();
  const majorCategoryList = useMajorCategoryStore((state) => state.data);

  const majorCategoryName = majorCategoryList.find(
    (category) => category.majorCategoryId === Number(majorCategoryId)
  )?.majorCategoryName;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [minerCategoryList, setMinerCategoryList] = useState<MinerCategoryResponseDto[]>([]);
  const [productList, setProductList] = useState<ProductResponseDto[]>([]);
  const [pagedProductList, setPagedProductList] = useState<ProductResponseDto[]>([]);
  const [minerCategoryId, setMinerCategoryId] = useState<string>("0");
  const [sortKey, setSortKey] = useState<
    "recommendedAsc" | "registerDateDesc" | "priceAsc" | "priceDesc"
  >("recommendedAsc");

  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertText, setAlertText] = useState<string>("");
  const [alertAction, setAlertAction] = useState<() => void>(() => {});

  const showGenericAlertModal = (title: string, text: string, onAlert: () => void) => {
    setAlertTitle(title);
    setAlertText(text);
    setAlertAction(() => () => {
      onAlert();
      setShowAlertModal(false);
    });
    setShowAlertModal(true);
  };

  const handleCloseAlertModal = () => setShowAlertModal(false);

  const handleAfterAlert = () => alertAction();

  const handleNavigateMainPath = useCallback(() => {
    navigate(MAIN_PATH());
  }, [navigate]);

  const handleChangeMinerCategoryId = (categoryId: string) => {
    setMinerCategoryId(categoryId);
    handleSort("recommendedAsc");
  };

  const handleSort = (key: "recommendedAsc" | "registerDateDesc" | "priceAsc" | "priceDesc") => {
    setSortKey(key);
  };

  useEffect(() => {
    if (majorCategoryId) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const minerCategoryResponse = await fetchMinerCategoryList({
            idx: Number(majorCategoryId),
          });
          const productResponse = await fetchProductList({
            idx: Number(majorCategoryId),
          });
          setMinerCategoryList(minerCategoryResponse);
          setProductList(productResponse);
        } catch (e) {
          showGenericAlertModal("오류", "서버 오류입니다. 나중에 다시 시도하세요.", () => {
            handleNavigateMainPath();
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
    setMinerCategoryId("0");
    setSortKey("recommendedAsc");
  }, [majorCategoryId, handleNavigateMainPath]);

  const filteredAndSortedList = useMemo(() => {
    let filteredList =
      minerCategoryId === "0"
        ? productList
        : productList.filter((product) => String(product.minerCategoryId) === minerCategoryId);

    switch (sortKey) {
      case "registerDateDesc":
        return sortDate(filteredList, "registerDate", "desc");
      case "priceAsc":
        return sortNumber(filteredList, "discountedPrice", "asc");
      case "priceDesc":
        return sortNumber(filteredList, "discountedPrice", "desc");
      case "recommendedAsc":
      default:
        return filteredList;
    }
  }, [productList, minerCategoryId, sortKey]);

  return (
    <>
      <div className="coffee_section layout_padding">
        <Container>
          <Row>
            <Col md={12}>
              <h1 className="coffee_taital">{majorCategoryName || "카테고리 없음"}</h1>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row className="my-3 justify-content-center">
            <Col xs="auto">
              <Button
                variant="outline-secondary"
                active={minerCategoryId === "0"}
                onClick={() => handleChangeMinerCategoryId("0")}
              >
                {"전체"}
              </Button>
            </Col>
            {minerCategoryList.map((item, itemIdx) => (
              <Col xs="auto" key={itemIdx}>
                <Button
                  variant="outline-secondary"
                  active={minerCategoryId === String(item.minerCategoryId)}
                  onClick={() => handleChangeMinerCategoryId(String(item.minerCategoryId))}
                >
                  {item.minerCategoryName}
                </Button>
              </Col>
            ))}
          </Row>
        </Container>
        <div className="coffee_section_2">
          <Container>
            <Row className="my-5 justify-content-end">
              <Col xs="auto" className="d-flex">
                <Nav.Link
                  as="button"
                  disabled={sortKey === "recommendedAsc"}
                  style={{
                    fontWeight: sortKey === "recommendedAsc" ? "bold" : "normal",
                  }}
                  onClick={() => handleSort("recommendedAsc")}
                >
                  {"추천순"}
                </Nav.Link>
              </Col>
              <Col xs="auto" className="d-flex">
                <Nav.Link
                  as="button"
                  disabled={sortKey === "registerDateDesc"}
                  style={{
                    fontWeight: sortKey === "registerDateDesc" ? "bold" : "normal",
                  }}
                  onClick={() => handleSort("registerDateDesc")}
                >
                  {"등록순"}
                </Nav.Link>
              </Col>
              <Col xs="auto" className="d-flex">
                <Nav.Link
                  as="button"
                  disabled={sortKey === "priceAsc"}
                  style={{
                    fontWeight: sortKey === "priceAsc" ? "bold" : "normal",
                  }}
                  onClick={() => handleSort("priceAsc")}
                >
                  {"낮은가격순"}
                </Nav.Link>
              </Col>
              <Col xs="auto" className="d-flex">
                <Nav.Link
                  as="button"
                  disabled={sortKey === "priceDesc"}
                  style={{
                    fontWeight: sortKey === "priceDesc" ? "bold" : "normal",
                  }}
                  onClick={() => handleSort("priceDesc")}
                >
                  {"높은가격순"}
                </Nav.Link>
              </Col>
            </Row>
            <Row className="my-5 d-flex align-items-stretch">
              {pagedProductList.map((item, itemIdx) => (
                <Col lg={3} md={6} className="mb-4 d-flex" key={itemIdx}>
                  <ProductCard product={item} isMainPage={false} />
                </Col>
              ))}
            </Row>
          </Container>
          <Container>
            <Row className="my-5 justify-content-center">
              <Col xs="auto">
                <CustomPagination
                  data={filteredAndSortedList}
                  itemsPerPage={4}
                  pageBlockSize={5}
                  setPagedData={setPagedProductList}
                />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
      <AlertModal
        showAlertModal={showAlertModal}
        alertTitle={alertTitle}
        alertText={alertText}
        handleAfterAlert={handleAfterAlert}
        handleCloseAlertModal={handleCloseAlertModal}
      />
      {isLoading && <Loader />}
    </>
  );
}
