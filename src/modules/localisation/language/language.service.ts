import { CreateLanguageRequest, UpdateLanguageRequest } from './interfaces';
import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Language } from './schemas';
import { Model, isValidObjectId } from 'mongoose';
import { MinioService } from '../../../client';

@Injectable()
export class LanguageService {
  constructor(
    @InjectModel(Language.name) private readonly languageModel: Model<Language>,
    private minioService: MinioService,
  ){}

  async createLanguage(payload: CreateLanguageRequest): Promise<void> {
    await this.#_checkExistingLanguage(payload.code);
    const file = await this.minioService.uploadFile({
      file: payload.image,
      bucket: 'food-menu',
    });
    const newLanguage = await this.languageModel.create({
      code: payload.code,
      title: payload.title,
      image_url: file.fileName
    });

    newLanguage.save();
  }

  async getLanguageList(): Promise<Language[]> {
    return await this.languageModel
      .find()
      .select(['title', 'id', 'code', 'image_url'])
      .exec();
  }

  async updateLanguage(payload: UpdateLanguageRequest): Promise<void> {
    await this.#_checkLanguage(payload.id);

    if(payload.title){
      await this.languageModel.findByIdAndUpdate(
        {
          _id: payload.id,
        },
        {
          title: payload.title,
        },
      );
    }

    if(payload.image){
      const deleteImageFile = await this.languageModel.findById(payload.id);
      await this.minioService.removeFile({ fileName: deleteImageFile.image_url }).catch(undefined => undefined);
      const file = await this.minioService.uploadFile({
        file: payload.image,
        bucket: 'food-menu',
      });
      await this.languageModel.findByIdAndUpdate(
        { _id: payload.id },
        {
          image_url: file.fileName,
        },
      );
    }
  }

  async deleteLanguage(id: string): Promise<void> {
    await this.#_checkLanguage(id);

    await this.languageModel.findByIdAndDelete({ _id: id });
  }

  async #_checkExistingLanguage(code: string): Promise<void> {
    const language = await this.languageModel.findOne({
      code,
    });

    if (language) {
      throw new ConflictException(`${language.title} is already available`);
    }
  }

  async #_checkLanguage(id: string): Promise<void> {
    await this.#_checkId(id);
    const language = await this.languageModel.findById(id);

    if (!language) {
      throw new ConflictException(`Language with ${id} is not exists`);
    }
  }

  async #_checkId(id: string): Promise<void> {
    const isValid = isValidObjectId(id);
    if (!isValid) {
      throw new UnprocessableEntityException(`Invalid ${id} Object ID`);
    }
  }
}
