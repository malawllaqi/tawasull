import { S3Client } from "@aws-sdk/client-s3";
// import type { MultipartFile } from "@fastify/multipart";
import { env } from "./env";

// const BUCKET_NAME = env.BUCKET_NAME;

export const s3 = new S3Client({
	region: env.BUCKET_REGION,

	credentials: {
		accessKeyId: env.AWS_ACCESS_KEY,
		secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
	},
});
