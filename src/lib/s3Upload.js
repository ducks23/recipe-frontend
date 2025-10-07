import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1'
})

export const uploadImageToS3 = async (file, folder = 'recipe-images') => {
  if (!file) {
    throw new Error('No file provided')
  }

  const fileExtension = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`

  const params = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    Key: fileName,
    Body: file,
    ContentType: file.type,
    ACL: 'public-read'
  }

  try {
    const result = await s3.upload(params).promise()
    return result.Location
  } catch (error) {
    console.error('Error uploading to S3:', error)
    throw new Error('Failed to upload image to S3')
  }
}

export const deleteImageFromS3 = async (imageUrl) => {
  if (!imageUrl) return

  try {
    const url = new URL(imageUrl)
    const key = url.pathname.substring(1)

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: key
    }

    await s3.deleteObject(params).promise()
  } catch (error) {
    console.error('Error deleting from S3:', error)
    throw new Error('Failed to delete image from S3')
  }
}