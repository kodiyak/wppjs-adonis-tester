import {
  LucidModel,
  LucidRow,
  ManyToManyQueryBuilderContract,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { QueryStringBuilder } from './QueryStringBuilder'
import Database from '@ioc:Adonis/Lucid/Database'

class QueryBuilderController {
  public async run(
    request: RequestContract,
    query:
      | ModelQueryBuilderContract<LucidModel, LucidRow>
      | ManyToManyQueryBuilderContract<LucidModel, LucidRow>
  ) {
    const trx = await Database.transaction()

    const builder = QueryStringBuilder.build(request.qs(), query.useTransaction(trx))
    try {
      const execution = await builder.exec()
      await trx.commit()

      return execution
    } catch (e) {
      return {
        message: `${e}`,
        params: builder.qsParams.all(),
      }
    }
  }
}

export default new QueryBuilderController()
