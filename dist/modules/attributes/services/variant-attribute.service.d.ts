import { DataSource } from 'typeorm';
import { VariantAttribute } from '../../variants/entities/variant-attribute.entity';
import { CreateVariantAttributeDto } from '../dto/create-variant-attribute.dto';
export declare class VariantAttributeService {
    private dataSource;
    private variantAttributeRepository;
    private attributeValueRepository;
    private variantRepository;
    private readonly logger;
    constructor(dataSource: DataSource);
    create(createVariantAttributeDto: CreateVariantAttributeDto): Promise<VariantAttribute>;
    findByVariant(variant_id: number): Promise<VariantAttribute[]>;
    findAll(): Promise<VariantAttribute[]>;
}
