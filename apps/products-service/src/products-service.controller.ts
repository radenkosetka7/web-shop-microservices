import { Controller } from '@nestjs/common';
import { ProductsServiceService } from './products-service.service';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { Product } from './models/entities/product.entity';
import { MessagePattern } from '@nestjs/microservices';
import { ProductResponse } from './models/responses/product.response';

@Controller()
export class ProductsServiceController {
  constructor(
    private readonly productsServiceService: ProductsServiceService,
  ) {}

  @MessagePattern('createProduct')
  async createProduct(data: any): Promise<ProductResponse> {
    const { product, id } = data;
    return await this.productsServiceService.createProduct(product, id);
  }
  @MessagePattern('getProducts')
  async getAll(data: any): Promise<any> {
    const { page, pageSize, title } = data;
    return await this.productsServiceService.getAll(page, pageSize, title);
  }
  @MessagePattern('getProductById')
  async getById(id: string): Promise<any> {
    return await this.productsServiceService.getById(id);
  }
  @MessagePattern('deleteProduct')
  async delete(data: any): Promise<any> {
    const { id, user } = data;
    return await this.productsServiceService.delete(id, user);
  }
  @MessagePattern('deleteProductsList')
  async deleteProductsList(products: string[]) {
    return await this.productsServiceService.deleteProductsList(products);
  }

  @MessagePattern('deleteUserProducts')
  async deleteProducts(id: string) {
    return await this.productsServiceService.deleteProducts(id);
  }

  @MessagePattern('purchasedProducts')
  async getAllProductsForBuyer(data: any): Promise<any> {
    const { page, pageSize, title, id } = data;
    return await this.productsServiceService.getAllProductsForBuyer(
      page,
      pageSize,
      title,
      id,
    );
  }

  @MessagePattern('soldProducts')
  async getAllProductsForSeller(data: any): Promise<any> {
    const { page, pageSize, title, finished, id } = data;
    return await this.productsServiceService.getAllProductsForSeller(
      page,
      pageSize,
      finished,
      title,
      id,
    );
  }

  @MessagePattern('uploadProductImages')
  async uploadProductImages(data: any): Promise<string[] | null> {
    try {
      const files = data.files;
      const uids = data.uids;
      const extension = '.png';
      const dir = process.env.DIR;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uid = uids[i];
        const imagePath = path.join(dir, uid + extension);
        const bufferData = Buffer.from(file.buffer);
        fs.writeFileSync(imagePath, bufferData);
      }
      return uids;
    } catch (error) {
      return null;
    }
  }

  @MessagePattern('purchaseProduct')
  async purchaseProduct(data: any): Promise<any> {
    const { id, userId } = data;
    return await this.productsServiceService.purchaseProduct(id, userId);
  }

  @MessagePattern('searchProducts')
  async searchProducts(data: any): Promise<any> {
    const { page, pageSize, request } = data;
    return await this.productsServiceService.searchProducts(
      page,
      pageSize,
      request,
    );
  }

  @MessagePattern('deleteAttributeValue')
  async deleteAttributeValue(attributeId: string): Promise<any> {
    return await this.productsServiceService.deleteAttributeValue(attributeId);
  }
}
