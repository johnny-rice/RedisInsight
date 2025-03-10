import { Injectable } from '@nestjs/common';
import { SessionMetadata } from 'src/common/models';

@Injectable()
export abstract class ConstantsProvider {
  /**
   * Should return hardcoded SessionMetadata for cases when it is not possible to determine the user
   * For example onModuleInit step or in some automatic actions generated by system
   */
  abstract getSystemSessionMetadata(): SessionMetadata;

  /**
   * Should return generated anonymous id based on sessionMetadata or default value
   * @param sessionMetadata
   */
  abstract getAnonymousId(sessionMetadata?: SessionMetadata): string;
}
