import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";

interface Props<T> {
  data: T[];
  itemsPerPage: number;
  pageBlockSize: number;
  setPagedData: Dispatch<SetStateAction<T[]>>;
}

export default function CustomPagination<T>(props: Props<T>) {
  const { data, itemsPerPage, pageBlockSize, setPagedData } = props;

  const [page, setPage] = useState<number>(1);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // 현재 페이지 데이터 설정
  useEffect(() => {
    const currentPageData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    setPagedData(currentPageData);
  }, [data, itemsPerPage, page, setPagedData]);

  // 페이지 블록의 시작과 끝 계산
  const currentBlock = Math.ceil(page / pageBlockSize);
  const startPage = (currentBlock - 1) * pageBlockSize + 1;
  const endPage = Math.min(startPage + pageBlockSize - 1, totalPages);

  // 첫 블록과 마지막 블록인지 판단
  const isFirstBlock = currentBlock === 1;
  const isLastBlock = endPage === totalPages;

  // 데이터가 변경되면 첫 페이지로 이동
  useEffect(() => {
    setPage(1);
  }, [data]);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      {/* 첫 페이지가 아니면 First 블록 버튼 활성화 */}
      {page !== 1 && <Pagination.First onClick={() => setPage(1)} />}
      {/* 첫 블록이 아니면 Prev 블록 버튼 활성화 */}
      {!isFirstBlock && <Pagination.Prev onClick={() => setPage(startPage - 1)} />}
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
        <Pagination.Item
          key={startPage + i}
          active={page === startPage + i}
          onClick={() => setPage(startPage + i)}
        >
          {startPage + i}
        </Pagination.Item>
      ))}
      {/* 마지막 블록이 아니면 Next 블록 버튼 활성화 */}
      {!isLastBlock && <Pagination.Next onClick={() => setPage(endPage + 1)} />}
      {/* 마지막 페이지가 아니면 Last 블록 버튼 활성화 */}
      {page !== totalPages && <Pagination.Last onClick={() => setPage(totalPages)} />}
    </Pagination>
  );
}
