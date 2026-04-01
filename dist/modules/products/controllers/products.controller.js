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
var ProductsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("../services/product.service");
const variant_service_1 = require("../services/variant.service");
const dto_1 = require("../dto");
const jwt_guard_1 = require("../../auth/guards/jwt.guard");
const admin_guard_1 = require("../../auth/guards/admin.guard");
let ProductsController = ProductsController_1 = class ProductsController {
    productService;
    variantService;
    logger = new common_1.Logger(ProductsController_1.name);
    constructor(productService, variantService) {
        this.productService = productService;
        this.variantService = variantService;
    }
    async createProduct(createProductDto, req) {
        this.logger.log(`Creating product: ${createProductDto.name} by user ${req.user.userId}`);
        const product = await this.productService.create(createProductDto, req.user.userId);
        return {
            id: product.id,
            name: product.name,
            description: product.description,
            created_by: product.created_by,
            message: 'Product created successfully',
        };
    }
    async updateProduct(id, updateData) {
        this.logger.log(`Updating product ${id}`);
        const product = await this.productService.update(id, updateData);
        return {
            id: product.id,
            name: product.name,
            description: product.description,
            message: 'Product updated successfully',
        };
    }
    async deleteProduct(id) {
        this.logger.log(`Deleting product ${id}`);
        await this.productService.remove(id);
        return {
            message: 'Product deleted successfully',
        };
    }
    async createVariant(createVariantDto) {
        this.logger.log(`Creating variant for product ${createVariantDto.product_id}`);
        const variant = await this.variantService.createVariant(createVariantDto);
        return {
            id: variant.id,
            product_id: variant.product_id,
            combination_key: variant.combination_key,
            price: variant.price,
            stock: variant.stock,
            message: 'Variant created successfully',
        };
    }
    async updateVariantStock(id, updateData) {
        this.logger.log(`Updating stock for variant ${id}`);
        const variant = await this.variantService.updateStock(id, updateData.stock);
        return {
            id: variant.id,
            stock: variant.stock,
            message: 'Variant stock updated successfully',
        };
    }
    async deleteVariant(id) {
        this.logger.log(`Deleting variant ${id}`);
        await this.variantService.deleteVariant(id);
        return {
            message: 'Variant deleted successfully',
        };
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.Post)('variants'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateVariantDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createVariant", null);
__decorate([
    (0, common_1.Patch)('variant/:id/stock'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateVariantStock", null);
__decorate([
    (0, common_1.Delete)('variant/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "deleteVariant", null);
exports.ProductsController = ProductsController = ProductsController_1 = __decorate([
    (0, common_1.Controller)('admin/products'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [product_service_1.ProductService,
        variant_service_1.VariantService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map