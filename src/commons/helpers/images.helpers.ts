import { ErrorManager } from '../utils/error.manager';

export const renameImage = (req, file, callback) => {
  try {
    const name = file.originalname.split('.')[0];
    const fileName = file.originalname;
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');

    callback(null, `${name}-${randomName}${fileName}`);
  } catch (error) {
    throw new ErrorManager.createSignatureError(error.message);
  }
};

export const fileFilter = (req, file, callback) => {
  try {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
      throw new ErrorManager.createSignatureError('Invalid extends');

    callback(null, true);
  } catch (error) {
    throw ErrorManager.createSignatureError(error.message);
  }
};
