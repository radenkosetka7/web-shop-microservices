import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './models/entities/category.entity';
import { CategoriesRepository } from './categories-service.repository';
import { CreateCategoryRequest } from './models/requests/create-category.request';
import { UpdateCategoryRequest } from './models/requests/update-category.request';
import { Attribute } from './models/entities/attribute.entity';
import { UpdateAttributeRequest } from './models/requests/update-attribute.request';
import { AttributesRepository } from './attribute.repository';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CategoriesServiceService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: CategoriesRepository,
    @InjectRepository(Attribute)
    private readonly attributeRepository: AttributesRepository,
    @Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy,
  ) {}

  async createCategory(category: CreateCategoryRequest): Promise<Category> {
    const categoryResp = await this.categoryRepository.save(category);
    for (const attribute of categoryResp.attributes) {
      const attributeReq = {
        ...attribute,
        category: categoryResp,
      };
      this.attributeRepository.save(attributeReq);
    }
    return categoryResp;
  }

  async updateCategory(
    id: string,
    category: UpdateCategoryRequest,
  ): Promise<any> {
    const categoryResponse = await this.getCategoryById(id);
    console.log('sta je attrReq ' + JSON.stringify(category));
    if (categoryResponse?.statusCode) {
      return categoryResponse;
    }
    const categoryRequest = {
      name: category.name,
    };
    await this.categoryRepository.update(id, categoryRequest);
    for (const attribute of category.updatedAttributes) {
      await this.updateAttribute(attribute);
    }
    for (const attribute of category.deletedAttributes) {
      await this.deleteAttribute(attribute.id);
    }
    for (const attribute of category.addedAttributes) {
      const attributeReq = {
        ...attribute,
        category: categoryResponse,
      };
      this.attributeRepository.save(attributeReq);
    }
    return await this.categoryRepository.findOne({ where: { id: id } });
  }

  async getAttributesByCategoryId(id: string): Promise<any> {
    const category = await this.getCategoryById(id);
    if (category?.statusCode) {
      return category;
    }
    return await this.attributeRepository.find({
      where: { category: category },
    });
  }

  async getCategories(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async getCategoryById(id: string): Promise<any> {
    const category = await this.categoryRepository.findOne({
      where: { id: id },
    });
    if (!category) {
      return { statusCode: 404, message: 'Category does not exist.' };
    }
    return category;
  }

  async updateAttribute(attribute: UpdateAttributeRequest): Promise<any> {
    const attributeResponse = await this.getAttribute(attribute.id);
    if (attributeResponse?.statusCode) {
      return attributeResponse;
    }
    await this.attributeRepository.update(attribute.id, attribute);
    return await this.attributeRepository.findOne({
      where: { id: attribute.id },
    });
  }

  async deleteCategory(id: string): Promise<any> {
    const category = await this.getCategoryById(id);
    if (category?.statusCode) {
      return category;
    }
    const attributes = await this.getAttributesByCategoryId(id);
    for (const attribute of attributes) {
      await this.deleteAttribute(attribute.id);
    }
    this.categoryRepository.delete(id);
    return 'Category successfully deleted.';
  }

  async deleteAttribute(id: string): Promise<string> {
    const attribute = await this.attributeRepository.findOne({
      where: { id: id },
    });
    const result = await lastValueFrom(
      this.productClient.send('deleteAttributeValue', attribute.id),
    );
    if (result) {
      this.attributeRepository.delete(attribute.id);
    }
    return 'Attribute deleted successfully';
  }

  async getAttribute(id: string): Promise<any> {
    const attribute = await this.attributeRepository.findOne({
      where: { id: id },
    });
    if (!attribute) {
      return { statusCode: 404, message: 'Attrbiute does not exist.' };
    }
    return attribute;
  }
}
