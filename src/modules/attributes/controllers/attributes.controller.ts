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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { AttributeService } from '../services/attribute.service';
import { AttributeValueService } from '../services/attribute-value.service';
import { CreateAttributeDto, CreateAttributeValueDto } from '../dto';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';

@ApiTags('Attributes-Admin')
@ApiBearerAuth('JWT-auth')
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
  @ApiOperation({
    summary: 'Create attribute',
    description:
      'Create a new product attribute (e.g., Color, Size, Material). Admin only.',
  })
  @ApiBody({ type: CreateAttributeDto })
  @ApiResponse({
    status: 201,
    description: 'Attribute created successfully',
    schema: {
      example: {
        id: 1,
        name: 'Color',
        message: 'Attribute created successfully',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid attribute data',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated or not an admin',
  })
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
  @ApiOperation({
    summary: 'Get all attributes',
    description: 'Retrieve all available product attributes. Admin only.',
  })
  @ApiResponse({
    status: 200,
    description: 'Attributes retrieved successfully',
    schema: {
      example: {
        attributes: [
          { id: 1, name: 'Color' },
          { id: 2, name: 'Size' },
        ],
        total: 2,
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated or not an admin',
  })
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
  @ApiOperation({
    summary: 'Create attribute value',
    description:
      'Create a new value for an attribute (e.g., "Red" for Color attribute). Admin only.',
  })
  @ApiBody({ type: CreateAttributeValueDto })
  @ApiResponse({
    status: 201,
    description: 'Attribute value created successfully',
    schema: {
      example: {
        id: 1,
        attribute_id: 1,
        value: 'Red',
        message: 'Attribute value created successfully',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid attribute value data or attribute not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated or not an admin',
  })
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
  @ApiOperation({
    summary: 'Get all attribute values',
    description: 'Retrieve all attribute values. Admin only.',
  })
  @ApiResponse({
    status: 200,
    description: 'Attribute values retrieved successfully',
    schema: {
      example: {
        values: [
          { id: 1, attribute_id: 1, value: 'Red' },
          { id: 2, attribute_id: 1, value: 'Blue' },
        ],
        total: 2,
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated or not an admin',
  })
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
  @ApiOperation({
    summary: 'Delete attribute value',
    description: 'Delete an attribute value. Admin only.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Attribute value ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Attribute value deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Attribute value not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated or not an admin',
  })
  async deleteAttributeValue(@Param('id') id: number) {
    this.logger.log(`Deleting attribute value: ${id}`);
    const result = await this.attributeValueService.delete(id);
    return result;
  }

  @Get('attribute/:id/values')
  @ApiOperation({
    summary: 'Get attribute values by attribute ID',
    description: 'Retrieve all values for a specific attribute. Admin only.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Attribute ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Attribute values retrieved successfully',
    schema: {
      example: {
        values: [
          { id: 1, value: 'Red' },
          { id: 2, value: 'Blue' },
        ],
        total: 2,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Attribute not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated or not an admin',
  })
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
  @ApiOperation({
    summary: 'Delete attribute',
    description: 'Delete an attribute and all its values. Admin only.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Attribute ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Attribute deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Attribute not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated or not an admin',
  })
  async deleteAttribute(@Param('id') id: number) {
    this.logger.log(`Deleting attribute: ${id}`);
    const result = await this.attributeService.delete(id);
    return result;
  }
}
