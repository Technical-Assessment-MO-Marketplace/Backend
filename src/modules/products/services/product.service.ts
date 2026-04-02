import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    userId: number,
  ): Promise<Product> {
    try {
      this.logger.log(
        `Creating product: ${createProductDto.name} by user ${userId}`,
      );

      // Check if product name already exists
      const existingProduct = await this.productRepository.findOne({
        where: { name: createProductDto.name },
      });

      if (existingProduct) {
        throw new BadRequestException(
          `Product "${createProductDto.name}" already exists`,
        );
      }

      const product = this.productRepository.create({
        name: createProductDto.name,
        description: createProductDto.description,
        created_by: userId,
      });

      const saved = await this.productRepository.save(product);
      this.logger.log(`Product created successfully with id ${saved.id}`);
      return saved;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to create product: ${errorMessage}`);
      throw error;
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      this.logger.log('Fetching all products');
      const products = await this.productRepository.find();
      return products;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to fetch products: ${errorMessage}`);
      throw new BadRequestException('Failed to fetch products');
    }
  }

  async findOne(id: number): Promise<Product> {
    try {
      this.logger.log(`Fetching product ${id}`);
      const product = await this.productRepository.findOne({
        where: { id },
      });

      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      return product;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to fetch product: ${errorMessage}`);
      throw error;
    }
  }

  async update(
    id: number,
    updateData: Partial<CreateProductDto>,
  ): Promise<Product> {
    try {
      this.logger.log(`Updating product ${id}`);

      const product = await this.findOne(id);

      if (updateData.name && updateData.name !== product.name) {
        const existingProduct = await this.productRepository.findOne({
          where: { name: updateData.name },
        });

        if (existingProduct) {
          throw new BadRequestException(
            `Product "${updateData.name}" already exists`,
          );
        }
      }

      Object.assign(product, updateData);
      const updated = await this.productRepository.save(product);
      this.logger.log(`Product ${id} updated successfully`);
      return updated;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to update product: ${errorMessage}`);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      this.logger.log(`Deleting product ${id}`);

      const product = await this.findOne(id);
      await this.productRepository.remove(product);
      this.logger.log(`Product ${id} deleted successfully`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to delete product: ${errorMessage}`);
      throw error;
    }
  }
}
