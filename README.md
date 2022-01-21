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

