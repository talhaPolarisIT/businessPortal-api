const { Storage } = require('@google-cloud/storage');
const stream = require('stream');
const csv = require('csvtojson');

const GOOGLE_STORAGE_BASE_URL = 'https://storage.googleapis.com';

const storage = new Storage({
  keyFilename: './cloud-storage-config.json',
  projectId: 'pit-dev3',
});

export const upload = async (data, destFileName, bucketName='test-bucket') => {
  // Get a reference to the bucket
  const myBucket = storage.bucket(bucketName);

  const splittedName = destFileName.split('.');
  const fileName = `${splittedName[0]}-${Date.now()}.${splittedName[splittedName.length - 1]}`;

  // Create a reference to a file object
  const file = myBucket.file(fileName);

  // Create a pass through stream from a string
  const passthroughStream = new stream.PassThrough();
  passthroughStream.write(data);
  passthroughStream.end();

  async function streamFileUpload() {
    const promise = new Promise(function (resolve, reject) {
      passthroughStream
        .pipe(file.createWriteStream())
        .on('finish', () => resolve(`${GOOGLE_STORAGE_BASE_URL}/${bucketName}/${fileName}`))
        .on('error', () => reject('Upload not successful.'));
    });
    return promise;
  }

  const url = await streamFileUpload().catch(console.error);
  console.log('`${GOOGLE_STORAGE_BASE_URL}/${bucketName}/${fileName}`: ', `${GOOGLE_STORAGE_BASE_URL}/${bucketName}/${fileName}`);

  return `${GOOGLE_STORAGE_BASE_URL}/${bucketName}/${fileName}`;
};

export const readCsv = async (fileUrl, bucketName) => {
  const splittedFileUrl = fileUrl.split('/');
  const bucket = storage.bucket(bucketName);
  const remoteFile = bucket.file(splittedFileUrl[splittedFileUrl.length - 1]);
  const contents = await remoteFile.download();
  const stringifiedBuffer = contents.toString();
  const list = await csv().fromString(stringifiedBuffer);
  return list;
};
