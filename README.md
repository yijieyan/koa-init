# koa-init
基于koa2的基础上添加平常开发中必备的中间件进行封装,做到快速的开发。


## Description

> 基于koa添加了[koa-bodyparser](https://www.npmjs.com/package/koa-bodyparser) 解析请求参数、[koa-router](https://www.npmjs.com/package/koa-router)作为路由、[koa-parameter](https://www.npmjs.com/package/koa-parameter) 进行参数的校验、[mongoose](https://mongoosejs.com/)作为链接数据库的中间件、[koa-json-error](https://www.npmjs.com/package/koa-json-error)捕获异常、借助[apidoc](http://apidocjs.com/)生成接口文档。
## Usage
```
$ npm install // 安装依赖
$ npm run dev // 开发环境
$ npm run doc // 生成文档   访问链接:http://localhost:3000
```

## 目录结构介绍

├── README.md
├── apidoc.json // apidoc生成接口文档的配置文件
├── app
│   ├── control  // 控制器(下面全是写的业务逻辑代码)
│   │   ├── home.js
│   │   └── user.js
│   ├── index.js  // 启动文件
│   ├── models  // mongoose的model 文件
│   │   └── user.js
│   └── router  // 路由文件
│       ├── index.js
│       └── v1
│           ├── home.js
│           └── user.js
├── config  // 配置文件
│   └── index.js
├── libs
│   └── db.js // 数据库链接文件
├── package-lock.json
└── package.json

## Licences

>MIT
