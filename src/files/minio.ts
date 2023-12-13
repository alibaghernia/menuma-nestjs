import { Client } from 'minio';

const { S3_URI } = process.env;

export let minio: Client | null = null;

if (S3_URI) {
  const s3Uri = new URL(S3_URI);
  minio = new Client({
    endPoint: s3Uri.hostname,
    port: s3Uri.port ? Number(s3Uri.port) : 9000,
    useSSL: s3Uri.protocol.startsWith('https'),
    accessKey: decodeURIComponent(s3Uri.username),
    secretKey: decodeURIComponent(s3Uri.password),
  });
} else {
  console.log('S3_URI is not defined');
}
