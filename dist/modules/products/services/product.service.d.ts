import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto';
export declare class ProductService {
    private productRepository;
    private readonly logger;
    constructor(productRepository: Repository<Product>);
    create(createProductDto: CreateProductDto, userId: number): Promise<Product>;
    findAll(): Promise<Product[]>;
    findOne(id: number): Promise<Product>;
    update(id: number, updateData: Partial<CreateProductDto>): Promise<Product>;
    remove(id: number): Promise<void>;
}
