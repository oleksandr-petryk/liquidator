import { sleep } from '@temporalio/activity';

export async function sendEmailVerificationEmailActivity(
  userId: string,
): Promise<void> {
  await sleep(1000);

  console.log('Sending email verification email to user with ID:', userId);
}
