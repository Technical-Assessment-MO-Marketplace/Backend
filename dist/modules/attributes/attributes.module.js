"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const attribute_entity_1 = require("./entities/attribute.entity");
const attribute_value_entity_1 = require("./entities/attribute-value.entity");
const variant_attribute_entity_1 = require("../variants/entities/variant-attribute.entity");
const variant_entity_1 = require("../variants/entities/variant.entity");
const services_1 = require("./services");
const attributes_controller_1 = require("./controllers/attributes.controller");
let AttributesModule = class AttributesModule {
};
exports.AttributesModule = AttributesModule;
exports.AttributesModule = AttributesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                attribute_entity_1.Attribute,
                attribute_value_entity_1.AttributeValue,
                variant_attribute_entity_1.VariantAttribute,
                variant_entity_1.Variant,
            ]),
        ],
        controllers: [attributes_controller_1.AttributesController],
        providers: [services_1.AttributeService, services_1.AttributeValueService, services_1.VariantAttributeService],
        exports: [services_1.AttributeService, services_1.AttributeValueService, services_1.VariantAttributeService],
    })
], AttributesModule);
//# sourceMappingURL=attributes.module.js.map