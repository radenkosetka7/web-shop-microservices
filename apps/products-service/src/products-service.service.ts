import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './models/entities/product.entity';
import { ProductsRepository } from './products-service.repository';
import { ImagesRepository } from './images-service.repository';
import { ProductRequest } from './models/requests/products.request';
import { Image } from './models/entities/image.entity';
import { ProductResponse } from './models/responses/product.response';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { SearchRequest } from './models/requests/search.request';
import { AttributeValuesRepository } from './attribute-value.repository';
import { AttributeValue } from './models/entities/attribute-value.entity';
import { AttributeValueResponse } from './models/responses/attribute-value.response';
import { Not } from 'typeorm';

@Injectable()
export class ProductsServiceService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: ProductsRepository,
    @InjectRepository(Image)
    private readonly imagesRepository: ImagesRepository,
    @Inject('CATEGORY_SERVICE') private readonly categoryClient: ClientProxy,
    @Inject('COMMENT_SERVICE') private readonly commentClient: ClientProxy,
    @InjectRepository(AttributeValue)
    private readonly attributeValuesRepository: AttributeValuesRepository,
  ) {}

  async createProduct(
    product: ProductRequest,
    id: string,
  ): Promise<ProductResponse> {
    const extendedObject = {
      ...product,
      creationDate: new Date().toDateString(),
      userSeller: id,
    };
    const productSaved = await this.productsRepository.save(extendedObject);
    for (const image of product.images) {
      const imageEntity = {
        productImage: image.productImage,
        product: productSaved,
      };
      this.imagesRepository.save(imageEntity);
    }
    for (const attributeValue of product.attributeValues) {
      const attributeValueRequest = {
        product: productSaved,
        value: attributeValue.value,
        attributeId: attributeValue.attributeId,
      };
      this.attributeValuesRepository.save(attributeValueRequest);
    }

    let result: ProductResponse = {
      ...productSaved,
      comments: [],
    };
    return result;
  }

  async getAll(
    page: number,
    pageSize: number,
    title: string | null,
  ): Promise<any> {
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    let products = [];
    let resultDTO: ProductResponse[] = [];
    if (title != null) {
      products = await this.productsRepository
        .createQueryBuilder('p')
        .where('LOWER(p.title) LIKE LOWER(:title) AND p.finished = 0', {
          title: `%${title}%`,
        })
        .leftJoinAndSelect('p.images', 'images')
        .leftJoinAndSelect('p.attributeValues', 'attributeValues')
        .orderBy('p.creationDate', 'DESC')
        .getMany();
    } else {
      products = await this.productsRepository
        .createQueryBuilder('p')
        .where('p.finished = 0')
        .leftJoinAndSelect('p.images', 'images')
        .leftJoinAndSelect('p.attributeValues', 'attributeValues')
        .orderBy('p.creationDate', 'DESC')
        .getMany();
    }
    const selectedProducts = products.slice(startIndex, endIndex);
    selectedProducts.forEach((product) => {
      let result: ProductResponse = {
        ...product,
        comments: [],
      };
      resultDTO.push(result);
    });
    return { products: resultDTO, total: products.length };
  }

  async getAllProductsForBuyer(
    page: number,
    pageSize: number,
    title: string | null,
    id: string,
  ): Promise<any> {
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    let products = [];
    let resultDTO: ProductResponse[] = [];
    if (title != null) {
      products = await this.productsRepository
        .createQueryBuilder('p')
        .where(
          'LOWER(p.title) LIKE LOWER(:title) AND p.userBuyer = :id AND p.finished = 1',
          { title: `%${title}%`, id },
        )
        .leftJoinAndSelect('p.images', 'images')
        .leftJoinAndSelect('p.attributeValues', 'attributeValues')
        .getMany();
    } else {
      products = await this.productsRepository
        .createQueryBuilder('p')
        .where('p.userBuyer = :id AND p.finished = 1', { id })
        .leftJoinAndSelect('p.images', 'images')
        .leftJoinAndSelect('p.attributeValues', 'attributeValues')
        .getMany();
    }
    const selectedProducts = products.slice(startIndex, endIndex);
    for (const product of selectedProducts) {
      let result: ProductResponse = {
        ...product,
        comments: [],
      };
      resultDTO.push(result);
    }

    return { products: resultDTO, total: products.length };
  }

  async getAllProductsForSeller(
    page: number,
    pageSize: number,
    finished: number,
    title: string | null,
    id: string,
  ): Promise<any> {
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    let products = [];
    let resultDTO: ProductResponse[] = [];
    if (title != null) {
      products = await this.productsRepository
        .createQueryBuilder('p')
        .where(
          'LOWER(p.title) LIKE LOWER(:title) AND p.userSeller = :id AND p.finished = :finished',
          { title: `%${title}%`, id, finished },
        )
        .leftJoinAndSelect('p.images', 'images')
        .leftJoinAndSelect('p.attributeValues', 'attributeValues')
        .getMany();
    } else {
      products = await this.productsRepository
        .createQueryBuilder('p')
        .where('p.userSeller = :id AND p.finished = :finished', {
          id,
          finished,
        })
        .leftJoinAndSelect('p.images', 'images')
        .leftJoinAndSelect('p.attributeValues', 'attributeValues')
        .getMany();
    }
    const selectedProducts = products.slice(startIndex, endIndex);
    for (const product of selectedProducts) {
      let result: ProductResponse = {
        ...product,
        comments: [],
      };
      resultDTO.push(result);
    }
    return { products: resultDTO, total: products.length };
  }

  async getById(id: string): Promise<any> {
    const product = await this.productsRepository
      .createQueryBuilder('p')
      .where('p.id = :id', {
        id,
      })
      .leftJoinAndSelect('p.images', 'images')
      .leftJoinAndSelect('p.attributeValues', 'attributeValues')
      .getOne();
    if (!product) {
      return { statusCode: 404, message: 'Product does not exist.' };
    }

    const comments = await lastValueFrom(
      this.commentClient.send('productComments', product.id),
    );
    const category = await lastValueFrom(
      this.categoryClient.send('getCategoryById', product.category),
    );
    let attributeValuesResponses: AttributeValueResponse[] = [];
    await Promise.all(
      product.attributeValues.map(async (attributeValue) => {
        const attribute = await lastValueFrom(
          this.categoryClient.send('getAttribute', attributeValue.attributeId),
        );
        const attributeValueResponse = {
          attribute: {
            id: attribute.id,
            name: attribute.name,
            type: attribute.type,
          },
          value: attributeValue.value,
        };
        attributeValuesResponses.push(attributeValueResponse);
      }),
    );

    let result: ProductResponse = {
      ...product,
      attributeValues: attributeValuesResponses,
      category: category,
      comments: comments,
    };
    return result;
  }

  async delete(id: string, user: string): Promise<any> {
    const product = await (user !== null
      ? this.productsRepository.findOne({ where: { id: id, userSeller: user } })
      : this.productsRepository.findOne({ where: { id: id } }));

    if (!product) {
      return { statusCode: 404, message: 'Product does not exist.' };
    }
    product.finished = 2;
    await this.productsRepository.save(product);
    return 'Product deleted successfully.';
  }

  async deleteProducts(id: string) {
    const products = await this.productsRepository.find({
      where: { userSeller: id, finished: 0 },
    });
    products.forEach((product) => {
      product.finished = 2;
    });
    this.productsRepository.save(products);
  }

  async deleteProductsList(products: string[]) {
    products.forEach(async (item) => {
      const product = await this.productsRepository.findOne({
        where: { id: item },
      });
      product.finished = 2;
      this.productsRepository.save(product);
    });
  }
  async purchaseProduct(id: string, userId: string): Promise<any> {
    const product = await this.productsRepository.findOne({
      where: { id: id, userBuyer: null, userSeller: Not(userId), finished: 0 },
    });
    if (!product) {
      return { statusCode: 404, message: 'Product does not exist.' };
    }
    product.userBuyer = userId;
    product.finished = 1;
    return await this.productsRepository.save(product);
  }

  async searchProducts(
    page: number,
    pageSize: number,
    request: SearchRequest,
  ): Promise<any> {
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    const queryBuilder = this.productsRepository.createQueryBuilder('product');

    queryBuilder.where('product.finished = :finished', { finished: 0 });

    if (request.title) {
      queryBuilder.andWhere('product.title LIKE :title', {
        title: `%${request.title}%`,
      });
    }
    if (request.category) {
      queryBuilder.andWhere('product.category = :category', {
        category: request.category,
      });
    }
    if (request.location) {
      queryBuilder.andWhere('product.city = :location', {
        location: request.location,
      });
    }
    if (request.productStatus) {
      queryBuilder.andWhere('product.isNew = :productStatus', {
        productStatus: request.productStatus,
      });
    }
    if (request.priceFrom) {
      queryBuilder.andWhere('product.price >= :priceFrom', {
        priceFrom: request.priceFrom,
      });
    }
    if (request.priceTo) {
      queryBuilder.andWhere('product.price <= :priceTo', {
        priceTo: request.priceTo,
      });
    }
    if (request.attributeValueList && request.attributeValueList.length > 0) {
      const attributeValueConditions = request.attributeValueList.map(
        (attributeValue, index) => {
          const alias = `attributeValues${index}`;
          queryBuilder.leftJoin(`product.attributeValues`, alias);
          queryBuilder.andWhere(
            `${alias}.attributeId = :attributeId_${index}`,
            { [`attributeId_${index}`]: attributeValue.attributeId },
          );
          queryBuilder.andWhere(`${alias}.value = :attributeValue_${index}`, {
            [`attributeValue_${index}`]: attributeValue.value,
          });
          return `${alias}.productId = product.id`;
        },
      );

      queryBuilder.andWhere(`(${attributeValueConditions.join(' OR ')})`);
    }

    const products = await queryBuilder
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.attributeValues', 'attributeValues')
      .getMany();

    const selectedProducts = products.slice(startIndex, endIndex);
    return { products: selectedProducts, total: products.length };
  }

  async deleteAttributeValue(attributeId: string): Promise<any> {
    const attributeValues = await this.attributeValuesRepository.find({
      where: { attributeId: attributeId },
    });

    for (const attributeValue of attributeValues) {
      this.attributeValuesRepository.delete(attributeValue);
      this.delete(attributeValue.productId, null);
    }
    return 'AttributeValues deleted successfully.';
  }
}
