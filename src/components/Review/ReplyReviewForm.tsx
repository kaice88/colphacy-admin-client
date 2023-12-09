import { Review, ReviewListItem } from "./type";
import ReviewForm from "./ReviewForm";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, Textarea } from "@mantine/core";
import useReview from "../../hooks/useReview";
import { handleGlobalException } from "../../utils/error";
import { notificationShow } from "../Notification";
import { ErrorObject } from "../../types/error";

const ReplyReviewForm: React.FC<{
  reviewDetail: ReviewListItem;
  id: number;
  onSuccessSubmitAdd: () => void;
  onFailSubmitAdd: () => void;
}> = ({ reviewDetail, id, onSuccessSubmitAdd, onFailSubmitAdd }) => {
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
          if (newError.response.status === 400) {
            const data = newError.response.data;
            Object.keys(data).forEach((key) => {
              notificationShow("error", "Error!", data[key]);
              onFailSubmitAdd();
            });
          }
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
          rules={{ required: false }}
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
        <Button
          radius="xl"
          fullWidth
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
      </form>
    </>
  );
};

export default ReplyReviewForm;
