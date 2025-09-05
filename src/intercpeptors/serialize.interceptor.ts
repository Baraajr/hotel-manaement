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
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: any) => {
        let transformedData = data;

        // If data is array -> map over it
        if (Array.isArray(data)) {
          transformedData = data.map((item) =>
            plainToInstance(this.dto, item, { excludeExtraneousValues: true }),
          );
        }
        // If data is object -> transform directly
        else if (data && typeof data === 'object') {
          transformedData = plainToInstance(this.dto, data, {
            excludeExtraneousValues: true,
          });
        }

        // Wrap with ResponseDto
        const response: ResponseDto = {
          status: 'success',
          message: 'Request processed successfully',
          data: transformedData,
        };

        return response;
      }),
    );
  }
}
