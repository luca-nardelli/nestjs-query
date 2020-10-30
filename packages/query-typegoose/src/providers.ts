import { TypegooseClass } from 'nestjs-typegoose/dist/typegoose-class.interface';
import { getQueryServiceToken } from '@nestjs-query/core';
import { FactoryProvider } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { TypegooseQueryService } from './services/typegoose-query-service';

function createTypegooseQueryServiceProvider<Entity extends Base>(model: TypegooseClass): FactoryProvider {
  return {
    provide: getQueryServiceToken(model),
    useFactory(ModelClass: ReturnModelType<new () => Entity>) {
      return new TypegooseQueryService(ModelClass);
    },
    inject: [`${model.name}Model`],
  };
}

export const createTypegooseQueryServiceProviders = (models: TypegooseClass[]): FactoryProvider[] => {
  return models.map((model) => createTypegooseQueryServiceProvider(model));
};
