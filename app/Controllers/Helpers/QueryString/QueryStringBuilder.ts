import { LucidModel, LucidRow, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { QueryStringParams } from './QueryStringParams'
import Logger from '@ioc:Adonis/Core/Logger'

export type ExecCallback = (builder: QueryStringBuilder) => any

export class QueryStringBuilder {
  public qsParams: QueryStringParams

  public page = 1

  private isLogEnabled = false

  private get logger() {
    if (this.isLogEnabled) {
      return Logger
    }

    return undefined
  }

  constructor(
    qs: Record<string, any>,
    public query: ModelQueryBuilderContract<LucidModel, LucidRow>,
    private isParent: boolean
  ) {
    this.qsParams = new QueryStringParams(qs)
  }

  public static build(
    qs: Record<string, any>,
    query: ModelQueryBuilderContract<LucidModel, LucidRow>,
    isParent = true
  ) {
    return new QueryStringBuilder(qs, query, isParent)
  }

  public async returnsParent() {
    this.logger?.info(`[QUERY_STRING_BUILDER][PARENT][${this.query.toSQL().sql}]`)
    return this.query.paginate(this.page, this.qsParams.limit() || 20)
  }

  public async returnsPreload() {
    this.logger?.info(
      `[QUERY_STRING_BUILDER][PRELOAD][IS_PARENT=${this.isParent}][${this.query.toSQL().sql}]`
    )
    return this.query
  }

  private async execChild() {
    this.query.select(...this.qsParams.fields())

    await this.applyLimit()
    await this.applyWhereIn()
    await this.applyStartsWith()
    await this.applyEndsWith()
    await this.applyWhereNotIn()
    await this.applyDistinct()
    await this.applyCounters()
    await this.applyOrderBy()
    await this.applyWhereOperator(this.qsParams.greaterOrEquals(), '>=')
    await this.applyWhereOperator(this.qsParams.greaterThan(), '>')
    await this.applyWhereOperator(this.qsParams.lessOrEquals(), '<=')
    await this.applyWhereOperator(this.qsParams.lessThan(), '<')
    await this.applyPage()
    await this.applyBetween()

    await this.applyPreloaders()

    return await this.query.exec()
  }

  private async execParent() {
    this.query.select(...this.qsParams.fields())

    await this.applyLimit()
    await this.applyWhereIn()
    await this.applyStartsWith()
    await this.applyEndsWith()
    await this.applyWhereNotIn()
    await this.applyWhereNull()
    await this.applyWhereNotNull()
    await this.applyDistinct()
    await this.applyCounters()
    await this.applyOrderBy()
    await this.applyWhereOperator(this.qsParams.greaterOrEquals(), '>=')
    await this.applyWhereOperator(this.qsParams.greaterThan(), '>')
    await this.applyWhereOperator(this.qsParams.lessOrEquals(), '<=')
    await this.applyWhereOperator(this.qsParams.lessThan(), '<')
    await this.applyPage()
    await this.applyBetween()

    await this.applyPreloaders()

    return await this.query.paginate(this.qsParams.page() || 1, this.qsParams.limit() || 20)
  }

  public async exec() {
    if (Object.values(this.qsParams.all()).length <= 0) return

    if (this.isParent) {
      return await this.execParent()
    } else {
      return await this.execChild()
    }
  }

  public async applyWhereNull() {
    const nullables = this.qsParams.whereNull()
    if (!nullables) return
    for (const field of nullables) {
      this.query.whereNull(field)
    }
  }

  public async applyWhereNotNull() {
    const notNullables = this.qsParams.whereNotNull()
    if (!notNullables) return
    for (const field of notNullables) {
      this.query.whereNotNull(field)
    }
  }

  private async applyPreloaders() {
    const preloaders = this.qsParams.preloaders()
    if (!preloaders) return
    for (const preloader in preloaders) {
      const qsPreloaderParams = preloaders[preloader]
      await this.query.preload<any>(preloader, async (query) => {
        await QueryStringBuilder.build(qsPreloaderParams, query, false).exec()
      })
    }
  }

  private async applyCounters() {
    const counters = this.qsParams.counters()
    if (!counters) return
    for (const counter of counters) {
      this.query = this.query.withCount(counter)
    }
  }

  private async applyPage() {
    const page = this.qsParams.page()
    if (!page) return
    this.page = page
  }

  public async applyLimit() {
    const limit = this.isParent ? this.qsParams.limit() || 20 : this.qsParams.limit()
    if (!limit) return
    this.query.limit(limit)
  }

  private async applyBetween() {
    const between = this.qsParams.whereBetween()
    for (const keyBetween in between) {
      const valBetween = between[keyBetween]
      this.query.whereBetween(keyBetween, valBetween)
    }
  }

  private async applyWhereIn() {
    const whereIn = this.qsParams.whereIn()
    for (const keyIn in whereIn) {
      const valIn = whereIn[keyIn]
      this.query.whereIn(keyIn, valIn)
    }
  }

  private async applyWhereNotIn() {
    const whereNotIn = this.qsParams.whereNotIn()
    for (const keyIn in whereNotIn) {
      const valIn = whereNotIn[keyIn]
      this.query.whereNotIn(keyIn, valIn)
    }
  }

  private async applyWhereOperator(qs: any, operator: string) {
    for (const keyQs in qs) {
      const valQs = qs[keyQs]
      this.query.where(keyQs, operator, valQs)
    }
  }

  private async applyOrderBy() {
    const orders = this.qsParams.orderBy()

    if (!orders) return

    for (const orderField in orders) {
      const direction = orders[orderField]
      this.query.orderBy(orderField, direction)
    }
  }

  private async applyDistinct() {
    const distincts = this.qsParams.distincts()
    if (!distincts) return
    this.query.groupBy(...distincts)
  }

  private async applyStartsWith() {
    const startsWith = this.qsParams.startsWith()
    if (!startsWith) return

    for (const startsWithField in startsWith) {
      let filterIndex = 0
      const startsWithValues = startsWith[startsWithField]
      for (const startWithValue of startsWithValues) {
        if (filterIndex === 0) {
          this.query.where(startsWithField, 'like', `${startWithValue}%`)
        } else {
          this.query.orWhere(startsWithField, 'like', `${startWithValue}%`)
        }

        filterIndex++
      }
    }
  }

  private async applyEndsWith() {
    const endsWith = this.qsParams.endsWith()
    if (!endsWith) return

    for (const endsWithField in endsWith) {
      let filterIndex = 0
      const endsWithValues = endsWith[endsWithField]
      for (const endWithValue of endsWithValues) {
        if (filterIndex === 0) {
          this.query.where(endsWithField, 'like', `%${endWithValue}`)
        } else {
          this.query.orWhere(endsWithField, 'like', `%${endWithValue}`)
        }

        filterIndex++
      }
    }
  }
}
