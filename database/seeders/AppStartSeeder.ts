import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Organization from 'App/Models/Organization'
import PersonInfo from 'App/Models/PersonInfo'
import Tag from 'App/Models/Tag'
import User from 'App/Models/User'
import WppPhone from 'App/Models/WppPhone'

export default class AppStartSeederSeeder extends BaseSeeder {
  public async run() {
    const user = await this.createMasterUser()
    const organization = await this.createAppOrganization(user)
    // const number5511991174114 = await this.createWppPhone(organization, '5511991174114', true)
    const number5511991174115 = await this.createWppPhone(organization, '5511991174115')
    // const number5511991174116 = await this.createWppPhone(organization, '5511991174116', true)
    // const number5511991174117 = await this.createWppPhone(organization, '5511991174117')
    // const number5511991174118 = await this.createWppPhone(organization, '5511991174118', true)
    // const number5511991174119 = await this.createWppPhone(organization, '5511991174119', true)
    // const number5511991174120 = await this.createWppPhone(organization, '5511991174120')

    const categories = await this.createCategories()
    const [ass, notAss] = categories
    const contactAss = await this.createContact(number5511991174115, ass, '5511991174116')
    const contactNotAss = await this.createContact(number5511991174115, notAss, '5511991174115')
  }

  private async createWppPhone(organization: Organization, phoneNumber: string, isActive = false) {
    const wppPhone = await organization.related('phones').create({
      phoneNumber,
      isActive,
    })

    return wppPhone
  }

  private async createContact(wppPhone: WppPhone, category: Tag, phoneNumber: string) {
    const personInfo = await PersonInfo.create({})
    const contact = await wppPhone.addContact(
      {
        phoneNumber,
        name: 'Zap Phone',
        hasWhatsapp: true,
      },
      personInfo
    )

    await contact.related('tags').detach()
    await contact.related('tags').attach([category.id])

    return contact
  }

  private async createMasterUser() {
    const user = await User.firstOrCreate(
      { email: 'admin@admin.com' },
      {
        password: 'secret',
        nivel: 'admin',
      }
    )
    return user
  }

  private async createCategories() {
    const categories = await Tag.createMany([
      {
        type: 'category',
        name: 'Assinantes',
        slug: 'assinantes',
      },
      {
        type: 'category',
        name: 'Não Assinantes',
        slug: 'nao-assinantes',
      },
    ])

    return categories
  }

  private async createAppOrganization(user: User) {
    const name = `App Organization (Test - ${user.id})`
    const organization = await Organization.firstOrCreate(
      { name },
      {
        companyName: 'App Organization',
        fantasyName: 'App Organization',
        cnpj: '00.000.000/0000-00',
        ownerId: user.id,
      }
    )

    await organization.setAdmin(user)

    return organization
  }
}
