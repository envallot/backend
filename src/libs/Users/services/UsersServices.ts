import { UsersModel } from '../model/UsersModel'
export class UsersServices {
  model: UsersModel

  constructor(usersModel: UsersModel) {
    this.model = usersModel
  }

  async create() {
    const newUser = await this.model.add()
    return newUser
  }

  async change({ id, username, email }: any) {
    const changedUser = await this.model.update(id, username, email)
    console.log('changedUser', changedUser)
    return changedUser
  }

  async get(userID: string) {
    try {

      const user = await this.model.get(parseInt(userID))
      console.log(user)
      return user
    } catch (error) {
      console.log(error)
    }
  }
}