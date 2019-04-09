# HiPDA JS SDK

## 使用文档

使用账号密码认证

```js
import HiPDA from 'hipda-js-sdk'
const hipda = new HiPDA()
await hipda.login('username', 'password')
const threads = await hipda.getTreadList()
// 导出cookie
const serializedCookieJar = hipda.exportCookieJar()
```

使用导出的cookie认证

```js
import HiPDA from 'hipda-js-sdk'
const hipda = new HiPDA(serializedCookieJar)
const threads = await hipda.getTreadList()
```
