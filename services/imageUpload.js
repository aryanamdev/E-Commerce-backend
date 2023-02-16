import s3 from "../config/s3.config";

export const uploadFile = async ({ bucketName, key, body, contentType }) => {
  return await s3
    .upload({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
    .promise();
};

export const deleteFile = async ({ bucketName, key }) => {
  return await s3
    .deleteBucket({
      Bucket: bucketName,
      Key: key,
    })
    .promise();
};
