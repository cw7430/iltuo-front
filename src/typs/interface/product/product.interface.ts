export default interface Product {
  productId: number;
  minerCategoryId: number;
  productCode: string;
  productName: string;
  productComments: string | null;
  price: number;
  discountedRate: number;
  recommended: boolean;
  registerDate: Date;
  valid: boolean;
}
