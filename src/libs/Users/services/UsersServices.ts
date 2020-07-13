import { UsersModel } from '../model/UsersModel'
export class UsersServices {
  model:UsersModel
  
  constructor(usersModel: UsersModel) {
    this.model = usersModel
  }

  async create(){
      const newUser = await this.model.add()
      return newUser
  }
}