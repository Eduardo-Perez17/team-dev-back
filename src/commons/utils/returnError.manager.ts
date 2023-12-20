import { ErrorManager } from './error.manager';

export const returnErrorManager = ({ user }) => {
  if (!user) {
    throw new ErrorManager({
      type: 'NOT_FOUND',
      message: 'This user not found',
    });
  }
};
