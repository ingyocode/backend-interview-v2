import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductRequestBodyDto, GetProductListRequestQueryDto, GetProductResponseDto, LikeProductRequestBodyDto, ProductIdRequestDto, UpdateProductRequestBodyDto } from './dtos/product.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { ProductsEntity } from 'src/database/entities/products/products.entity';
import { TokenInterface } from 'src/auth/interface/token.interface';
import { UseUserAuthDecorator } from 'src/decorators/use-user-auth.decorator';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { LikeProductEnumType } from 'src/redis/interfaces/redis.type';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'get product list',
    description: 'get product list'
  })
  async getProductList(
    @Query() query: GetProductListRequestQueryDto
  ): Promise<PaginationDto<GetProductResponseDto[]>> {
    return this.productsService.getProductList(query);
  }

  @Get('/:productId')
  @ApiOperation({
    summary: 'get product',
    description: 'get product'
  })
  @ApiOkResponse({
    type: GetProductResponseDto
  })
  async getProduct(
    @Param() params: ProductIdRequestDto
  ): Promise<GetProductResponseDto> {
    return this.productsService.getProduct(params.productId)
  }

  @ApiOperation({
    summary: 'create product',
    description: 'create product'
  })
  @UseUserAuthDecorator()
  @Post()
  async createProduct(
    @Req() req: { user: TokenInterface },
    @Body() body: CreateProductRequestBodyDto
  ): Promise<ProductsEntity> {
    return this.productsService.createProduct(req.user.id, body);
  }

  @ApiOperation({
    summary: 'update product',
    description: 'update product'
  })
  @UseUserAuthDecorator()
  @Put('/:productId')
  async updateProduct(
    @Req() req: { user: TokenInterface },
    @Param() param: ProductIdRequestDto,
    @Body() body: UpdateProductRequestBodyDto
  ): Promise<ProductsEntity> {
    const product = await this.productsService.getProduct(param.productId);
    if (!product) {
      throw new HttpException('Invalid productId', 400)
    }

    if (product.ownerId !== req.user.id) {
      throw new HttpException('can not access this product', 403)
    }

    const result = await this.productsService.updatedProduct(param.productId, body)
    if (!result) {
      throw new HttpException('can not update product', 409);
    }

    return this.productsService.getProduct(param.productId);
  }

  @ApiOperation({
    summary: 'delete product',
    description: 'delete product'
  })
  @ApiOkResponse({
    type: Boolean
  })
  @UseUserAuthDecorator()
  @Delete('/:productId')
  async deleteProduct(
    @Req() req: { user: TokenInterface },
    @Param() param: ProductIdRequestDto,
  ): Promise<boolean> {
    const product = await this.productsService.getProduct(param.productId);
    if (!product) {
      throw new HttpException('Invalid productId', 400)
    }

    if (product.ownerId !== req.user.id) {
      throw new HttpException('can not access this product', 403)
    }

    return await this.productsService.deleteProduct(param.productId)
  }

  @ApiOperation({
    summary: 'like product',
    description: 'like product'
  })
  @Post('like/:productId')
  @UseUserAuthDecorator()
  @ApiOkResponse({
    type: Number
  })
  async likeProduct(
    @Param() param: ProductIdRequestDto,
    @Body() body: LikeProductRequestBodyDto
  ): Promise<number> {
    return this.productsService.likeProduct(param.productId, body.type)
  }
}
