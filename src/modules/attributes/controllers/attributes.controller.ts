import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AttributeService } from '../services/attribute.service';
import { AttributeValueService } from '../services/attribute-value.service';
import { CreateAttributeDto, CreateAttributeValueDto } from '../dto';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';

@Controller('admin/attributes')
@UseGuards(JwtGuard, AdminGuard)
export class AttributesController {
  private readonly logger = new Logger(AttributesController.name);

  constructor(
    private attributeService: AttributeService,
    private attributeValueService: AttributeValueService,
  ) {}

  // ATTRIBUTES ENDPOINTS

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAttribute(@Body() createAttributeDto: CreateAttributeDto) {
    this.logger.log(`Creating attribute: ${createAttributeDto.name}`);
    const attribute = await this.attributeService.create(createAttributeDto);
    return {
      id: attribute.id,
      name: attribute.name,
      message: 'Attribute created successfully',
    };
  }

  @Get()
  async getAllAttributes() {
    this.logger.log('Fetching all attributes');
    const attributes = await this.attributeService.findAll();
    return {
      attributes,
      total: attributes.length,
    };
  }

  // ATTRIBUTE VALUES ENDPOINTS

  @Post('values')
  @HttpCode(HttpStatus.CREATED)
  async createAttributeValue(
    @Body() createAttributeValueDto: CreateAttributeValueDto,
  ) {
    this.logger.log(
      `Creating attribute value: ${createAttributeValueDto.value} for attribute ${createAttributeValueDto.attribute_id}`,
    );
    const value = await this.attributeValueService.create(
      createAttributeValueDto,
    );
    return {
      id: value.id,
      attribute_id: value.attribute_id,
      value: value.value,
      message: 'Attribute value created successfully',
    };
  }

  @Get('values')
  async getAllAttributeValues() {
    this.logger.log('Fetching all attribute values');
    const values = await this.attributeValueService.findAll();
    return {
      values,
      total: values.length,
    };
  }

  @Delete('values/:id')
  @HttpCode(HttpStatus.OK)
  async deleteAttributeValue(@Param('id') id: number) {
    this.logger.log(`Deleting attribute value: ${id}`);
    const result = await this.attributeValueService.delete(id);
    return result;
  }

  @Get('attribute/:id/values')
  async getAttributeValues(@Param('id') id: number) {
    this.logger.log(`Fetching values for attribute ${id}`);
    const values = await this.attributeValueService.findByAttribute(id);
    return {
      values,
      total: values.length,
    };
  }

  // Delete specific attribute
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteAttribute(@Param('id') id: number) {
    this.logger.log(`Deleting attribute: ${id}`);
    const result = await this.attributeService.delete(id);
    return result;
  }
}
