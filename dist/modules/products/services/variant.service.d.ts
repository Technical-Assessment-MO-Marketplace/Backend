import { Repository } from 'typeorm';
import { Variant } from '../entities/variant.entity';
import { Product } from '../entities/product.entity';
export declare class VariantService {
    private variantRepository;
    private productRepository;
    private readonly logger;
    constructor(variantRepository: Repository<Variant>, productRepository: Repository<Product>);
    createVariant(createVariantDto: any): Promise<any>;
    findAllVariants(productId?: number): Promise<any[]>;
    findOne(id: number): Promise<any>;
    updateStock(id: number, newStock: number): Promise<any>;
    deleteVariant(id: number): Promise<void>;
}
