import { ProductService } from '../services/product.service';
import { VariantService } from '../services/variant.service';
export declare class ProductsPublicController {
    private productService;
    private variantService;
    private readonly logger;
    constructor(productService: ProductService, variantService: VariantService);
    getAllProducts(): Promise<{
        products: import("../entities").Product[];
        total: number;
        message: string;
    }>;
    getProductVariants(productId: number): Promise<{
        productId: number;
        variants: any[];
        total: number;
        message: string;
    }>;
}
