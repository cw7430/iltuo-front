export default interface Product {
    productId: number;
    minerCategoryId: number;
    productCode: string;
    productName: string;
    productComments: string | null;
    price: number;
    discountedRate: number;
    isRecommendated: boolean;
    regisertDate: string;
    isVaild: boolean;
}