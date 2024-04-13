import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Food } from './schemas';
import { Model, isValidObjectId } from 'mongoose';
import { Definition, Translate, TranslateService } from '../translate';
import { CreateFoodInterface, UpdateFoodRequest } from './interfaces';
import { Category } from '../category/schemas';
import { Restourant } from '../restourant/schemas';
import {v4 as uuidv4} from 'uuid';
import { Language } from '../language';
import { MinioService } from '../../client';

@Injectable()
export class FoodService {
  constructor(
    @InjectModel(Food.name) private readonly foodModel: Model<Food>,
    @InjectModel(Translate.name) private readonly translateModel: Model<Translate>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(Restourant.name) private readonly restourantModel: Model<Restourant>,
    @InjectModel(Language.name) private readonly languageModel: Model<Language>,
    @InjectModel(Definition.name) private readonly definitionModel: Model<Definition>,
    private minioService: MinioService,
    private readonly service: TranslateService
  ) {}

  async createFood(payload: CreateFoodInterface): Promise<void> {
    await this.#_checkCategory(payload.category_id)
    await this.#_checkRestourant(payload.restourant_id)
    
    const name = JSON.parse(`${payload.name}`);
    const description = JSON.parse(`${payload.description}`);
    const name_kays_array = Object.keys(name)
    const description_kays_array = Object.keys(description)

    for(let languageCode of name_kays_array){
      await this.#_checkLanguage(languageCode)
    }
  
    for(let languageCode of description_kays_array){
      await this.#_checkLanguage(languageCode)
    }

    const translate_name = await this.service.createTranslate({code:uuidv4(), definition:name, type:"content"})
    const translate_description = await this.service.createTranslate({code:uuidv4(), definition:description, type:"content"})
        
    const files = []

    for(let photo of payload.images){
        const fileNames = await this.minioService.uploadFile({file:photo, bucket: "food-menu"})
        files.push(fileNames.fileName)
    }            

    const newFood = await this.foodModel.create({
      name: translate_name,
      description: translate_description,
      price: payload.price,
      category_id: payload.category_id,
      restourant_id: payload.restourant_id,
      image_urls:files,
    });
    await this.categoryModel.findByIdAndUpdate(payload.category_id,{
      $push:{foods:newFood.id}
    })

    await this.translateModel.findByIdAndUpdate(
      {
        _id: translate_name,
      },
      {
        status: 'active',
      },
    )

    await this.translateModel.findByIdAndUpdate(
      {
        _id: translate_description,
      },
      {
        status: 'active',
      },
    )
    newFood.save();
  }

  async getFoodList(languageCode:string): Promise<Food[]> {
    const data =  await this.foodModel
      .find()
      .select('name description image_urls price')
      .exec();

      
      let result = []
      for(let x of data){
        
        const name_request = {
          translateId:x.name.toString(),
          languageCode:languageCode
        }
        
        const desription_request = {
          translateId:x.description.toString(),
          languageCode:languageCode
      }
      
      const translated_name = await this.service.getSingleTranslate(name_request)  
      const translated_description = await this.service.getSingleTranslate(desription_request)          
      result.push({id:x._id, name:translated_name.value, description:translated_description.value, image_urls:x.image_urls , price: x.price})
    }
    return result
  }
  
  async updateFood(payload: UpdateFoodRequest): Promise<void> {
    await this.#_checkFood(payload.id);
    const name = JSON.parse(`${payload.name}`);
    const description = JSON.parse(`${payload.description}`);
    const name_kays_array = Object.keys(name)
    const description_kays_array = Object.keys(description)    
    
    if(payload.images){
      const deleteImageFile = await this.foodModel.findById(payload.id)
      
      for(let photo of deleteImageFile.image_urls){
        await this.minioService.removeFile({fileName: photo})
      }
      
      const files = []

      for(let photo of payload.images){
          const fileNames = await this.minioService.uploadFile({file:photo, bucket: "food-menu"})
          files.push(fileNames.fileName)
      }  
      await this.foodModel.findByIdAndUpdate(
        {_id:payload.id},
        {
          image_urls:files,
        });
      }
      
      if(payload.name){
        for(let languageCode of name_kays_array){
          await this.#_checkLanguage(languageCode)
        }
      const translatefindByID = await this.foodModel.findById(payload.id)

      const translate = await this.translateModel.findById(translatefindByID.name)
            
      
      await this.definitionModel.deleteMany({translateId:translate.id})
      

      await this.translateModel.findByIdAndUpdate(payload.id, {
        definitions: [],
      });      

      for (const item of name_kays_array) {
        const language = await this.languageModel.findOne({ code: item });
                               

        const newDefinition = await this.definitionModel.create({
          languageId: language.id,
          translateId: translate.id,
          value: name[item],
        });

        await this.translateModel.findByIdAndUpdate(translate.id, {
          $push: { definitions: newDefinition.id },
        });        
        newDefinition.save();
      }
    }


    if(payload.description){
      for(let languageCode of description_kays_array){
        await this.#_checkLanguage(languageCode)
      }
    const translatefindByID = await this.foodModel.findById(payload.id)

    const translate = await this.translateModel.findById(translatefindByID.description)
          
    
    await this.definitionModel.deleteMany({translateId:translate.id})
    

    await this.translateModel.findByIdAndUpdate(payload.id, {
      definitions: [],
    });      

    for (const item of description_kays_array) {
      const language = await this.languageModel.findOne({ code: item });
                             

      const newDefinition = await this.definitionModel.create({
        languageId: language.id,
        translateId: translate.id,
        value: description[item],
      });

      await this.translateModel.findByIdAndUpdate(translate.id, {
        $push: { definitions: newDefinition.id },
      });        
      newDefinition.save();
    }
  }

  if(payload.price){
    await this.foodModel.findByIdAndUpdate(
      {_id:payload.id},
      {
        price:payload.price
      });
  }
    
}

  async deleteFood(id: string): Promise<void> {
    await this.#_checkFood(id);
    const deleteImageFile = await this.foodModel.findById(id)
    for(let photo of deleteImageFile.image_urls){
      await this.minioService.removeFile({fileName: photo})
    }

    await this.foodModel.findByIdAndDelete({ _id: id });
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
    const translate = await this.translateModel.findById(id);

    if (!translate) {
      throw new ConflictException(`Translate with ${id} is not exists`);
    }
  }

  async #_checkLanguage(code: string): Promise<void> {
    const language = await this.languageModel.findOne({
      code,
    });

    if (!language) {
      throw new ConflictException(`${language.title} is already available`);
    }
  }
}
