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
var AttributeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const attribute_entity_1 = require("../entities/attribute.entity");
let AttributeService = AttributeService_1 = class AttributeService {
    dataSource;
    attributeRepository;
    logger = new common_1.Logger(AttributeService_1.name);
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.attributeRepository = this.dataSource.getRepository(attribute_entity_1.Attribute);
    }
    async create(createAttributeDto) {
        try {
            const { name } = createAttributeDto;
            const existingAttribute = await this.attributeRepository.findOne({
                where: { name },
            });
            if (existingAttribute) {
                throw new common_1.BadRequestException(`Attribute "${name}" already exists`);
            }
            const attribute = this.attributeRepository.create({ name });
            const savedAttribute = await this.attributeRepository.save(attribute);
            this.logger.log(`Attribute created: ${name}`);
            return savedAttribute;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.logger.error(`Failed to create attribute: ${error.message}`);
            throw new common_1.InternalServerErrorException('Failed to create attribute');
        }
    }
    async findAll() {
        try {
            const attributes = await this.attributeRepository.find({
                relations: ['attributeValues'],
            });
            return attributes;
        }
        catch (error) {
            this.logger.error(`Failed to fetch attributes: ${error.message}`);
            throw new common_1.InternalServerErrorException('Failed to fetch attributes');
        }
    }
    async findById(id) {
        try {
            const attribute = await this.attributeRepository.findOne({
                where: { id },
                relations: ['attributeValues'],
            });
            if (!attribute) {
                throw new common_1.NotFoundException(`Attribute with id ${id} not found`);
            }
            return attribute;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Failed to fetch attribute: ${error.message}`);
            throw new common_1.InternalServerErrorException('Failed to fetch attribute');
        }
    }
};
exports.AttributeService = AttributeService;
exports.AttributeService = AttributeService = AttributeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AttributeService);
//# sourceMappingURL=attribute.service.js.map