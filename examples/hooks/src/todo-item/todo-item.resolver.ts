import { InjectQueryService, mergeFilter, QueryService, UpdateManyResponse } from '@nestjs-query/core';
import {
  CRUDResolver,
  HookInterceptor,
  HookTypes,
  MutationHookArgs,
  UpdateManyResponseType,
} from '@nestjs-query/query-graphql';
import { UseInterceptors } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { TodoItemDTO } from './dto/todo-item.dto';
import { TodoItemEntity } from './todo-item.entity';
import { UpdateManyTodoItemsArgs } from './types';
import { AuthGuard } from '../auth/auth.guard';
import { TodoItemInputDTO } from './dto/todo-item-input.dto';
import { TodoItemUpdateDTO } from './dto/todo-item-update.dto';

@Resolver(() => TodoItemDTO)
export class TodoItemResolver {
  constructor(@InjectQueryService(TodoItemEntity) readonly service: QueryService<TodoItemDTO>) {}

  // Set the return type to the TodoItemConnection
  @Mutation(() => UpdateManyResponseType())
  @UseInterceptors(HookInterceptor(HookTypes.BEFORE_UPDATE_MANY, TodoItemDTO, TodoItemUpdateDTO))
  markTodoItemsAsCompleted(@MutationHookArgs() { input }: UpdateManyTodoItemsArgs): Promise<UpdateManyResponse> {
    return this.service.updateMany(
      { ...input.update, completed: false },
      mergeFilter(input.filter, { completed: { is: false } }),
    );
  }
}

const guards = [AuthGuard];

@Resolver(() => TodoItemDTO)
export class TodoItemCustomResolver extends CRUDResolver(TodoItemDTO, {
  CreateDTOClass: TodoItemInputDTO,
  UpdateDTOClass: TodoItemUpdateDTO,
  create: { guards },
  update: { guards },
  delete: { guards },
}) {
  constructor(@InjectQueryService(TodoItemEntity) readonly service: QueryService<TodoItemDTO>) {
    super(service);
  }
}
