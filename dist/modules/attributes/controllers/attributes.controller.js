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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AttributesController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributesController = void 0;
const common_1 = require("@nestjs/common");
const attribute_service_1 = require("../services/attribute.service");
const attribute_value_service_1 = require("../services/attribute-value.service");
const variant_attribute_service_1 = require("../services/variant-attribute.service");
const dto_1 = require("../dto");
const jwt_guard_1 = require("../../auth/guards/jwt.guard");
const admin_guard_1 = require("../../auth/guards/admin.guard");
let AttributesController = AttributesController_1 = class AttributesController {
    attributeService;
    attributeValueService;
    variantAttributeService;
    logger = new common_1.Logger(AttributesController_1.name);
    constructor(attributeService, attributeValueService, variantAttributeService) {
        this.attributeService = attributeService;
        this.attributeValueService = attributeValueService;
        this.variantAttributeService = variantAttributeService;
    }
    async createAttribute(createAttributeDto) {
        this.logger.log(`Creating attribute: ${createAttributeDto.name}`);
        const attribute = await this.attributeService.create(createAttributeDto);
        return {
            id: attribute.id,
            name: attribute.name,
            message: 'Attribute created successfully',
        };
    }
    async getAllAttributes() {
        this.logger.log('Fetching all attributes');
        const attributes = await this.attributeService.findAll();
        return {
            attributes,
            total: attributes.length,
        };
    }
    async createAttributeValue(createAttributeValueDto) {
        this.logger.log(`Creating attribute value: ${createAttributeValueDto.value} for attribute ${createAttributeValueDto.attribute_id}`);
        const value = await this.attributeValueService.create(createAttributeValueDto);
        return {
            id: value.id,
            attribute_id: value.attribute_id,
            value: value.value,
            message: 'Attribute value created successfully',
        };
    }
    async getAllAttributeValues() {
        this.logger.log('Fetching all attribute values');
        const values = await this.attributeValueService.findAll();
        return {
            values,
            total: values.length,
        };
    }
    async getAttributeValues(id) {
        this.logger.log(`Fetching values for attribute ${id}`);
        const values = await this.attributeValueService.findByAttribute(id);
        return {
            values,
            total: values.length,
        };
    }
    async createVariantAttribute(createVariantAttributeDto) {
        this.logger.log(`Creating variant attribute for variant ${createVariantAttributeDto.variant_id}`);
        const variantAttribute = await this.variantAttributeService.create(createVariantAttributeDto);
        return {
            id: variantAttribute.id,
            variant_id: variantAttribute.variant_id,
            attribute_value_id: variantAttribute.attribute_value_id,
            message: 'Variant attribute created successfully',
        };
    }
    async getAllVariantAttributes() {
        this.logger.log('Fetching all variant attributes');
        const variantAttributes = await this.variantAttributeService.findAll();
        return {
            variantAttributes,
            total: variantAttributes.length,
        };
    }
    async getVariantAttributes(id) {
        this.logger.log(`Fetching attributes for variant ${id}`);
        const attributes = await this.variantAttributeService.findByVariant(id);
        return {
            attributes,
            total: attributes.length,
        };
    }
};
exports.AttributesController = AttributesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateAttributeDto]),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "createAttribute", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "getAllAttributes", null);
__decorate([
    (0, common_1.Post)('values'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateAttributeValueDto]),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "createAttributeValue", null);
__decorate([
    (0, common_1.Get)('values'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "getAllAttributeValues", null);
__decorate([
    (0, common_1.Get)('attribute/:id/values'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "getAttributeValues", null);
__decorate([
    (0, common_1.Post)('variant-attributes'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateVariantAttributeDto]),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "createVariantAttribute", null);
__decorate([
    (0, common_1.Get)('variant-attributes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "getAllVariantAttributes", null);
__decorate([
    (0, common_1.Get)('variant/:id/attributes'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "getVariantAttributes", null);
exports.AttributesController = AttributesController = AttributesController_1 = __decorate([
    (0, common_1.Controller)('admin/attributes'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [attribute_service_1.AttributeService,
        attribute_value_service_1.AttributeValueService,
        variant_attribute_service_1.VariantAttributeService])
], AttributesController);
//# sourceMappingURL=attributes.controller.js.map