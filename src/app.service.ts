import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  // isOwner(): Boolean {
  //     if (req.session.is_logined) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   },
  //   statusUI: function (req, res) {
  //     var authStatusUI = '로그인후 사용 가능합니다'
  //     if (this.isOwner(req, res)) {
  //       authStatusUI = `${req.session.name}님 환영합니다 | <a href="/auth/logout">로그아웃</a>`;
  //     }
  //     return authStatusUI;
  //   }
}
