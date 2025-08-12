import { proxyActivities } from '@temporalio/workflow';

import type * as activities from './auth.activities';

const { sendEmailVerificationEmailActivity } = proxyActivities<
  typeof activities
>({
  startToCloseTimeout: '1 minute',
});

export async function userRegistrationWorkflow(userId: string): Promise<void> {
  await sendEmailVerificationEmailActivity(userId);
}
