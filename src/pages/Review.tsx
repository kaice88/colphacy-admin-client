import {
  Flex,
  Pagination,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useRef, useState } from "react";
import ReviewTable from "../components/Review/ReviewTable";
import useReview from "../hooks/useReview";
import { notificationShow } from "../components/Notification";

const LIMIT = 10;

export default function Review() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [keyword, setKeyWord] = useState<string>("");
  const [sortBy, setSortBy] = useState<
    "customerName" | "productName" | "rating" | "createdTime" | null
  >(null);
  const [order, setOrder] = useState<"desc" | "asc" | null>(null);
  const theme = useMantineTheme();
  const { reviewData, loading, onSubmitDeleteReviewForm, fetchReview } =
    useReview((currentPage - 1) * LIMIT, keyword, sortBy, order);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.trim();
    setKeyWord(keyword);
    setCurrentPage(1);
  };
  const handleFetchReview = () => {
    fetchReview.refetch();
  };

  const handleDelete = (Id: number) => {
    onSubmitDeleteReviewForm(Id, () => {
      notificationShow("success", "Success!", "Xóa đánh giá thành công!");
      fetchReview.refetch();
    });
  };

  const handleSortData = (
    sortBy: "customerName" | "productName" | "rating" | "createdTime" | null
  ) => {
    if (order !== "asc") {
      setSortBy(sortBy);
    } else {
      setSortBy(null);
    }
    setOrder((prev) =>
      prev === "desc" ? "asc" : prev === "asc" ? null : "desc"
    );
  };
  console.log("reviewData", reviewData);
  return (
    <div className="branch-ctn">
      <Title size="h5" color={theme.colors.cobaltBlue[0]}>
        Danh sách đánh giá
      </Title>
      <Flex justify="space-between" align="center" py="lg">
        <div className="search">
          <input
            ref={inputRef}
            value={keyword}
            placeholder="Tìm kiếm..."
            spellCheck={false}
            onChange={handleChange}
          />
          <button
            className="search-btn"
            onMouseDown={(e) => e.preventDefault()}
          >
            <IconSearch size="1.3rem"></IconSearch>
          </button>
        </div>
      </Flex>
      <div className="branch-table">
        <ReviewTable
          handleFetchReview={handleFetchReview}
          data={reviewData?.items}
          startIndex={reviewData?.offset}
          handleDelete={handleDelete}
          handleSortData={handleSortData}
          sortBy={sortBy}
          order={order}
        />
      </div>
      {!loading && reviewData && (
        <Flex justify="space-between" align="center" py="lg">
          <div>
            {reviewData?.totalItems === 0 ? (
              <div>Không tìm thấy kết quả nào.</div>
            ) : reviewData?.totalItems === 1 ? (
              <div>Tìm thấy 1 kết quả.</div>
            ) : (
              <div>
                Hiển thị {reviewData?.items.length} kết quả từ{" "}
                {reviewData?.offset + 1} -{" "}
                {reviewData?.offset + reviewData?.items.length} trong tổng{" "}
                {reviewData?.totalItems} kết quả
              </div>
            )}
          </div>
          <Pagination
            value={currentPage}
            total={reviewData?.numPages}
            onChange={setCurrentPage}
            position="center"
            styles={(theme) => ({
              control: {
                "&[data-active]": {
                  backgroundColor: theme.colors.munsellBlue[0],
                  border: 0,
                },
              },
            })}
          />
        </Flex>
      )}
    </div>
  );
}
