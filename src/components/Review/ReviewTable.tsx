import { Badge, Center, Flex, Table, Rating, Modal } from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconMessage,
  IconSelector,
  IconTrashX,
} from "@tabler/icons-react";
import { deleteModal } from "../../utils/deleteModal";
import { ReviewListItem } from "./type";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import ReviewForm from "./ReviewForm";
import ReplyReviewForm from "./ReplyReviewForm";

const ReviewTable: React.FC<{
  startIndex: number | undefined;
  //   handleEdit: (Id: number) => void;
  //   handleView: (Id: number) => void;
  handleFetchReview: () => void;
  handleDelete: (Id: number) => void;
  data: ReviewListItem[] | undefined;
  handleSortData: (
    sortBy: "customerName" | "productName" | "rating" | "createdTime" | null
  ) => void;
  order: "asc" | "desc" | null;
  sortBy: "customerName" | "productName" | "rating" | "createdTime" | null;
}> = ({
  data,
  startIndex,
  handleFetchReview,
  handleDelete,
  handleSortData,
  order,
  sortBy,
}) => {
  const [reviewItem, setReviewItem] = useState<ReviewListItem>();
  const [isView, setIsView] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const handleView = (element: ReviewListItem) => {
    setReviewItem(element);
    open();
  };
  const handleSuccesSubmitAddReply = () => {
    handleFetchReview();
    close();
  };
  const handleFailSubmitAddReply = () => {
    close();
  };
  const rows = (data || []).map((element, index) => (
    <tr
      key={element.id}
      onClick={() => {
        handleView(element);
        setIsView(true);
      }}
    >
      <td>{startIndex !== undefined ? startIndex + index + 1 : ""}</td>
      <td>{element.product.name}</td>
      <td>{element.customerName}</td>
      <td>
        <Rating readOnly defaultValue={element.rating} />
        <br />
        {element.content}
      </td>
      <td>{element.createdTime}</td>
      <td>
        {element.repliedReview ? (
          <Badge color="green">Đã phản hồi</Badge>
        ) : (
          <Badge color="red">Chưa phản hồi</Badge>
        )}
      </td>
      <td>
        <Center>
          {!element.repliedReview && (
            <IconMessage
              className="edit-button"
              strokeWidth="1.8"
              size="22px"
              onClick={(event) => {
                event.stopPropagation();
                setIsView(false);
                handleView(element);
              }}
            />
          )}
          <IconTrashX
            className="delete-button"
            strokeWidth="1.8"
            size="22px"
            onClick={(event) => {
              event.stopPropagation();
              deleteModal("sản phẩm", "đánh giá này", () =>
                handleDelete(element.id)
              );
            }}
          />
        </Center>
      </td>
    </tr>
  ));

  return (
    <>
      <Table
        horizontalSpacing="xl"
        striped
        highlightOnHover
        withBorder
        styles={() => ({
          ".mantine-Table-th": {
            padding: "0px 0px",
          },
        })}
        className="listTable"
      >
        <thead>
          <tr>
            <th>STT</th>
            <th>
              <Flex justify="space-between">
                Sản phẩm
                <Center>
                  {sortBy !== "productName" ? (
                    <IconSelector
                      size="1rem"
                      onClick={() => {
                        handleSortData("productName");
                      }}
                    />
                  ) : order === "asc" ? (
                    <IconChevronUp
                      size="1rem"
                      onClick={() => handleSortData("productName")}
                    />
                  ) : (
                    <IconChevronDown
                      size="1rem"
                      onClick={() => handleSortData("productName")}
                    />
                  )}
                </Center>
              </Flex>
            </th>
            <th>
              <Flex justify="space-between">
                Người đánh giá
                <Center>
                  {sortBy !== "customerName" ? (
                    <IconSelector
                      size="1rem"
                      onClick={() => handleSortData("customerName")}
                    />
                  ) : order === "asc" ? (
                    <IconChevronUp
                      size="1rem"
                      onClick={() => handleSortData("customerName")}
                    />
                  ) : (
                    <IconChevronDown
                      size="1rem"
                      onClick={() => handleSortData("customerName")}
                    />
                  )}
                </Center>
              </Flex>
            </th>
            <th>
              <Flex justify="space-between">
                Đánh giá
                <Center>
                  {sortBy !== "rating" ? (
                    <IconSelector
                      size="1rem"
                      onClick={() => handleSortData("rating")}
                    />
                  ) : order === "asc" ? (
                    <IconChevronUp
                      size="1rem"
                      onClick={() => handleSortData("rating")}
                    />
                  ) : (
                    <IconChevronDown
                      size="1rem"
                      onClick={() => handleSortData("rating")}
                    />
                  )}
                </Center>
              </Flex>
            </th>
            <th>
              <Flex justify="space-between">
                Thời gian
                <Center>
                  {sortBy !== "createdTime" ? (
                    <IconSelector
                      size="1rem"
                      onClick={() => handleSortData("createdTime")}
                    />
                  ) : order === "asc" ? (
                    <IconChevronUp
                      size="1rem"
                      onClick={() => handleSortData("createdTime")}
                    />
                  ) : (
                    <IconChevronDown
                      size="1rem"
                      onClick={() => handleSortData("createdTime")}
                    />
                  )}
                </Center>
              </Flex>
            </th>
            <th>Tình trạng</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <Modal
        w="max-content"
        opened={opened}
        onClose={close}
        centered
        m="20"
        title={isView ? "Xem đánh giá" : "Phản hồi đánh giá"}
        styles={() => ({
          title: {
            fontWeight: "bold",
          },
        })}
      >
        {isView ? (
          <ReviewForm reviewDetail={reviewItem} />
        ) : (
          <ReplyReviewForm
            onSuccessSubmitAdd={handleSuccesSubmitAddReply}
            onFailSubmitAdd={handleFailSubmitAddReply}
            id={reviewItem?.id}
            reviewDetail={reviewItem}
          />
        )}
      </Modal>
    </>
  );
};

export default ReviewTable;
