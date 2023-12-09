export interface ReviewListItem {
  id: number;
  product: Product;
  rating: number;
  content: string;
  customerId: number;
  customerName?: string;
  createdTime: string;
  repliedReview: RepliedReview;
}

export interface Product {
  id: number;
  name: string;
  image: string;
}

export interface RepliedReview {
  id: number;
  content: string;
  createdTime: string;
  employeeId: number;
  employeeName?: string;
}

export interface Review {
  reviewId: number;
  content: string;
}
