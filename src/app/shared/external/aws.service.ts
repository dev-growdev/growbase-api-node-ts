import { S3 } from '@aws-sdk/client-s3';
import { awsEnvironments } from '@envs/.';
import { randomUUID } from 'crypto';

export class AwsService {
  private client: S3;

  constructor() {
    this.client = new S3({
      region: awsEnvironments.AWS_REGION,
      credentials: {
        accessKeyId: awsEnvironments.AWS_ACCESS_KEY_ID,
        secretAccessKey: awsEnvironments.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  // async upload(base64: string): Promise<string> {
  //   const fileKey = randomUUID();

  //   const extension = base64.split(';')[0].replace('data:', '');

  //   const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');

  //   await this.client.putObject({
  //     Bucket: awsEnvironments.BUCKET_NAME,
  //     Key: fileKey,
  //     Body: buffer,
  //     ContentType: extension,
  //   });

  //   return fileKey;
  // }

  async upload(base64: string): Promise<string> {
    console.log(base64);
    return randomUUID();
  }
}
