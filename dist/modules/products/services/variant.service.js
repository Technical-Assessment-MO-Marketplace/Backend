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
var VariantService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariantService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const variant_entity_1 = require("../entities/variant.entity");
const product_entity_1 = require("../entities/product.entity");
let VariantService = VariantService_1 = class VariantService {
    variantRepository;
    productRepository;
    logger = new common_1.Logger(VariantService_1.name);
    constructor(variantRepository, productRepository) {
        this.variantRepository = variantRepository;
        this.productRepository = productRepository;
    }
    async createVariant(createVariantDto) {
        try {
            this.logger.log(`Creating variant for product ${createVariantDto.product_id} with price ${createVariantDto.price} and stock ${createVariantDto.stock}`);
            if (!createVariantDto.attributeValueIds ||
                !Array.isArray(createVariantDto.attributeValueIds) ||
                createVariantDto.attributeValueIds.length === 0) {
                throw new common_1.BadRequestException('Variant must have at least one attribute value selected');
            }
            if (!createVariantDto.attributeValueIds.every((id) => Number.isInteger(id) && id > 0)) {
                throw new common_1.BadRequestException('All attribute value IDs must be positive integers');
            }
            if (createVariantDto.price === undefined ||
                createVariantDto.price === null ||
                createVariantDto.price < 0) {
                throw new common_1.BadRequestException('Price must be a non-negative number');
            }
            if (createVariantDto.stock === undefined ||
                createVariantDto.stock === null ||
                !Number.isInteger(createVariantDto.stock) ||
                createVariantDto.stock < 0) {
                throw new common_1.BadRequestException('Stock must be a non-negative integer');
            }
            const product = await this.productRepository.findOne({
                where: { id: createVariantDto.product_id },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product with id ${createVariantDto.product_id} not found`);
            }
            const combinationKey = createVariantDto.attributeValueIds
                .sort((a, b) => a - b)
                .join('-');
            this.logger.log(`Checking for duplicate variant with combination key: ${combinationKey} for product ${createVariantDto.product_id}`);
            const existingVariant = await this.variantRepository.findOne({
                where: {
                    product_id: createVariantDto.product_id,
                    combination_key: combinationKey,
                },
            });
            if (existingVariant) {
                this.logger.warn(`Duplicate variant attempted: Product ${createVariantDto.product_id}, Combination ${combinationKey}`);
                throw new common_1.BadRequestException(`A variant with attribute combination [${createVariantDto.attributeValueIds.sort((a, b) => a - b).join(', ')}] already exists for this product (ID: ${existingVariant.id}). Cannot create duplicate.`);
            }
            const variant = this.variantRepository.create({
                product_id: createVariantDto.product_id,
                combination_key: combinationKey,
                price: createVariantDto.price,
                stock: createVariantDto.stock,
            });
            const savedVariant = await this.variantRepository.save(variant);
            this.logger.log(`Variant created successfully - ID: ${savedVariant.id}, Product: ${createVariantDto.product_id}, Combination: ${combinationKey}, Price: ${createVariantDto.price}, Stock: ${createVariantDto.stock}`);
            return savedVariant;
        }
        catch (error) {
            this.logger.error(`Failed to create variant: ${error.message}`);
            throw error;
        }
    }
    async findAllVariants(productId) {
        try {
            const query = {};
            if (productId) {
                query.where = { product_id: productId };
                this.logger.log(`Fetching variants for product ${productId}`);
            }
            else {
                this.logger.log('Fetching all variants');
            }
            const variants = await this.variantRepository.find(query);
            return variants;
        }
        catch (error) {
            this.logger.error(`Failed to fetch variants: ${error.message}`);
            throw new common_1.BadRequestException('Failed to fetch variants');
        }
    }
    async findOne(id) {
        try {
            this.logger.log(`Fetching variant ${id}`);
            const variant = await this.variantRepository.findOne({
                where: { id },
            });
            if (!variant) {
                throw new common_1.NotFoundException(`Variant with id ${id} not found`);
            }
            return variant;
        }
        catch (error) {
            this.logger.error(`Failed to fetch variant: ${error.message}`);
            throw error;
        }
    }
    async updateStock(id, newStock) {
        try {
            this.logger.log(`Updating stock for variant ${id} to ${newStock}`);
            const variant = await this.findOne(id);
            variant.stock = newStock;
            const updated = await this.variantRepository.save(variant);
            this.logger.log(`Variant ${id} stock updated successfully`);
            return updated;
        }
        catch (error) {
            this.logger.error(`Failed to update stock: ${error.message}`);
            throw error;
        }
    }
    async deleteVariant(id) {
        try {
            this.logger.log(`Deleting variant ${id}`);
            const variant = await this.findOne(id);
            await this.variantRepository.remove(variant);
            this.logger.log(`Variant ${id} deleted successfully`);
        }
        catch (error) {
            this.logger.error(`Failed to delete variant: ${error.message}`);
            throw error;
        }
    }
};
exports.VariantService = VariantService;
exports.VariantService = VariantService = VariantService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(variant_entity_1.Variant)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], VariantService);
//# sourceMappingURL=variant.service.js.map