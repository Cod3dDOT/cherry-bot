import { Attachment } from "discord.js";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.S3_REGION ?? "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

export async function uploadDiscordAttachment(
  attachment: Attachment,
  key: string,
): Promise<void> {
  const response = await fetch(attachment.url);

  if (!response.ok) {
    throw new Error(
      `Failed to download Discord attachment: ${response.status} ${response.statusText}`,
    );
  }

  const body = Buffer.from(await response.arrayBuffer());

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Body: body,
      ContentType:
        // @TODO: Stop blindly trusting `attachment.contentType`
        attachment.contentType ??
        response.headers.get("content-type") ??
        "application/octet-stream",
    }),
  );
}
