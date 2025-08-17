import {
  condition,
  defineSignal,
  proxyActivities,
  setHandler,
} from '@temporalio/workflow';

import type * as activities from './user-registration.activities';

// Activities

const { activitySendEmailVerificationEmail } = proxyActivities<
  typeof activities
>({
  startToCloseTimeout: '10 seconds',
});

// Signals

export const signalEmailVerified = defineSignal('signalEmailVerified');

/**
 * Workflow steps
 *
 * 1. User registered => send email verification email
 * 2. Email verified => finish workflow
 *
 * Workflow is finished when `isFullyRegistered === true`
 */
export async function userRegistrationWorkflow(userId: string): Promise<void> {
  let isFullyRegistered = false;

  // 1. User registered => send email verification email
  await activitySendEmailVerificationEmail(userId);

  // TODO: add it in the code
  // 2. Email verified => finish workflow
  setHandler(signalEmailVerified, () => {
    isFullyRegistered = true;
  });

  // if condition is true then workflow will finish
  await Promise.race([condition(() => isFullyRegistered)]);
}
