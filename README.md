# koa-init
基于koa2的基础上添加平常开发中必备的中间件进行封装,做到快速的开发。


## Description

> 基于koa添加了[koa-bodyparser](https://www.npmjs.com/package/koa-bodyparser) 解析请求参数、[koa-router](https://www.npmjs.com/package/koa-router)作为路由、[koa-parameter](https://www.npmjs.com/package/koa-parameter) 进行参数的校验、[mongoose](https://mongoosejs.com/)作为链接数据库的中间件、[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)生成jwt token进行权限校验、[bcryptjs](https://www.npmjs.com/package/bcryptjs)加密用户密码,[apidoc](https://www.npmjs.com/package/apidoc)生成接口文档,[log4js](https://www.npmjs.com/package/log4js)记录日志文件。
## Usage
```
$ npm install // 安装依赖
$ npm run dev // 开发环境
$ npm run doc // 生成文档   访问链接:http://localhost:3000
```

## 目录结构介绍
```
├── README.md
├── apidoc.json
├── app
│   ├── control
│   │   ├── home.js
│   │   └── user.js
│   ├── index.js
│   ├── models
│   │   ├── file.js
│   │   └── user.js
│   └── router
│       ├── index.js
│       └── v1
│           ├── home.js
│           └── user.js
├── config
│   └── index.js
├── libs
│   ├── db.js
│   └── token.js
├── middlewares
│   ├── auth.js
│   └── error.js
├── package-lock.json
└── package.json
```

## apidoc文档发送ajax的content-type改为:application/json
>koa-init/node_modules/apidoc/template/utils/send_sample_request.js 路径下修改send_sample_request.js 96行
```
var ajaxRequest = {
  url: url,
  headers: header,
  dataType: "json",
  contentType: "application/json",
  data: JSON.stringify(param),
  type: type.toUpperCase(),
  success: displaySuccess,
  error: displayError
};
```

## Licences

>MIT
