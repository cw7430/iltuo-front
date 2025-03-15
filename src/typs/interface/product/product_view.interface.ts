export default interface ProductView {
    productId: number;
    majorCategoryId: number;
    minerCategoryId: number;
    productCode: string;
    productName: string;
    productComments: string | null;
    price: number;
    isDiscounted: boolean;
    discountedRate: number;
    hasOption: boolean;
    isRecommendated: boolean;
    regisertDate: string;
    isVaild: boolean;
}