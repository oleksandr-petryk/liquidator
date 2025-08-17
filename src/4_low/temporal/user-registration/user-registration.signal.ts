import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import {
  signalEmailVerified,
  userRegistrationWorkflow,
} from '../../../1_control/workflows/user-registration.workflow';
import { APP_TEMPORAL_WORKER_TASK_QUEUE } from '../../../5_shared/config/const/app.const';
import { TemporalService } from '../temporal.service';

@Injectable()
export class UserRegistrationSignal {
  constructor(
    private readonly logger: PinoLogger,
    private readonly temporalService: TemporalService,
  ) {}

  async trigger(userId: string): Promise<void> {
    const workflowId = UserRegistrationSignal.getWorkflowId(userId);

    this.logger.debug(
      `trigger userRegistrationWorkflow workflowId: ${workflowId}`,
    );

    const client = await this.temporalService.getClient();
    await client.workflow.start(userRegistrationWorkflow, {
      taskQueue: APP_TEMPORAL_WORKER_TASK_QUEUE,
      workflowId,
      args: [userId],
    });
  }

  async signalEmailVerified(userId: string): Promise<void> {
    this.logger.debug(`signalEmailVerified userId: ${userId}`);

    try {
      const client = await this.temporalService.getClient();
      const handle = client.workflow.getHandle(
        UserRegistrationSignal.getWorkflowId(userId),
      );

      await handle.signal(signalEmailVerified);
    } catch (err) {
      this.logger.error(
        `Unable to signalEmailVerified for userId: ${userId} - err: ${err}`,
      );
    }
  }

  static getWorkflowId(userId: string): string {
    return `user-registration-${userId}`;
  }
}
