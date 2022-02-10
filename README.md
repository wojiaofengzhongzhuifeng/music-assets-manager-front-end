# 项目作用

目前负责的是音乐 app 的音乐资产后台管理前端开发, 现在的想法是完全掌握音乐资产的数据流向,包括数据爬虫, 后端接口开发, 前端后台管理系统页面开发, 本项目属于前端后台管理系统页面开发

# 后台管理系统功能

- 支持 mock 服务
- 国际化
- 完备的类型检查
- 区分 staging 与 prod 环境

# 数据库结构

## artist 表结构

| id(number) | artistName(string) | creation(string) | updated(number) | grade(enum: Grade) | songIds(string) | status(enum: Status) |
| ---------- | ------------------ | ---------------- | --------------- | ------------------ | --------------- | -------------------- |
| 1          | 周杰伦             | 'BR,CN,AR'       | 1642684734555   | 1642684742994      | S               | '1,2,3'              |[](https://)

```
enum Grade {
  s,
  a,
  b,
  c,
  d,
}[](https://)
enum Status{
  on = 'on',
  off = 'off'
}
```

