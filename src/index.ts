import * as urlencode from 'urlencode'
import * as qs from 'query-string'
import * as cheerio from 'cheerio'
import * as got from 'got'
import { CookieJar } from 'tough-cookie'
import * as iconv from 'iconv-lite'
import { UA } from './constants'

export default class HiPDA {
  cookieJar: CookieJar
  request: got.GotInstance<got.GotBodyFn<string>>
  constructor(serializedCookieJar?: string) {
    if (serializedCookieJar) {
      this.cookieJar = CookieJar.fromJSON(serializedCookieJar)
    } else {
      this.cookieJar = new CookieJar()
    }
    this.request = got.extend({
      baseUrl: 'https://www.hi-pda.com/forum',
      cookieJar: this.cookieJar,
      encoding: null,
      headers: {
        'User-Agent': UA
      },
      hooks: {
        afterResponse: [
          response => {
            const decodedBody = iconv.decode(<Buffer>response.body, 'GBK')
            response.body = decodedBody
            return response
          }
        ]
      }
    })
  }
  /**
   * login
   */
  public async login(username: string, password: string) {
    await this.request.get('/index.php')
    const loginForm = {
      username,
      password,
      questionid: '0',
      loginfield: 'username'
    }
    await this.request.post('/logging.php?action=login&loginsubmit=yes', {
      body: urlencode.stringify(loginForm, { charset: 'gbk' }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }
  /**
   * getTreadList 获取帖子列表
   * @param fid 版块ID
   */
  public async getTreadList(fid: string = '2'): Promise<string[]> {
    const resp = await this.request.get('/forumdisplay.php', {
      query: qs.stringify({ fid })
    })
    const $ = cheerio.load(resp.body)
    const threads: string[] = $('.listcon a[href^="viewthread"]')
      .map((_, el) => $(el).text())
      .get()
    return threads
  }
  /**
   * 导出CookieJar
   */
  public exportCookieJar() {
    return this.cookieJar.toJSON()
  }
  /**
   * 导入CookieJar
   */
  public importCookieJar(serializedCookieJar: string) {
    this.cookieJar = CookieJar.fromJSON(serializedCookieJar)
  }
}
