import { UsersModel } from '../model/UsersModel'
export class UsersServices {
  model:UsersModel
  constructor(usersModel: UsersModel) {
    this.model = usersModel
  }

  async create(){
    try {
      const newUser = await this.model.add()
      console.log('user created: newUser')
      return newUser

    } catch(error){
      throw new Error(error)
    }
  }
}