import { HttpException, HttpStatus } from '@nestjs/common';

class myResponse {
  response: string;
  code: number;
  httpStatus: HttpStatus;

  constructor(
    response: string = '',
    code: number = 0,
    httpStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    this.response = response;
    this.code = code;
    this.httpStatus = httpStatus;
  }
}

export class ExtendedExceptionEnum {
  static userLoginNoFind = new myResponse('User not found', 101);
  static userLoginToMuch = new myResponse(
    'More then one user with this email',
    102,
  );
  static userLogin_noUserFound = new myResponse('No user found', 103);
  static saveFailFaild = new myResponse('Save file failed', 130);
}

export class ExtendedException extends HttpException {
  constructor(obj: myResponse) {
    super({ response: obj.response, code: obj.code }, obj.httpStatus);
  }
}
