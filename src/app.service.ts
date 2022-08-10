import { Injectable } from '@nestjs/common'
import { existsSync, mkdirSync, readFileSync } from 'fs'
import * as fs from 'fs'

@Injectable()
export class AppService {
  updateView(url: string, url_ios: string): { url: string; url_ios: string } {
    if (!existsSync('public')) {
      mkdirSync('public')
    }
    if (!existsSync('public/config')) {
      mkdirSync('public/config')
    }
    if (!existsSync('public/config/config-webview.json')) {
      const data = {
        url: 'https://en.wikipedia.org/wiki/Social',
        url_ios: 'https://en.wikipedia.org/wiki/Social',
      }
      fs.writeFileSync(
        'public/config/config-webview.json',
        JSON.stringify(data),
      )
      return data
    }

    const data = fs.readFileSync('public/config/config-webview.json', {
      encoding: 'utf8',
    })

    const config = JSON.parse(data)

    config.url = url ?? config.url
    config.url_ios = url_ios ?? config.url_ios
    fs.writeFileSync(
      'public/config/config-webview.json',
      JSON.stringify(config),
    )
    return config
  }

  getView(): { url: string; url_ios: string } {
    if (!existsSync('public')) {
      mkdirSync('public')
    }
    if (!existsSync('public/config')) {
      mkdirSync('public/config')
    }
    if (!existsSync('public/config/config-webview.json')) {
      const data = {
        url: 'https://en.wikipedia.org/wiki/Social',
        url_ios: 'https://en.wikipedia.org/wiki/Social',
      }
      fs.writeFileSync(
        'public/config/config-webview.json',
        JSON.stringify(data),
      )
      return data
    }

    const data = fs.readFileSync('public/config/config-webview.json', {
      encoding: 'utf8',
    })
    const config = JSON.parse(data)
    // console.log(config)

    return config
  }

  updateReview(
    verAndroid: number,
    verIOS: number,
  ): { Android: number; IOS: number } {
    if (!existsSync('public')) {
      mkdirSync('public')
    }
    if (!existsSync('public/config')) {
      mkdirSync('public/config')
    }
    if (!existsSync('public/config/config.json')) {
      const data = {
        Android: verAndroid ?? 1,
        IOS: verIOS ?? 1,
      }
      fs.writeFileSync('public/config/config.json', JSON.stringify(data))
      return data
    }

    const data = fs.readFileSync('public/config/config.json', {
      encoding: 'utf8',
    })

    const config = JSON.parse(data)

    config.Android = verAndroid ?? config.Android
    config.IOS = verIOS ?? config.IOS
    fs.writeFileSync('public/config/config.json', JSON.stringify(config))
    return config ? config : { Android: verAndroid ?? 1, IOS: verIOS ?? 1 }
  }

  getReview(): { Android: number; IOS: number } {
    if (!existsSync('public')) {
      mkdirSync('public')
    }
    if (!existsSync('public/config')) {
      mkdirSync('public/config')
    }
    if (!existsSync('public/config/config.json')) {
      const data = {
        Android: 1,
        IOS: 1,
      }
      fs.writeFileSync('public/config/config.json', JSON.stringify(data))
      return data
    }

    const data = fs.readFileSync('public/config/config.json', {
      encoding: 'utf8',
    })
    const config = JSON.parse(data)
    // console.log(config)

    return config ? config : { Android: 1, IOS: 1 }
  }
}
