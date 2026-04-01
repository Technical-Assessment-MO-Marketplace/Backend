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
var ProductsPublicController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsPublicController = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("../services/product.service");
const variant_service_1 = require("../services/variant.service");
let ProductsPublicController = ProductsPublicController_1 = class ProductsPublicController {
    productService;
    variantService;
    logger = new common_1.Logger(ProductsPublicController_1.name);
    constructor(productService, variantService) {
        this.productService = productService;
        this.variantService = variantService;
    }
    async getAllProducts() {
        this.logger.log('Fetching all products (public access)');
        const products = await this.productService.findAll();
        return {
            products,
            total: products.length,
            message: 'Products retrieved successfully',
        };
    }
    async getProductVariants(productId) {
        this.logger.log(`Fetching variants for product ${productId} (public access)`);
        const variants = await this.variantService.findAllVariants(productId);
        return {
            productId,
            variants,
            total: variants.length,
            message: 'Product variants retrieved successfully',
        };
    }
};
exports.ProductsPublicController = ProductsPublicController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsPublicController.prototype, "getAllProducts", null);
__decorate([
    (0, common_1.Get)(':productId/variants'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductsPublicController.prototype, "getProductVariants", null);
exports.ProductsPublicController = ProductsPublicController = ProductsPublicController_1 = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [product_service_1.ProductService,
        variant_service_1.VariantService])
], ProductsPublicController);
//# sourceMappingURL=products-public.controller.js.map