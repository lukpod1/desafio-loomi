import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class S3Service {
  private s3: S3;
  constructor() {
    this.s3 = new S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: file.originalname,
      Body: file.buffer,
    };

    return await this.s3.upload(params).promise();
  }
}
