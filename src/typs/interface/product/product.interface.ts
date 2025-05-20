export default interface Product {
    productId: number;
    minerCategoryId: number;
    productCode: string;
    productName: string;
    productComments: string | null;
    price: number;
    discountedRate: number;
    isRecommended: boolean;
    registerDate: string;
    valid: boolean;
}