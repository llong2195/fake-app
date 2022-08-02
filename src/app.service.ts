import { Injectable } from '@nestjs/common'
import { existsSync, mkdirSync, readFileSync } from 'fs'
import * as fs from 'fs'

@Injectable()
export class AppService {
  updateReview(id: number): number {
    if (!existsSync('public')) {
      mkdirSync('public')
    }
    if (!existsSync('public/config')) {
      mkdirSync('public/config')
    }
    if (!existsSync('public/config/config.json')) {
      const data = {
        review: id ?? 1,
      }
      fs.writeFileSync('public/config/config.json', JSON.stringify(data))
      return id ?? 1
    }

    const data = fs.readFileSync('public/config/config.json', {
      encoding: 'utf8',
    })

    const config = JSON.parse(data)

    config.review = id
    fs.writeFileSync('public/config/config.json', JSON.stringify(config))
    return config?.review ? config?.review : 1
  }

  getReview(): number {
    if (!existsSync('public')) {
      mkdirSync('public')
    }
    if (!existsSync('public/config')) {
      mkdirSync('public/config')
    }
    if (!existsSync('public/config/config.json')) {
      const data = {
        review: 1,
      }
      fs.writeFileSync('public/config/config.json', JSON.stringify(data))
      return 1
    }

    const data = fs.readFileSync('public/config/config.json', {
      encoding: 'utf8',
    })
    const config = JSON.parse(data)
    // console.log(config)

    return config?.review ? config?.review : 1
  }
}
