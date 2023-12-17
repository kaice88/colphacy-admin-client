import { Review, ReviewListItem } from "./type";
import ReviewForm from "./ReviewForm";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, Center, Textarea } from "@mantine/core";
import useReview from "../../hooks/useReview";
import { handleGlobalException } from "../../utils/error";
import { notificationShow } from "../Notification";
import { ErrorObject } from "../../types/error";

const ReplyReviewForm: React.FC<{
  reviewDetail: ReviewListItem;
  id: number;
  onSuccessSubmitAdd: () => void;
  onFailSubmitAdd: () => void;
}> = ({ reviewDetail, id, onSuccessSubmitAdd }) => {
  const {
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      reviewId: id,
      content: "",
    },
  });
  const { onSubmitAddReviewForm } = useReview();
  const onSubmit: SubmitHandler<Review> = (data) => {
    onSubmitAddReviewForm(
      data,
      () => {
        notificationShow(
          "success",
          "Success!",
          "Thêm bình luận đánh giá thành công!"
        );
        onSuccessSubmitAdd();
      },
      (error) => {
        const newError = error as ErrorObject;
        handleGlobalException(newError, () => {
          setError("content", {
            type: "manual",
            message: newError.response.data.content,
          });
        });
      }
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ReviewForm reviewDetail={reviewDetail} />
        <Controller
          name="content"
          control={control}
          rules={{ required: "Vui lòng nhập nội dung trả lời đánh giá" }}
          render={({ field }) => (
            <Textarea
              {...field}
              w="100%"
              placeholder="Nhập nội dung trả lời đánh giá"
              error={errors.content ? errors.content.message : false}
              radius="md"
            />
          )}
        ></Controller>
        <Center>
          <Button
            fullWidth
            radius="4px"
            mt={20}
            mb={10}
            styles={(theme) => ({
              root: {
                backgroundColor: theme.colors.munsellBlue[0],
                ...theme.fn.hover({
                  backgroundColor: theme.fn.darken(
                    theme.colors.munsellBlue[0],
                    0.1
                  ),
                }),
              },
            })}
            type="submit"
          >
            Gửi
          </Button>
        </Center>
      </form>
    </>
  );
};

export default ReplyReviewForm;
