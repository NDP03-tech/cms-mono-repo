import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { DomainException } from '../exceptions/domain.exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.status(422).json({ message: exception.message });
  }
}
