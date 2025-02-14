/* eslint-disable @typescript-eslint/no-misused-promises */

import nodemailer from 'nodemailer';
import mailgunTransport from 'nodemailer-mailgun-transport';

import Bull, { type Queue, type Job } from 'bull';

import { mailgunCred } from './MailerComponent';

export class mailQueue {
  private mailList: Queue;

  constructor() {
    this.mailList = new Bull('sendmail', process.env.CACHE_URL);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.mailList.process('sendmail', async (job: Job) => {
      const mailgunner = nodemailer.createTransport(
        mailgunTransport(mailgunCred),
      );

      await mailgunner.sendMail(job.data);
    });
  }

  async send(data: {
    from: {
      name: string;
      address: string;
    };
    to: string;
    subject: string;
    html: string;
  }) {
    try {
      await this.mailList.add('sendmail', data, {
        attempts: 2,
      });

      this.mailList.on('failed', async (job: Job) => {
        if (job.attemptsMade >= (job?.opts?.attempts || 0)) {
          await job.remove();
        }
      });

      this.mailList.on('completed', async (job: Job) => {
        await job.remove();
      });
    } catch (error: any) {
      throw error;
    }
  }
}
