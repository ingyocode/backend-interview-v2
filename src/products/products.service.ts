import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from 'src/database/entities/products/products.entity';
import { FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateProductInterface, GetProductRequestInterface, UpdateProductInterface } from './interfaces/product.interface';
import { PaginationDto } from 'src/common/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsEntity)
    private readonly productsRepository: Repository<ProductsEntity>
  ) {}

  async getProduct(productId: number) {
    return this.productsRepository.findOne({
      where: {
        productId
      }
    })
  }

  async getProductList(params: GetProductRequestInterface): Promise<PaginationDto<ProductsEntity[]>> {
    let whereClause: FindOptionsWhere<ProductsEntity>[];
    if (params?.brand) {
      Object.assign(whereClause, {
        brand: params.brand
      });
    }
    if (params?.minPrice) {
      Object.assign(whereClause, {
        price: MoreThanOrEqual(params.minPrice)
      });
    }
    if (params?.maxPrice) {
      Object.assign(whereClause, {
        price: LessThanOrEqual(params.maxPrice)
      });
    }
    if (params?.color) {
      Object.assign(whereClause, {
        color: params.color
      });
    }
    const count = await this.productsRepository.countBy(whereClause);
    if (count === 0) {
      return new PaginationDto([], count);
    }

    const totalPage = count % params.limit === 0
      ? count / params.limit
      : Math.ceil(count / params.limit);
      if (params.page > totalPage) {
        return new PaginationDto([], totalPage);
      }

      const productList = await this.productsRepository.find({
        where: whereClause
      });
      return new PaginationDto(productList, totalPage)
  }

  async createProduct(userId: number, params: CreateProductInterface): Promise<ProductsEntity> {
    return this.productsRepository.save({
      ownerId: userId,
      ...params
    })
  }

  async updatedProduct(productId: number, params: UpdateProductInterface): Promise<boolean> {
    try {
      await this.productsRepository.update({
        productId,
      }, params);
      return true;
    } catch {
      return false;
    }
  }
  async deleteProduct(productId: number) {
    try {
      await this.productsRepository.delete({
        productId
      });
      return true;
    } catch {
      return false;
    }
  }
}
