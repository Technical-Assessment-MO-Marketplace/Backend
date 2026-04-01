import { ProductService } from '../services/product.service';
import { VariantService } from '../services/variant.service';
import { CreateProductDto, CreateVariantDto } from '../dto';
export declare class ProductsController {
    private productService;
    private variantService;
    private readonly logger;
    constructor(productService: ProductService, variantService: VariantService);
    createProduct(createProductDto: CreateProductDto, req: any): Promise<{
        id: number;
        name: string;
        description: string;
        created_by: number;
        message: string;
    }>;
    updateProduct(id: number, updateData: Partial<CreateProductDto>): Promise<{
        id: number;
        name: string;
        description: string;
        message: string;
    }>;
    deleteProduct(id: number): Promise<{
        message: string;
    }>;
    createVariant(createVariantDto: CreateVariantDto): Promise<{
        id: any;
        product_id: any;
        combination_key: any;
        price: any;
        stock: any;
        message: string;
    }>;
    updateVariantStock(id: number, updateData: {
        stock: number;
    }): Promise<{
        id: any;
        stock: any;
        message: string;
    }>;
    deleteVariant(id: number): Promise<{
        message: string;
    }>;
}
