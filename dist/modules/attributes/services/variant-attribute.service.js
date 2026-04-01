"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var VariantAttributeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariantAttributeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const variant_attribute_entity_1 = require("../../variants/entities/variant-attribute.entity");
const attribute_value_entity_1 = require("../entities/attribute-value.entity");
const variant_entity_1 = require("../../variants/entities/variant.entity");
let VariantAttributeService = VariantAttributeService_1 = class VariantAttributeService {
    dataSource;
    variantAttributeRepository;
    attributeValueRepository;
    variantRepository;
    logger = new common_1.Logger(VariantAttributeService_1.name);
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.variantAttributeRepository =
            this.dataSource.getRepository(variant_attribute_entity_1.VariantAttribute);
        this.attributeValueRepository =
            this.dataSource.getRepository(attribute_value_entity_1.AttributeValue);
        this.variantRepository = this.dataSource.getRepository(variant_entity_1.Variant);
    }
    async create(createVariantAttributeDto) {
        try {
            const { variant_id, attribute_value_id } = createVariantAttributeDto;
            const variant = await this.variantRepository.findOne({
                where: { id: variant_id },
            });
            if (!variant) {
                throw new common_1.NotFoundException(`Variant with id ${variant_id} not found`);
            }
            const attributeValue = await this.attributeValueRepository.findOne({
                where: { id: attribute_value_id },
            });
            if (!attributeValue) {
                throw new common_1.NotFoundException(`Attribute value with id ${attribute_value_id} not found`);
            }
            const existing = await this.variantAttributeRepository.findOne({
                where: { variant_id, attribute_value_id },
            });
            if (existing) {
                throw new common_1.BadRequestException('This variant-attribute combination already exists');
            }
            const variantAttribute = this.variantAttributeRepository.create({
                variant_id,
                attribute_value_id,
            });
            const saved = await this.variantAttributeRepository.save(variantAttribute);
            this.logger.log(`Variant attribute created for variant ${variant_id}`);
            return saved;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Failed to create variant attribute: ${error.message}`);
            throw new common_1.InternalServerErrorException('Failed to create variant attribute');
        }
    }
    async findByVariant(variant_id) {
        try {
            const attributes = await this.variantAttributeRepository.find({
                where: { variant_id },
                relations: ['attributeValue', 'attributeValue.attribute'],
            });
            return attributes;
        }
        catch (error) {
            this.logger.error(`Failed to fetch variant attributes: ${error.message}`);
            throw new common_1.InternalServerErrorException('Failed to fetch variant attributes');
        }
    }
    async findAll() {
        try {
            const attributes = await this.variantAttributeRepository.find({
                relations: ['variant', 'attributeValue', 'attributeValue.attribute'],
            });
            return attributes;
        }
        catch (error) {
            this.logger.error(`Failed to fetch variant attributes: ${error.message}`);
            throw new common_1.InternalServerErrorException('Failed to fetch variant attributes');
        }
    }
};
exports.VariantAttributeService = VariantAttributeService;
exports.VariantAttributeService = VariantAttributeService = VariantAttributeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], VariantAttributeService);
//# sourceMappingURL=variant-attribute.service.js.map