import { Container, Flex, Grid, Image, Rating, Text } from "@mantine/core";
import { ReviewListItem } from "./type";
import adminAva from "../../assets/images/adminAva.png";
import userAva from "../../assets/images/userAva.png";
function convertDateTime(dateTimeStr: string) {
  const date = new Date(dateTimeStr);
  const formattedDate = `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")} ${date
    .getDate()
    .toString()
    .padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;

  return formattedDate;
}
const ReviewItem: React.FC<{
  item: ReviewListItem;
  ava: string;
  name: string;
}> = ({ item, ava, name }) => {
  return (
    <Grid>
      <Grid.Col span="content">
        <Image width={44} src={ava} />
      </Grid.Col>
      <Grid.Col span="auto">
        <Flex
          gap={5}
          justify="center"
          align="flex-start"
          direction="column"
          wrap="wrap"
        >
          <Text fz={14} fw={500} className="review-name">
            {name}
          </Text>
          {item?.rating && (
            <Text>
              <Rating readOnly defaultValue={item?.rating} />
            </Text>
          )}
          <Text fz={14} fw={400} className="review-content">
            {item?.content}
          </Text>
          <Text fz={12} fw={400} className="review-time">
            {convertDateTime(item?.createdTime)}
          </Text>
        </Flex>
      </Grid.Col>
    </Grid>
  );
};

const ReviewForm: React.FC<{
  reviewDetail: ReviewListItem;
}> = ({ reviewDetail }) => {
  return (
    <Flex
      gap="lg"
      justify="center"
      align="flex-start"
      direction="column"
      wrap="wrap"
    >
      <Flex
        gap="lg"
        justify="flex-start"
        align="center"
        direction="row"
        wrap="wrap"
      >
        <Image width={50} src={reviewDetail?.product?.image} />
        <Text>{reviewDetail?.product?.name}</Text>
      </Flex>
      <Container m={0} px={0} py={20}>
        <ReviewItem
          name={reviewDetail?.customerName}
          ava={userAva}
          item={reviewDetail}
        />
        {reviewDetail?.repliedReview && (
          <Container m={10} py={10} pl="3rem">
            <ReviewItem
              ava={adminAva}
              name={reviewDetail?.repliedReview?.employeeName}
              item={reviewDetail?.repliedReview}
            />
          </Container>
        )}
      </Container>
    </Flex>
  );
};

export default ReviewForm;
