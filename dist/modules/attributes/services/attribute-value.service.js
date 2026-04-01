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
var AttributeValueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeValueService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const attribute_value_entity_1 = require("../entities/attribute-value.entity");
const attribute_entity_1 = require("../entities/attribute.entity");
let AttributeValueService = AttributeValueService_1 = class AttributeValueService {
    dataSource;
    attributeValueRepository;
    attributeRepository;
    logger = new common_1.Logger(AttributeValueService_1.name);
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.attributeValueRepository =
            this.dataSource.getRepository(attribute_value_entity_1.AttributeValue);
        this.attributeRepository = this.dataSource.getRepository(attribute_entity_1.Attribute);
    }
    async create(createAttributeValueDto) {
        try {
            const { attribute_id, value } = createAttributeValueDto;
            const attribute = await this.attributeRepository.findOne({
                where: { id: attribute_id },
            });
            if (!attribute) {
                throw new common_1.NotFoundException(`Attribute with id ${attribute_id} not found`);
            }
            const existingValue = await this.attributeValueRepository.findOne({
                where: { attribute_id, value },
            });
            if (existingValue) {
                throw new common_1.BadRequestException(`Value "${value}" already exists for this attribute`);
            }
            const attributeValue = this.attributeValueRepository.create({
                attribute_id,
                value,
            });
            const savedValue = await this.attributeValueRepository.save(attributeValue);
            this.logger.log(`Attribute value created: ${value} for attribute ${attribute_id}`);
            return savedValue;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Failed to create attribute value: ${error.message}`);
            throw new common_1.InternalServerErrorException('Failed to create attribute value');
        }
    }
    async findByAttribute(attribute_id) {
        try {
            const values = await this.attributeValueRepository.find({
                where: { attribute_id },
            });
            return values;
        }
        catch (error) {
            this.logger.error(`Failed to fetch attribute values: ${error.message}`);
            throw new common_1.InternalServerErrorException('Failed to fetch attribute values');
        }
    }
    async findAll() {
        try {
            const values = await this.attributeValueRepository.find({
                relations: ['attribute'],
            });
            return values;
        }
        catch (error) {
            this.logger.error(`Failed to fetch attribute values: ${error.message}`);
            throw new common_1.InternalServerErrorException('Failed to fetch attribute values');
        }
    }
};
exports.AttributeValueService = AttributeValueService;
exports.AttributeValueService = AttributeValueService = AttributeValueService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AttributeValueService);
//# sourceMappingURL=attribute-value.service.js.map