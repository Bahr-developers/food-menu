import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Food } from './schemas';
import { Model, isValidObjectId } from 'mongoose';
import { Definition, Translate, TranslateService } from '../localisation/translate';
import {
  AddOneFoodImageInterface,
  CreateFoodInterface,
  UpdateFoodRequest,
} from './interfaces';
import { Category } from '../category/schemas';
import { Restourant } from '../restourant/schemas';
import { v4 as uuidv4 } from 'uuid';
import { Language } from '../localisation/language';
import { MinioService } from '../../client';
import { SearchFoodInterface } from './interfaces/search-food.interface';
import { DeleteFoodImageDto } from './dtos';
import { LanguageRestourant } from '../localisation_restaurant/language.restaurant';
import { TranslateRestourant, TranslateRestourantSchema } from './../localisation_restaurant/translate.restaurant/schemas/translate.schema';
import { DefinitionRestourant, RestourantTranslateService } from '../localisation_restaurant/translate.restaurant';

@Injectable()
export class FoodService {
  constructor(
    @InjectModel(Food.name) private readonly foodModel: Model<Food>,
    @InjectModel(TranslateRestourant.name)
    private readonly translateRestourantModel: Model<TranslateRestourant>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(LanguageRestourant.name) private readonly languageRestourantModel: Model<LanguageRestourant>,
    @InjectModel(Restourant.name)
    private readonly restourantModel: Model<Restourant>,
    @InjectModel(DefinitionRestourant.name)
    private readonly definitionRestourantModel: Model<DefinitionRestourant>,
    private minioService: MinioService,
    private readonly service: RestourantTranslateService,
  ) {}

  async createFood(payload: CreateFoodInterface): Promise<void> {
    await this.#_checkCategory(payload.category_id);
    await this.#_checkRestourant(payload.restourant_id);
    let translate_name = ""
    let descriptionn = ''
    let preparing_time: any = {}

    const name = JSON.parse(`${payload.name}`);
    const name_kays_array = Object.keys(name);
    if(payload?.description){
      const description = JSON.parse(`${payload.description}`);
      const description_kays_array = Object.keys(description);
      for (let languageCode of description_kays_array) {
        await this.#_checkLanguage(languageCode, payload.restourant_id);
      }
      descriptionn = await this.service.createTranslate({
        code: uuidv4(),
        definition: description,
        type: 'content',
        restourant_id: payload.restourant_id
      });
    }
    if(payload?.preparing_time){
      preparing_time = JSON.parse(`${payload.preparing_time}`);
      const preparing_time_kays_array = Object.keys(preparing_time);
      for (let keys of preparing_time_kays_array) {
        if(keys!="start_time" && keys!="end_time"){
          throw new BadRequestException(`${keys} is not found`)
        }
      }
    }

    for (let languageCode of name_kays_array) {
        await this.#_checkLanguage(languageCode, payload.restourant_id)
      }
      translate_name = await this.service.createTranslate({
        code: uuidv4(),
        definition: name,
        type: 'content',
        restourant_id: payload.restourant_id
      });


    const files = [];

    for (let photo of payload.images) {
      const fileNames = await this.minioService.uploadFile({
        file: photo,
        bucket: 'food-menu',
      });
      files.push(fileNames.fileName);
    }

    const newFood = await this.foodModel.create({
      name: translate_name,
      description: descriptionn,
      price: payload.price,
      preparing_time: preparing_time,
      category_id: payload.category_id,
      restourant_id: payload.restourant_id,
      image_urls: files,
    });
        
    await this.categoryModel.findByIdAndUpdate(payload.category_id, {
      $push: { foods: newFood.id },
    });

    await this.translateRestourantModel.findByIdAndUpdate(
      {
        _id: translate_name,
      },
      {
        status: 'active',
      },
    );

    await this.translateRestourantModel.findByIdAndUpdate(
      {
        _id: descriptionn,
      },
      {
        status: 'active',
      },
    );
    newFood.save();
  }

  async searchFood(payload: SearchFoodInterface): Promise<Food[]> {
    await this.#_checkRestourant(payload.restaurant_id);

    const data = await this.getFoodList(payload.languageCode, payload.restaurant_id);
    
    if (!payload.name.length || !data.length) {
      return data;
    }

    let result = [];
    for (const food of data) {      
      if (
        food.name
          .toString()
          .toLocaleLowerCase()
          .includes(payload.name.toLocaleLowerCase()) && food.restourant_id.toString() == payload.restaurant_id ||
        food.description
          .toString()
          .toLocaleLowerCase()
          .includes(payload.name.toLocaleLowerCase()) && food.restourant_id.toString() == payload.restaurant_id
      ) {
        
        result.push(food);
      }
    }
    return result;
  }

  async getFoodList(languageCode: string, restourant_id: string): Promise<Food[]> {    
    const data = await this.foodModel
      .find({restourant_id: restourant_id})
      .select('name description image_urls price food_status restourant_id preparing_time')
      .exec();

    let result = [];
    for (let x of data) {
      const name_request = {
        translateId: x.name.toString(),
        languageCode: languageCode,
        restourant_id: x.restourant_id.toString()
      };

      const desription_request = {
        translateId: x.description.toString(),
        languageCode: languageCode,
        restourant_id: x.restourant_id.toString()
      };

      const translated_name = await this.service.getSingleRestourantTranslate(
        name_request,
      );
      const translated_description = await this.service.getSingleRestourantTranslate(
        desription_request,
      );
      result.push({
        id: x._id,
        name: translated_name.value,
        description: translated_description.value,
        image_urls: x.image_urls,
        price: x.price,
        preparing_time:x.preparing_time,
        restourant_id: x.restourant_id,
        food_status: x.food_status,
      });
    }
    return result;
  }

  async updateFood(payload: UpdateFoodRequest): Promise<void> {
    await this.#_checkFood(payload.id);

    if (payload.food_status) {
      await this.foodModel.findByIdAndUpdate(
        { _id: payload.id },
        {
          food_status: payload.food_status,
        },
      );
    }

    if (payload.status) {
      await this.foodModel.findByIdAndUpdate(
        { _id: payload.id },
        {
          status: payload.status,
        },
      );
    }

    if (payload.name) {      
      // const name = JSON.parse(`${payload.name}`);
      const name_kays_array = Object.keys(payload.name);
      const translatefindByID = await this.foodModel.findById(payload.id);
      for (let languageCode of name_kays_array) {
        await this.#_checkLanguage(languageCode, translatefindByID.restourant_id.toString());
      }

      const translate = await this.translateRestourantModel.findById(
        translatefindByID.name,
      );        

      await this.definitionRestourantModel.deleteMany({ translateId: translate.id });

      await this.translateRestourantModel.findByIdAndUpdate(payload.id, {
        definitions: [],
      });

      for (const item of name_kays_array) {
        const language = await this.languageRestourantModel.findOne({ code: item });

        const newDefinition = await this.definitionRestourantModel.create({
          languageId: language.id,
          translateId: translate.id,
          value: payload.name[item],
        });

        await this.translateRestourantModel.findByIdAndUpdate(translate.id, {
          $push: { definitions: newDefinition.id },
        });
        newDefinition.save();
      }
    }

    if (payload.description) {
      // const description = JSON.parse(`${payload.description.toString()}`);
      const description_kays_array = Object.keys(payload.description);
      const translatefindByID = await this.foodModel.findById(payload.id);
      for (let languageCode of description_kays_array) {
        await this.#_checkLanguage(languageCode, translatefindByID.restourant_id.toString());
      }

      const translate = await this.translateRestourantModel.findById(
        translatefindByID.description,
      );

      await this.definitionRestourantModel.deleteMany({ translateId: translate.id });

      await this.translateRestourantModel.findByIdAndUpdate(payload.id, {
        definitions: [],
      });

      for (const item of description_kays_array) {
        const language = await this.languageRestourantModel.findOne({ code: item });

        const newDefinition = await this.definitionRestourantModel.create({
          languageId: language.id,
          translateId: translate.id,
          value: payload.description[item],
        });

        await this.translateRestourantModel.findByIdAndUpdate(translate.id, {
          $push: { definitions: newDefinition.id },
        });
        newDefinition.save();
      }
    }

    if (payload.price) {
      await this.foodModel.findByIdAndUpdate(
        { _id: payload.id },
        {
          price: payload.price,
        },
      );
    }

    if (payload.preparing_time) {
      await this.foodModel.findByIdAndUpdate(
        { _id: payload.id },
        {
          preparing_time: Number(payload.preparing_time),
        },
      );
    }
  }

  async addOneFoodImage(payload: AddOneFoodImageInterface): Promise<void> {
    await this.#_checkFood(payload.foodId);

    const imageUrl = await this.minioService.uploadFile({
      file: payload.image,
      bucket: 'food-menu',
    });

    await this.foodModel.findByIdAndUpdate(payload.foodId, {
      $push: { image_urls: imageUrl.fileName },
    });
  }

  async deleteOneFoodImage(payload: DeleteFoodImageDto): Promise<void> {
    await this.#_checkFood(payload.foodId);

    const foundedFood = await this.foodModel.findById(payload.foodId);

    if (!foundedFood.image_urls.includes(payload.image_url)) {
      return;
    }

    await this.foodModel.findByIdAndUpdate(foundedFood.id, {
      $pull: { image_urls: payload.image_url },
    });

    await this.minioService
      .removeFile({ fileName: payload.image_url })
      .catch((undefined) => undefined);
  }

  async deleteFood(id: string): Promise<void> {
    await this.#_checkFood(id);
    const deleteImageFile = await this.foodModel.findById(id);
    for (let photo of deleteImageFile.image_urls) {
      await this.minioService
        .removeFile({ fileName: photo })
        .catch((undefined) => undefined);
    }

    await this.translateRestourantModel.findByIdAndDelete(
      {
        _id: deleteImageFile.name,
      },
    );

    await this.translateRestourantModel.findByIdAndDelete(
      {
        _id: deleteImageFile.description,
      },
    );
    await this.foodModel.findByIdAndDelete({_id:id});
  }

  async #_checkExistingFood(name: string): Promise<void> {
    const food = await this.foodModel.findOne({
      name,
    });

    if (food) {
      throw new ConflictException(`${food.name} is already available`);
    }
  }

  async #_checkCategory(id: string): Promise<void> {
    await this.#_checkId(id);
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new ConflictException(`Category with ${id} is not exists`);
    }
  }

  async #_checkFood(id: string): Promise<void> {
    await this.#_checkId(id);
    const food = await this.foodModel.findById(id);

    if (!food) {
      throw new ConflictException(`Food with ${id} is not exists`);
    }
  }

  async #_checkRestourant(id: string): Promise<void> {
    await this.#_checkId(id);
    const restourant = await this.restourantModel.findById(id);

    if (!restourant) {
      throw new ConflictException(`Restourant with ${id} is not exists`);
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
    const translate = await this.translateRestourantModel.findById(id);

    if (!translate) {
      throw new ConflictException(`Translate with ${id} is not exists`);
    }
  }

  async #_checkLanguage(code: string, restourant_id: string): Promise<void> {
    const language = await this.languageRestourantModel.findOne({
      code: code,
      restourant_id: restourant_id
    });

    if(!language){
      throw new NotFoundException("Language not found")
    }
  }
}
