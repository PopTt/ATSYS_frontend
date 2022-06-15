import { resetSession } from '../../helpers/reset.js';

export const ExA01 = 'Authentication Services Error';
export const ExA02 = 'User not found';
export const ExA03 = 'Duplicate Email';
export const ExA04 = 'Token Expired';
export const ExA05 = 'Token Invalid';

export const ExDB01 = 'Internal Database Error';
export const ExDB02 = 'Item Exist';
export const ExDB03 = 'Cannot Process Item';

export const ExSE01 = 'Cookie Missing';
export const ExSE02 = 'Internal Server Error';

export const ExG01 = 'Bad Request';

export const ErrorCode = (status) => {
  switch (status) {
    case 400:
      throw ExG01;
    case 401:
      resetSession();
      throw ExA04;
    case 405:
      throw ExDB03;
    case 409:
      throw ExDB02;
    case 500:
      throw ExDB01;
    default:
      throw ExDB01;
  }
};
