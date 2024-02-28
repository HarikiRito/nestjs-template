import amqp from 'amqplib'

export class AMQPUtilities {
  static convertMessage(msg: amqp.ConsumeMessage | null) {
    if (!msg) {
      return null
    }

    const content = msg.content.toString()
    try {
      return JSON.parse(content, JSONDateParser())
    } catch (e) {
      return content
    }
  }
}

function JSONDateParser() {
  const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/
  const reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/

  function parseDate(key: string, value: unknown) {
    if (typeof value === 'string') {
      let a = reISO.exec(value)
      if (a) return new Date(value)
      a = reMsAjax.exec(value)
      if (a) {
        const b = a[1].split(/[-+,.]/)
        return new Date(b[0] ? +b[0] : 0 - +b[1])
      }
    }
    return value
  }

  return parseDate
}
