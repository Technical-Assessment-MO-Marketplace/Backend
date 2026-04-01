"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariantsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const variant_entity_1 = require("./entities/variant.entity");
const variant_attribute_entity_1 = require("./entities/variant-attribute.entity");
let VariantsModule = class VariantsModule {
};
exports.VariantsModule = VariantsModule;
exports.VariantsModule = VariantsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([variant_entity_1.Variant, variant_attribute_entity_1.VariantAttribute])],
        exports: [typeorm_1.TypeOrmModule],
    })
], VariantsModule);
//# sourceMappingURL=variants.module.js.map