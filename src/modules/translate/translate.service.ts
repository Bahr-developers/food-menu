import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateTranslateInterface,
  DefinitionUpdateRequest,
  GetSingleTranslateRequest,
  GetSingleTranslateResponse,
  UpdateTranslateRequest,
  GetSingleTranslateByCodeRequest,
  GetSingleTranslateByCodeResponse
} from './interfaces';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Definition, Translate } from './schemas';
import { Language } from 'modules/language';

@Injectable()
export class TranslateService {
  constructor(
    @InjectModel(Translate.name)
    private readonly translateModel: Model<Translate>,
    @InjectModel(Definition.name)
    private readonly definitionModel: Model<Definition>,
    @InjectModel(Language.name)
    private readonly languageModel: Model<Language>,
  ) {}

  async getTranslateList(): Promise<Translate[]> {
    return await this.translateModel.find().select(["-updatedAt", "-createdAt"]).populate('definitions', ["value", "id"]).exec();
  }

  async getUnusedTranslateList(): Promise<Translate[]> {
    return await this.translateModel
      .find({ status: 'inactive' })
      .select(["-updatedAt", "-createdAt"])
      .populate('definitions', ["value", "id"])
      .exec();
  }

  async createTranslate(payload: CreateTranslateInterface): Promise<String> {
    await this.#_checkExistingTranslate(payload.code);

    for (const code of Object.keys(payload.definition)) {
      await this.#_checkLanguage(code);
    }

    const translate = await this.translateModel.create({
      code: payload.code,
      type: payload.type,
      status: 'inactive',
    });

    for (const item of Object.entries(payload.definition)) {
      const language = await this.languageModel.findOne({ code: item[0] });

      const newDefinition = await this.definitionModel.create({
        languageId: language.id,
        translateId: translate.id,
        value: item[1],
      });

      translate.definitions.push(newDefinition.id);

      newDefinition.save();
    }
    translate.save();
    return translate._id.toString()
  }

  async getSingleTranslateByCode(
    payload: GetSingleTranslateByCodeRequest,
  ): Promise<GetSingleTranslateByCodeResponse> {
    await this.#_checkLanguage(payload.languageCode);
    await this.#_checkTranslateByCode(payload.translateCode);

    const language = await this.languageModel.findOne({
      code: payload.languageCode,
    });

    const translate = await this.translateModel.findOne({code:payload.translateCode});
        
    const definition = await this.definitionModel.findOne({
      languageId: language.id,
      translateId: translate.id,
    });    
    return {
      code: translate.code,
      value: definition?.value
    };
  }

  async getSingleTranslate(
    payload: GetSingleTranslateRequest,
  ): Promise<GetSingleTranslateResponse> {
    await this.#_checkLanguage(payload.languageCode);
    await this.#_checkTranslate(payload.translateId);

    const language = await this.languageModel.findOne({
      code: payload.languageCode,
    });

    const translate = await this.translateModel.findById(payload.translateId);

    const definition = await this.definitionModel.findOne({
      languageId: language.id,
      translateId: translate.id,
    });

    return {
      value: definition?.value,
    };
  }

  async updateTranslate(payload: UpdateTranslateRequest): Promise<String> {
    await this.#_checkTranslate(payload.id);
    const foundedTranslate = await this.translateModel.findById(payload.id);

    if (payload?.status) {
      if (payload.status == 'active' && foundedTranslate.status == 'active') {
        throw new ConflictException('Translate is already in use');
      }

      await this.translateModel.findByIdAndUpdate(foundedTranslate.id, {
        status: payload.status,
      });
    }

    if (payload?.definition) {
      for (const df of foundedTranslate.definitions) {
        await this.definitionModel.findByIdAndDelete(df);
      }

      await this.translateModel.findByIdAndUpdate(payload.id, {
        definitions: [],
      });

      for (const item of Object.entries(payload.definition)) {
        const language = await this.languageModel.findOne({ code: item[0] });
                

        const newDefinition = await this.definitionModel.create({
          languageId: language.id,
          translateId: foundedTranslate.id,
          value: item[1],
        });

        await this.translateModel.findByIdAndUpdate(foundedTranslate.id, {
          $push: { definitions: newDefinition.id },
        });
        newDefinition.save();
        return newDefinition.id
      }
    }
  }

  async updateDefinition(payload: DefinitionUpdateRequest): Promise<void> {
    await this.#_checkID(payload.id);
    const definition = await this.definitionModel.findById(payload.id);

    if (!definition) {
      throw new NotFoundException('Definition not found');
    }

    await this.definitionModel.findByIdAndUpdate(payload.id, {
      value: payload.value,
    });
  }

  async deleteTranslate(id: string) {
    await this.#_checkID(id);

    const translate = await this.translateModel.findById(id);

    await this.definitionModel.deleteMany({ translateId: translate.id });

    await this.translateModel.findByIdAndDelete(id);
  }

  async #_checkLanguage(code: string): Promise<void> {
    const language = await this.languageModel.findOne({ code });

    if (!language) throw new ConflictException(`Language ${code} not found`);
  }

  async #_checkTranslate(id: string): Promise<void> {
    await this.#_checkID(id);
    const translate = await this.translateModel.findById(id);
    

    if (!translate) throw new NotFoundException('Translate not found');
  }

  async #_checkTranslateByCode(code: string): Promise<void> {
    const translate = await this.translateModel.findOne({code:code});
  
    if (!translate) throw new NotFoundException('Translate Code not found');
  }

  async #_checkExistingTranslate(code: string): Promise<void> {
    const translate = await this.translateModel.findOne({
      code,
    });

    if (translate)
      throw new BadRequestException(`Translate ${code} is already available`);
  }

  async #_checkID(id: string): Promise<void> {
    if (!isValidObjectId(id))
      throw new BadRequestException(`${id} is not valid UUID`);
  }
}
