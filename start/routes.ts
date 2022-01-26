import { listContactsByWppPhoneRoute } from '@infra/factories/routes/api/contacts/listContactsByWppPhoneRoute'
import { createOrganizationQsRoute } from '@infra/factories/routes/api/organization/createOrganizationQsRoute'
import { generateQrCodeRoute } from '@infra/factories/routes/api/wpp-phones/generateQrCodeRoute'
import { listWppPhonesRoute } from '@infra/factories/routes/api/wpp-phones/listWppPhonesRoute'
import { apiAuthRoute } from '@infra/factories/routes/auth/apiAuthRoute'
import { getAuthRoute } from '@infra/factories/routes/auth/getAuthRoute'
import Route from '@ioc:Adonis/Core/Route'

Route.post('/auth/login', apiAuthRoute)

Route.group(() => {
  Route.group(() => {
    Route.get('/auth', getAuthRoute)
    Route.get('/api/organizations', createOrganizationQsRoute)
  }).middleware(['auth'])

  Route.group(() => {
    Route.post('/api/phones/qr', generateQrCodeRoute)
    Route.get('/api/phones', listWppPhonesRoute)

    Route.get('/api/phones/:phoneId/contacts', listContactsByWppPhoneRoute)
  }).middleware(['org.header:force'])
}).middleware(['auth.org'])
