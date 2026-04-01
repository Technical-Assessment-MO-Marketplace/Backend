import { DataSource } from 'typeorm';
import { AttributeValue } from '../entities/attribute-value.entity';
import { CreateAttributeValueDto } from '../dto/create-attribute-value.dto';
export declare class AttributeValueService {
    private dataSource;
    private attributeValueRepository;
    private attributeRepository;
    private readonly logger;
    constructor(dataSource: DataSource);
    create(createAttributeValueDto: CreateAttributeValueDto): Promise<AttributeValue>;
    findByAttribute(attribute_id: number): Promise<AttributeValue[]>;
    findAll(): Promise<AttributeValue[]>;
}
