import { AutoResolverOpts, NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { DynamicModule, Module } from '@nestjs/common';
import { Class } from '@nestjs-query/core';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../auth/auth.guard';
import { TodoItemInputDTO } from './dto/todo-item-input.dto';
import { TodoItemUpdateDTO } from './dto/todo-item-update.dto';
import { TodoItemDTO } from './dto/todo-item.dto';
import { TodoItemEntity } from './todo-item.entity';
import { TodoItemCustomResolver } from './todo-item.resolver';

const guards = [AuthGuard];

interface DTOModuleOpts<DTO> {
  DTOClass: Class<DTO>;
  CreateDTOClass: Class<DTO>;
  UpdateDTOClass: Class<DTO>;
}

@Module({
  imports: [],
  providers: [],
})
export class TodoItemModule {
  static forRoot(opts: { useCustomResolver?: boolean } = {}): DynamicModule {
    const resolvers: AutoResolverOpts<any, any, any, any, any, any>[] = [];
    const providers = [];
    const dtos: DTOModuleOpts<unknown>[] = [];
    if (opts.useCustomResolver === true) {
      providers.push(TodoItemCustomResolver);
      dtos.push({
        DTOClass: TodoItemDTO,
        CreateDTOClass: TodoItemInputDTO,
        UpdateDTOClass: TodoItemUpdateDTO,
      });
    } else {
      resolvers.push({
        DTOClass: TodoItemDTO,
        EntityClass: TodoItemEntity,
        CreateDTOClass: TodoItemInputDTO,
        UpdateDTOClass: TodoItemUpdateDTO,
        create: { guards },
        update: { guards },
        delete: { guards },
      });
    }
    return {
      module: TodoItemModule,
      imports: [
        NestjsQueryGraphQLModule.forFeature({
          imports: [NestjsQueryTypeOrmModule.forFeature([TodoItemEntity]), AuthModule],
          dtos,
          resolvers,
        }),
      ],
      providers: [...providers],
    };
  }
}
