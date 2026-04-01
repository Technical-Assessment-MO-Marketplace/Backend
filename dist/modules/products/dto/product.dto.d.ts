export declare class CreateProductDto {
    name: string;
    description?: string;
}
export declare class VariantDataDto {
    price: number;
    stock: number;
    attributeValueIds: number[];
}
export declare class CreateVariantDto {
    product_id: number;
    price: number;
    stock: number;
    attributeValueIds: number[];
}
