import { SetMetadata } from '@nestjs/common';

/** Marks a route handler to bypass the global ResponseInterceptor envelope. */
export const SkipResponseWrap = () => SetMetadata('skip_response_wrap', true);
