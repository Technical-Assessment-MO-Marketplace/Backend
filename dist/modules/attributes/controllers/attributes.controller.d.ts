import { AttributeService } from '../services/attribute.service';
import { AttributeValueService } from '../services/attribute-value.service';
import { VariantAttributeService } from '../services/variant-attribute.service';
import { CreateAttributeDto, CreateAttributeValueDto, CreateVariantAttributeDto } from '../dto';
export declare class AttributesController {
    private attributeService;
    private attributeValueService;
    private variantAttributeService;
    private readonly logger;
    constructor(attributeService: AttributeService, attributeValueService: AttributeValueService, variantAttributeService: VariantAttributeService);
    createAttribute(createAttributeDto: CreateAttributeDto): Promise<{
        id: number;
        name: string;
        message: string;
    }>;
    getAllAttributes(): Promise<{
        attributes: import("../entities").Attribute[];
        total: number;
    }>;
    createAttributeValue(createAttributeValueDto: CreateAttributeValueDto): Promise<{
        id: number;
        attribute_id: number;
        value: string;
        message: string;
    }>;
    getAllAttributeValues(): Promise<{
        values: import("../entities").AttributeValue[];
        total: number;
    }>;
    getAttributeValues(id: number): Promise<{
        values: import("../entities").AttributeValue[];
        total: number;
    }>;
    createVariantAttribute(createVariantAttributeDto: CreateVariantAttributeDto): Promise<{
        id: number;
        variant_id: number;
        attribute_value_id: number;
        message: string;
    }>;
    getAllVariantAttributes(): Promise<{
        variantAttributes: import("../../variants/entities").VariantAttribute[];
        total: number;
    }>;
    getVariantAttributes(id: number): Promise<{
        attributes: import("../../variants/entities").VariantAttribute[];
        total: number;
    }>;
}
