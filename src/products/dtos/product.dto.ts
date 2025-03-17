import { Type } from 'class-transformer';
import { IsDefined, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { CreateProductInterface, GetProductOrderType, GetProductOrderValue, GetProductRequestInterface, UpdateProductInterface } from '../interfaces/product.interface';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductsEntity } from 'src/database/entities/products/products.entity';
import { LikeProductEnumType } from 'src/redis/interfaces/redis.type';

export class ProductIdRequestDto {
  @ApiProperty({
    description: 'product id'
  })
  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  productId: number;
}

export class GetProductListRequestQueryDto implements GetProductRequestInterface {
  @ApiProperty({
    description: 'page, minimum is 1'
  })
  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty({
    description: 'limit, minimum is 1 and maximum is 100'
  })
  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number;

  @ApiProperty({
    description: 'order type - price | name | brand'
  })
  @IsDefined()
  orderType: GetProductOrderType;

  @ApiProperty({
    description: 'order value - ASC | DESC'
  })
  orderValue: GetProductOrderValue

  @ApiPropertyOptional({
    description: 'product brand'
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({
    description: 'product min price'
  })
  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'product max price'
  })
  @IsOptional()
  @IsNumber()
  maxPrice?: number;
  
  @ApiPropertyOptional({
    description: 'product color'
  })
  @IsOptional()
  @IsString()
  color?: string;
}

export class CreateProductRequestBodyDto implements CreateProductInterface {
  @ApiProperty({
    description: 'product name'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'product description'
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'product brand'
  })
  @IsString()
  brand: string;

  @ApiProperty({
    description: 'product price'
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'product size'
  })
  @IsString()
  size: string;

  @ApiProperty({
    description: 'product color'
  })
  @IsString()
  color: string;
}

export class UpdateProductRequestBodyDto implements UpdateProductInterface {
  @ApiPropertyOptional({
    description: 'product name'
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'product description'
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'product brand'
  })
  @IsOptional()
  @IsString()
  brand: string;

  @ApiPropertyOptional({
    description: 'product price'
  })
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiPropertyOptional({
    description: 'product size'
  })
  @IsOptional()
  @IsString()
  size: string;

  @ApiPropertyOptional({
    description: 'product color'
  })
  @IsOptional()
  @IsString()
  color: string;
}

export class GetProductResponseDto extends ProductsEntity {
  @ApiProperty({
    description: 'product id'
  })
  productId: number;

  @ApiProperty({
    description: 'product owner id'
  })
  ownerId: number;

  @ApiProperty({
    description: 'product name'
  })
  name: string;

  @ApiProperty({
    description: 'product description'
  })
  description: string;

  @ApiProperty({
    description: 'product brand'
  })
  brand: string;

  @ApiProperty({
    description: 'product price'
  })
  price: number;

  @ApiProperty({
    description: 'product size'
  })
  size: string;

  @ApiProperty({
    description: 'product color'
  })
  color: string;

  @ApiProperty({
    description: 'product created at'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'product updated at'
  })
  updatedAt: Date;

  @ApiProperty({ description: 'product like amount' })
  likeAmount: number;
}

export class LikeProductRequestBodyDto {
  @ApiProperty({
    description: 'like or cancel',
    enum: LikeProductEnumType
  })
  @IsEnum(LikeProductEnumType)
  type: LikeProductEnumType;
}