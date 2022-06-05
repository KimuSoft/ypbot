import { listener, Module } from '@pikokr/command.ts'
import type { Message } from 'discord.js'
import hangul from 'hangul-js'
import { prisma } from '~/db.server'

class Gumyul extends Module {
  async getRuleRegData(channelId: string) {
    const ypChannel = await prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        rules: {
          include: {
            elements: true,
          },
        },
      },
    })
    if (!ypChannel) return
    if (!ypChannel.rules) return

    interface RuleData {
      whiteRegExp?: RegExp
      whiteElements: string[]
      blackRegExp?: RegExp
      blackElements: string[]
      whiteRegExpSeperated?: RegExp
      whiteElementsSeperated: string[]
      blackRegExpSeperated?: RegExp
      blackElementsSeperated: string[]
    }

    const ruleData: RuleData = {
      whiteRegExp: undefined,
      whiteElements: [],
      blackRegExp: undefined,
      blackElements: [],
      whiteRegExpSeperated: undefined,
      whiteElementsSeperated: [],
      blackRegExpSeperated: undefined,
      blackElementsSeperated: [],
    }

    for (const r of ypChannel.rules) {
      for (const e of r.elements) {
        switch (e.ruleType) {
          case 'White':
            if (!e.regex) continue
            if (e.isSeparation) {
              ruleData.whiteElementsSeperated.push(e.regex)
            } else {
              ruleData.whiteElements.push(e.regex)
            }
            break
          case 'Black':
            if (!e.regex) continue
            if (e.isSeparation) {
              ruleData.blackElementsSeperated.push(e.regex)
            } else {
              ruleData.blackElements.push(e.regex)
            }
        }
      }
    }

    // join with '|'
    ruleData.whiteRegExp = ruleData.whiteElements.length
      ? new RegExp(ruleData.whiteElements.join('|'))
      : undefined
    ruleData.blackRegExp = ruleData.blackElements.length
      ? new RegExp(ruleData.blackElements.join('|'))
      : undefined
    ruleData.whiteRegExpSeperated = ruleData.whiteElementsSeperated.length
      ? new RegExp(ruleData.whiteElementsSeperated.join('|'))
      : undefined
    ruleData.blackRegExpSeperated = ruleData.blackElementsSeperated.length
      ? new RegExp(ruleData.blackElementsSeperated.join('|'))
      : undefined

    return ruleData
  }

  @listener('messageCreate')
  async gumyul(msg: Message) {
    console.log('우아앙')
    if (msg.author.bot) return

    // WHITELIST (해당하지 않으면 제재) 모두 regexp 하나로 합침. 자모분리는 된 거랑 안 된 거 분리
    // BLACKLIST (해당하면 제재) 모두 regexp 하나로 합침. 자모분리는 된 거랑 안 된 거 분리
    const ruleData = await this.getRuleRegData(msg.channel.id)
    if (!ruleData) return console.log('규칙이 업서')
    console.log(JSON.stringify(ruleData))

    const replacedKeyword = msg.content.replace(
      /[~!@#\$%\^&\*\(\)_\|\+\-=\?;:'",\.<>{}\[\]\\]/gi,
      ''
    )
    const separatedKeyword = hangul.disassembleToString(replacedKeyword)

    // 화이트리스트 정규식에 맞지 않는 경우
    if (ruleData.whiteRegExp && !ruleData.whiteRegExp.test(replacedKeyword)) {
      return await msg.reply('하얀 때찌!')
    }
    if (ruleData.blackRegExp && ruleData.blackRegExp.test(replacedKeyword)) {
      return await msg.reply('검은 때찌!')
    }
    if (
      ruleData.whiteRegExpSeperated &&
      !ruleData.whiteRegExpSeperated.test(separatedKeyword)
    ) {
      return await msg.reply('ㅎㅏㅇㅑㄴ ㄷㄷㅐㅈㅈㅣ!')
    }
    if (
      ruleData.blackRegExpSeperated &&
      ruleData.blackRegExpSeperated.test(separatedKeyword)
    ) {
      return await msg.reply('ㄱㅓㅁㅇㅡㄴ ㄷㄷㅐㅈㅈㅣ')
    }
  }
}

export function install() {
  return new Gumyul()
}
