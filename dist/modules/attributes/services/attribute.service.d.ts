import { DataSource } from 'typeorm';
import { Attribute } from '../entities/attribute.entity';
import { CreateAttributeDto } from '../dto/create-attribute.dto';
export declare class AttributeService {
    private dataSource;
    private attributeRepository;
    private readonly logger;
    constructor(dataSource: DataSource);
    create(createAttributeDto: CreateAttributeDto): Promise<Attribute>;
    findAll(): Promise<Attribute[]>;
    findById(id: number): Promise<Attribute>;
}
