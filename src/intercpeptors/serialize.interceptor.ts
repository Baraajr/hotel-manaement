import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { ResponseDto } from '../dtos/response.dto';

interface ClassConstructor {
  new (...args: any[]): object;
}

export const Serialize = (dto: ClassConstructor) => {
  return UseInterceptors(new SerializeInterceptor(dto));
};

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((res: any) => {
        const { data, message } = res;

        let transformedData = data;

        // Array case
        if (Array.isArray(data)) {
          transformedData = data.map((item) =>
            plainToInstance(this.dto, item, { excludeExtraneousValues: true }),
          );
        }
        // Object case
        else if (data && typeof data === 'object') {
          transformedData = plainToInstance(this.dto, data, {
            excludeExtraneousValues: true,
          });
        }

        const response: ResponseDto = {
          status: 'success',
          message: message || 'Success', // fallback
          data: transformedData,
        };

        return response;
      }),
    );
  }
}
