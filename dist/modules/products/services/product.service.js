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
var ProductService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
let ProductService = ProductService_1 = class ProductService {
    productRepository;
    logger = new common_1.Logger(ProductService_1.name);
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async create(createProductDto, userId) {
        try {
            this.logger.log(`Creating product: ${createProductDto.name} by user ${userId}`);
            const existingProduct = await this.productRepository.findOne({
                where: { name: createProductDto.name },
            });
            if (existingProduct) {
                throw new common_1.BadRequestException(`Product "${createProductDto.name}" already exists`);
            }
            const product = this.productRepository.create({
                name: createProductDto.name,
                description: createProductDto.description,
                created_by: userId,
            });
            const saved = await this.productRepository.save(product);
            this.logger.log(`Product created successfully with id ${saved.id}`);
            return saved;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to create product: ${errorMessage}`);
            throw error;
        }
    }
    async findAll() {
        try {
            this.logger.log('Fetching all products');
            const products = await this.productRepository.find();
            return products;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to fetch products: ${errorMessage}`);
            throw new common_1.BadRequestException('Failed to fetch products');
        }
    }
    async findOne(id) {
        try {
            this.logger.log(`Fetching product ${id}`);
            const product = await this.productRepository.findOne({
                where: { id },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product with id ${id} not found`);
            }
            return product;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to fetch product: ${errorMessage}`);
            throw error;
        }
    }
    async update(id, updateData) {
        try {
            this.logger.log(`Updating product ${id}`);
            const product = await this.findOne(id);
            if (updateData.name && updateData.name !== product.name) {
                const existingProduct = await this.productRepository.findOne({
                    where: { name: updateData.name },
                });
                if (existingProduct) {
                    throw new common_1.BadRequestException(`Product "${updateData.name}" already exists`);
                }
            }
            Object.assign(product, updateData);
            const updated = await this.productRepository.save(product);
            this.logger.log(`Product ${id} updated successfully`);
            return updated;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to update product: ${errorMessage}`);
            throw error;
        }
    }
    async remove(id) {
        try {
            this.logger.log(`Deleting product ${id}`);
            const product = await this.findOne(id);
            await this.productRepository.remove(product);
            this.logger.log(`Product ${id} deleted successfully`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to delete product: ${errorMessage}`);
            throw error;
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = ProductService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductService);
//# sourceMappingURL=product.service.js.map