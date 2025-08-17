import type { NestFastifyApplication } from '@nestjs/platform-fastify';

import { AuthService } from '../../2_service/auth/auth.service';

class UserRegistrationWorkflowActivities {
  constructor(private readonly authService: AuthService) {}

  async activitySendEmailVerificationEmail(
    userId: string,
  ): Promise<void | never> {
    // return await this.authService.sendVerificationEmail(userId);
  }
}

let instance: UserRegistrationWorkflowActivities;

// Singleton pattern
export function setupUserRegistrationActivities(
  app: NestFastifyApplication,
): void {
  const draftActivitiesService = app.get(AuthService);
  instance = new UserRegistrationWorkflowActivities(draftActivitiesService);
}

// Activities

export const activitySendEmailVerificationEmail = (
  ...args: Parameters<
    UserRegistrationWorkflowActivities['activitySendEmailVerificationEmail']
  >
): ReturnType<
  UserRegistrationWorkflowActivities['activitySendEmailVerificationEmail']
> => instance.activitySendEmailVerificationEmail(...args);
