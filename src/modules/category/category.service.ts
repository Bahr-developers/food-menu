import { CreateCategoryInterface, UpdateCategoryInterface } from './interfaces';
import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas';
import { Model, isValidObjectId } from 'mongoose';
import { Translate, TranslateService } from '../translate';
import { MinioService } from '../../client';
import { Restourant } from 'modules/restourant/schemas';
@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(Restourant.name)
    private readonly restaurantModel: Model<Restourant>,
    @InjectModel(Translate.name)
    private readonly translateModel: Model<Translate>,
    private minioService: MinioService,
    private readonly service: TranslateService,
  ) {}

  async createCategory(payload: CreateCategoryInterface): Promise<void> {
    await this.#_checkExistingCategory(payload.name);
    await this.checkTranslate(payload.name);
    await this.checkRestaurant(payload.restaurant_id);
    
    
    let image = ''

    if(payload.image){
      const file = await this.minioService.uploadFile({
        file: payload.image,
        bucket: 'food-menu',
      });
      image = file.fileName
    }

    if (payload.category_id) {
        const newCategoriy = await this.categoryModel.create({
          name: payload.name,
          image_url:image,
          restaurant_id: payload.restaurant_id,
          category_id: payload.category_id,
        });

      await this.categoryModel.findByIdAndUpdate(payload.category_id, {
        $push: { subcategories: newCategoriy.id },
      });

      newCategoriy.save();
    } else {
      const newCategoriy = await this.categoryModel.create({
        name: payload.name,
        image_url:image,
        restaurant_id: payload.restaurant_id,
      });
      newCategoriy.save();
    }

    await this.translateModel.findByIdAndUpdate(
      {
        _id: payload.name,
      },
      {
        status: 'active',
      },
    );
  }

  async getCategoryList(languageCode: string): Promise<Category[]> {
    const data = await this.categoryModel
      .find()
      .select('name image_url category_id, food_status')
      .populate({
        path: 'subcategories',
        populate: {
          path: 'foods',
        },
      })
      .exec();

    let result = [];

    for (let x of data) {
      let foods = null;
      let foodss = null;
      let subcategories = [];
      let food = [];
      const category: any = {};

      category.id = x._id;
      const category_name = await this.service.getSingleTranslate({
        translateId: x.name.toString(),
        languageCode: languageCode,
      })

      category.name = category_name.value;      
      category.image_url = x.image_url;

      for (let item of x.subcategories) {
        foodss = null;
        foodss = item;
        foodss.name = (
          await this.service.getSingleTranslate({
            translateId: foodss.name.toString(),
            languageCode: languageCode,
          })
        ).value;
        for (let fod of item.foods) {
          foods = null;
          foods = fod;
          foods.name = (
            await this.service.getSingleTranslate({
              translateId: foods.name.toString(),
              languageCode: languageCode,
            })
          ).value;
          foods.description = (
            await this.service.getSingleTranslate({
              translateId: foods.description.toString(),
              languageCode: languageCode,
            })
          ).value;

          food.push(foods);
        }
        
        subcategories.push(foodss);
      }
      category.subcategories = subcategories;

      if (x.category_id) {
        continue;
      } else {
        result.push(category);
      }
    }
    return result;
  }

  async getCategoryListByRestaurantId(
    languageCode: string,
    restaurantId: string,
  ): Promise<Category[]> {
    // checking restaurant ID
    await this.#_checkId(restaurantId);

    const data = await this.categoryModel
      .find({ restaurant_id: restaurantId })
      .select('name image_url category_id')
      .populate({
        path: 'subcategories',
        populate: {
          path: 'foods',
        },
      })
      .exec();

    let result = [];

    for (let x of data) {
      let foods = null;
      let foodss = null;
      let subcategories = [];
      let food = [];
      const category: any = {};

      category.id = x._id;
      category.name = (
        await this.service.getSingleTranslate({
          translateId: x.name.toString(),
          languageCode: languageCode,
        })
      ).value;
      category.image_url = x.image_url;

      for (let item of x.subcategories) {
        foodss = null;
        foodss = item;
        foodss.name = (
          await this.service.getSingleTranslate({
            translateId: foodss.name.toString(),
            languageCode: languageCode,
          })
        ).value;        
        for(let isActiveFood of item.foods){
          if(isActiveFood.status == "active"){
            const foodds = item.foods
            for (let fod of foodds) {
              foods = null;
              foods = fod;
                foods.name = (
                  await this.service.getSingleTranslate({
                    translateId: foods.name.toString(),
                    languageCode: languageCode,
                  })
                ).value;
                foods.description = (
                  await this.service.getSingleTranslate({
                    translateId: foods.description.toString(),
                    languageCode: languageCode,
                  })
                ).value;
              food.push(foods);
            }
          }else{
            item.foods = []
          }
        }
        subcategories.push(foodss);        
      }
      category.subcategories = subcategories;

      if (x.category_id) {
        continue;
      } else {
        result.push(category);
      }
    }
    return result;
  }

  async getCategoryListByRestaurantIdForAdmins(
    languageCode: string,
    restaurantId: string,
  ): Promise<Category[]> {
    // checking restaurant ID
    await this.#_checkId(restaurantId);

    const data = await this.categoryModel
      .find({ restaurant_id: restaurantId })
      .select('name image_url category_id')
      .populate({
        path: 'subcategories',
        populate: {
          path: 'foods',
        },
      })
      .exec();

    let result = [];

    for (let x of data) {
      let foods = null;
      let foodss = null;
      let subcategories = [];
      let food = [];
      const category: any = {};

      category.id = x._id;
      category.name = (
        await this.service.getSingleTranslate({
          translateId: x.name.toString(),
          languageCode: languageCode,
        })
      ).value;
      category.image_url = x.image_url;

      for (let item of x.subcategories) {
        foodss = null;
        foodss = item;
        foodss.name = (
          await this.service.getSingleTranslate({
            translateId: foodss.name.toString(),
            languageCode: languageCode,
          })
        ).value;
        for (let fod of item.foods) {
            foods = null;
            foods = fod;
            foods.name = (
              await this.service.getSingleTranslate({
                translateId: foods.name.toString(),
                languageCode: languageCode,
              })
            ).value;
            foods.description = (
              await this.service.getSingleTranslate({
                translateId: foods.description.toString(),
                languageCode: languageCode,
              })
            ).value;
  
            food.push(foods);
          }

        subcategories.push(foodss);
      }
      category.subcategories = subcategories;

      if (x.category_id) {
        continue;
      } else {
        result.push(category);
      }
    }
    return result;
  }

  async updateCategory(payload: UpdateCategoryInterface): Promise<void> {
    await this.#_checkCategory(payload.id);
    await this.checkTranslate(payload.name);

    const deleteImageFile = await this.categoryModel.findById(payload.id);

    await this.minioService.removeFile({ fileName: deleteImageFile.image_url });

    const file = await this.minioService.uploadFile({
      file: payload.image,
      bucket: 'food-menu',
    });

    await this.translateModel.findByIdAndUpdate(
      {
        _id: payload.name,
      },
      {
        status: 'active',
      },
    );

    await this.categoryModel.findByIdAndUpdate(
      { _id: payload.id },
      {
        name: payload.name,
        image_url: file.fileName,
      },
    );
  }

  async deleteCategory(id: string): Promise<void> {
    await this.#_checkCategory(id);
    const deleteImageFile = await this.categoryModel.findById(id);
    if(deleteImageFile.image_url){
          await this.minioService.removeFile({ fileName: deleteImageFile.image_url });
        }
        await this.translateModel.findByIdAndUpdate(
          {
            _id: deleteImageFile.name,
          },
          {
            status: 'inactive',
          },
        );
        await this.categoryModel.findByIdAndDelete({ _id: id });
  }

  async #_checkExistingCategory(name: string): Promise<void> {
    const category = await this.categoryModel.findOne({
      name,
    });

    if (category) {
      throw new ConflictException(`${category.name} is already available`);
    }
  }

  async #_checkCategory(id: string): Promise<void> {
    await this.#_checkId(id);
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new ConflictException(`Category with ${id} is not exists`);
    }
  }

  async #_checkId(id: string): Promise<void> {
    const isValid = isValidObjectId(id);
    if (!isValid) {
      throw new UnprocessableEntityException(`Invalid ${id} Object ID`);
    }
  }

  async checkTranslate(id: string): Promise<void> {
    await this.#_checkId(id);
    const translate = await this.translateModel.findById(id);

    if (!translate) {
      throw new ConflictException(`Translate with ${id} is not exists`);
    }
  }

  async checkRestaurant(id: string): Promise<void> {
    await this.#_checkId(id);
    const restaurant = await this.restaurantModel.findById(id);

    if (!restaurant) {
      throw new ConflictException(`Restaurant with ${id} is not exists`);
    }
  }
}
