import { Controller } from '@nestjs/common';
import { CategoriesServiceService } from './categories-service.service';
import { CreateCategoryRequest } from './models/requests/create-category.request';
import { Category } from './models/entities/category.entity';
import { MessagePattern } from '@nestjs/microservices';
import { Attribute } from './models/entities/attribute.entity';

@Controller()
export class CategoriesServiceController {
  constructor(
    private readonly categoriesServiceService: CategoriesServiceService,
  ) {}

  @MessagePattern('createCategory')
  async createCategory(category: CreateCategoryRequest): Promise<Category> {
    return await this.categoriesServiceService.createCategory(category);
  }

  @MessagePattern('updateCategory')
  async updateCategory(data: any): Promise<any> {
    const { id, category } = data;
    return await this.categoriesServiceService.updateCategory(id, category);
  }
  @MessagePattern('getAttributesByCategoryId')
  async getAttributesByCategoryId(id: string): Promise<any> {
    return await this.categoriesServiceService.getAttributesByCategoryId(id);
  }

  @MessagePattern('getCategories')
  async getCategories(): Promise<Category[]> {
    return await this.categoriesServiceService.getCategories();
  }

  @MessagePattern('getCategoryById')
  async getCategoryById(id: string): Promise<any> {
    return await this.categoriesServiceService.getCategoryById(id);
  }

  @MessagePattern('updateAttribute')
  async updateAttribute(data: any): Promise<any> {
    const { id, attribute } = data;
    return await this.categoriesServiceService.updateAttribute(id, attribute);
  }

  @MessagePattern('deleteCategory')
  async deleteCategory(id: string): Promise<any> {
    return await this.categoriesServiceService.deleteCategory(id);
  }

  @MessagePattern('deleteAttribute')
  async deleteAttribute(id: string): Promise<string> {
    return await this.categoriesServiceService.deleteAttribute(id);
  }

  @MessagePattern('getAttribute')
  async getAttribute(id: string): Promise<any> {
    return await this.categoriesServiceService.getAttribute(id);
  }
}
