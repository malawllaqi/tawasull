import { randomBytes } from "node:crypto";
import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import sharp, { type ResizeOptions } from "sharp";
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

export async function uploadImage({
	file,
	resizeOps,
}: {
	file: File;
	resizeOps?: ResizeOptions;
}) {
	const randomImageName = randomBytes(32).toString("hex");
	const bufferFile = await file.arrayBuffer();

	const buffer = await sharp(bufferFile).resize(resizeOps).toBuffer();

	const command = new PutObjectCommand({
		Bucket: env.BUCKET_NAME,
		Body: buffer,
		Key: randomImageName,
		ContentType: file.type,
	});

	const newMedia = await s3.send(command);

	return { ...newMedia, key: randomImageName };
}

export async function deleteImage({ objectKey }: { objectKey: string }) {
	return await s3.send(
		new DeleteObjectCommand({
			Bucket: env.BUCKET_NAME,
			Key: objectKey,
		})
	);
}
