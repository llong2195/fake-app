import { Injectable } from '@nestjs/common'
import { existsSync, mkdirSync, readFileSync } from 'fs'
import * as fs from 'fs'

@Injectable()
export class AppService {
  updateReview(): boolean {
    if (!existsSync('public')) {
      mkdirSync('public')
    }
    if (!existsSync('public/config')) {
      mkdirSync('public/config')
    }
    if (!existsSync('public/config/config.json')) {
      const data = {
        review: false,
      }
      fs.writeFileSync('public/config/config.json', JSON.stringify(data))
      return false
    }

    const data = fs.readFileSync('public/config/config.json', {
      encoding: 'utf8',
    })

    const config = JSON.parse(data)

    config.review = !config?.review
    fs.writeFileSync('public/config/config.json', JSON.stringify(config))
    return config?.review ? config?.review : false
  }
  getReview(): boolean {
    if (!existsSync('public')) {
      mkdirSync('public')
    }
    if (!existsSync('public/config')) {
      mkdirSync('public/config')
    }
    if (!existsSync('public/config/config.json')) {
      const data = {
        review: false,
      }
      fs.writeFileSync('public/config/config.json', JSON.stringify(data))
      return false
    }

    const data = fs.readFileSync('public/config/config.json', {
      encoding: 'utf8',
    })
    const config = JSON.parse(data)
    // console.log(config)

    return config?.review ? config?.review : false
  }
}
