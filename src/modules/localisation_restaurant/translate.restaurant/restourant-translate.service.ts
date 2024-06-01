import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DefinitionRestourant, TranslateRestourant } from './schemas';
import { LanguageRestourant } from '../language.restaurant';
import { CreateRestourantTranslateInterface, GetSingleRestourantTranslateByCodeRequest, GetSingleRestourantTranslateByCodeResponse, GetSingleRestourantTranslateRequest, GetSingleRestourantTranslateResponse, RestourantDefinitionUpdateRequest, UpdateRestourantTranslateRequest } from './interfaces';
import { Restourant } from '../../restourant/schemas';
import { Language } from '../../localisation/language';
import { Definition, Translate } from '../../localisation/translate';

@Injectable()
export class RestourantTranslateService {
  constructor(
    @InjectModel(TranslateRestourant.name)
    private readonly restourantTranslateModel: Model<TranslateRestourant>,
    @InjectModel(Translate.name)
    private readonly translateModel: Model<Translate>,
    @InjectModel(Restourant.name)
    private readonly restourantModel: Model<Restourant>,
    @InjectModel(DefinitionRestourant.name)
    private readonly restourantDefinitionModel: Model<DefinitionRestourant>,
    @InjectModel(Definition.name)
    private readonly definitionModel: Model<Definition>,
    @InjectModel(LanguageRestourant.name)
    private readonly restourantLanguageModel: Model<LanguageRestourant>,
    @InjectModel(Language.name)
    private readonly languageModel: Model<Language>,
  ) {}

  async getRestourantTranslateList(restaurantId: string): Promise<TranslateRestourant[]> {
    const data =  await this.restourantTranslateModel
    .find({restaurantId})
    .select(["-updatedAt", "-createdAt"])
    .populate({ path: 'definitions', populate: { path: 'languageId' } })
    .exec();

    return data
  }

  async getUnusedTranslateList(): Promise<TranslateRestourant[]> {
    return await this.restourantTranslateModel
      .find({ status: 'inactive' })
      .select(["-updatedAt", "-createdAt"])
      .populate('definitions', ["value", "id", 'restourant_id'])
      .exec();
  }

  async createTranslate(payload: CreateRestourantTranslateInterface): Promise<string> {
    await this.#_checkRestourant(payload.restourant_id)
    await this.#_checkExistingRestourantTranslate(payload.code, payload.restourant_id);

    for (const code of Object.keys(payload.definition)) {
      await this.#_checkRestourantLanguage(code, payload.restourant_id);
    }

    const restourant_translate = await this.restourantTranslateModel.create({
      code: payload.code,
      type: payload.type,
      restourant_id: payload.restourant_id,
      status: 'inactive',
    });

    for (const item of Object.entries(payload.definition)) {
      const restourant_language = await this.restourantLanguageModel.findOne({ code: item[0], restourant_id: payload.restourant_id });

      const newDefinition = await this.restourantDefinitionModel.create({
        languageId: restourant_language.id,
        translateId: restourant_translate.id,
        restaurant_id: payload.restourant_id,
        value: item[1],
      });
      restourant_translate.definitions.push(newDefinition.id);      
      
      await newDefinition.save();
    }
    await restourant_translate.save();
    return restourant_translate._id.toString()
  }

  async getSingleRestourantTranslateByCode(
    payload: GetSingleRestourantTranslateByCodeRequest,
  ): Promise<GetSingleRestourantTranslateByCodeResponse> {
    await this.#_checkRestourantLanguage(payload.languageCode, payload.restourant_id);
    await this.#_checkRestourantTranslateByCode(payload.translateCode, payload.restourant_id);

    const restourant_language = await this.restourantLanguageModel.findOne({
      code: payload.languageCode,
      restourant_id: payload.restourant_id
    });
    
    const restourant_translate = await this.restourantTranslateModel.findOne({code:payload.translateCode, restourant_id: payload.restourant_id});
    
    const definition = await this.restourantDefinitionModel.findOne({
      languageId: restourant_language.id,
      translateId: restourant_translate.id,
      restaurant_id: payload.restourant_id
    });    
    return {
      code: restourant_translate.code,
      value: definition?.value,
      restourant_id: payload.restourant_id
    };
  }
  
  async getSingleRestourantTranslate(
    payload: GetSingleRestourantTranslateRequest,
    ): Promise<GetSingleRestourantTranslateResponse> {
    // await this.#_checkRestourantTranslate(payload.translateId);
    await this.#_checkRestourantLanguage(payload.languageCode, payload.restourant_id)
      
    const restourant_language = await this.restourantLanguageModel.findOne({
      code: payload.languageCode,
      restourant_id: payload.restourant_id
    });

    const restourant_translate = await this.restourantTranslateModel.findById(payload.translateId);

    if(!restourant_translate) return {
      value: "Translate not found"
    }
        

    const restourant_definition = await this.restourantDefinitionModel.findOne({
      languageId: restourant_language.id,
      translateId: restourant_translate.id,
    });

    return {
      value: restourant_definition?.value,
    };
  }

  async updateRestourantTranslate(payload: UpdateRestourantTranslateRequest): Promise<string> {
    await this.#_checkRestourantTranslate(payload.id);
    const foundedRestourantTranslate = await this.restourantTranslateModel.findById(payload.id);

    if (payload?.status) {
      if (payload.status == 'active' && foundedRestourantTranslate.status == 'active') {
        throw new ConflictException('Translate is already in use');
      }

      await this.restourantTranslateModel.findByIdAndUpdate(foundedRestourantTranslate.id, {
        status: payload.status,
      });
    }

    if (payload?.definition) {
      for (const df of foundedRestourantTranslate.definitions) {
        await this.restourantDefinitionModel.findByIdAndDelete(df);
      }

      await this.restourantTranslateModel.findByIdAndUpdate(payload.id, {
        definitions: [],
      });

      for (const item of Object.entries(payload.definition)) {
        const restourant_language = await this.restourantLanguageModel.findOne({ code: item[0] });
                

        const newRestourantDefinition = await this.restourantDefinitionModel.create({
          languageId: restourant_language.id,
          translateId: foundedRestourantTranslate.id,
          value: item[1],
        });

        await this.restourantTranslateModel.findByIdAndUpdate(foundedRestourantTranslate.id, {
          $push: { definitions: newRestourantDefinition.id },
        });
        newRestourantDefinition.save();
        return newRestourantDefinition.id
      }
    }
  }

  async updateRestourantDefinition(payload: RestourantDefinitionUpdateRequest): Promise<void> {
    await this.#_checkID(payload.id);
    const restourant_definition = await this.restourantDefinitionModel.findById(payload.id);

    if (!restourant_definition) {
      throw new NotFoundException('RestourantDefinition not found');
    }

    await this.restourantDefinitionModel.findByIdAndUpdate(payload.id, {
      value: payload.value,
    });
  }

  async deleteRestourantTranslate(id: string) {
    await this.#_checkID(id);

    const restourant_translate = await this.restourantTranslateModel.findById(id);

    await this.restourantDefinitionModel.deleteMany({ translateId: restourant_translate.id });

    await this.restourantTranslateModel.findByIdAndDelete(id);
  }

  async #_checkRestourantLanguage(code: string, restourant_id: string): Promise<void> {
    const restourant_language = await this.restourantLanguageModel.findOne({ code: code, restourant_id: restourant_id });

    if (!restourant_language){
      throw new BadRequestException("Language Not Found")
    }
  }

  async #_checkRestourantTranslate(id: string): Promise<void> {
    await this.#_checkID(id);
    
    const restourant_translate = await this.restourantTranslateModel.findById(id);
    
    if(!restourant_translate){
        throw new NotFoundException("Translate Not Found")
    }
  }

  async #_checkRestourant(id: string): Promise<void> {
    await this.#_checkID(id);
    const restourant = await this.restourantModel.findById(id);
    
    if (!restourant) throw new NotFoundException('Restourant not found');
  }

  async #_checkRestourantTranslateByCode(code: string, restourant_id: string): Promise<void> {
    const restourant_translate = await this.restourantTranslateModel.findOne({code:code, restaurant_id: restourant_id});
  
    if (!restourant_translate) throw new NotFoundException('Translate Code not found');
  }

  async #_checkExistingRestourantTranslate(code: string, restourant_id: string): Promise<void> {
    const restourant_translate = await this.restourantTranslateModel.findOne({
      code: code,
      restourant_id: restourant_id
    });

    if (restourant_translate)
      throw new BadRequestException(`RestourantTranslate ${code} is already available`);
  }

  async #_checkID(id: string): Promise<void> {
    if (!isValidObjectId(id))
      throw new BadRequestException(`${id} is not valid UUID`);
  }
}
