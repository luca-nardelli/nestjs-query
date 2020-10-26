import { DynamicModule } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { createTypegooseQueryServiceProviders } from './providers';
import { TypegooseClass } from 'nestjs-typegoose/dist/typegoose-class.interface';

export class NestjsQueryTypegooseModule {
  static forFeature(models: TypegooseClass[], connectionName?: string): DynamicModule {
    const queryServiceProviders = createTypegooseQueryServiceProviders(models);
    const typegooseModule = TypegooseModule.forFeature(models, connectionName);
    return {
      imports: [typegooseModule],
      module: NestjsQueryTypegooseModule,
      providers: [...queryServiceProviders],
      exports: [...queryServiceProviders, typegooseModule],
    };
  }
}
