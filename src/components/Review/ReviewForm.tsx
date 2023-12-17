import { Container, Flex, Grid, Image, Rating, Text } from "@mantine/core";
import { ReviewListItem } from "./type";
import adminAva from "../../assets/images/adminAva.png";
import userAva from "../../assets/images/userAva.png";
import { convertDateTime } from "../../utils/helper";
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
      gap={30}
      my={20}
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
        <Text w={450}>{reviewDetail?.product?.name}</Text>
      </Flex>
      <Container m={0} p={0}>
        <ReviewItem
          name={reviewDetail?.customerName}
          ava={userAva}
          item={reviewDetail}
        />
        {reviewDetail?.repliedReview && (
          <Container m={10} pt={10} pl="3rem">
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
