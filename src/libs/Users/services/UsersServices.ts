import { UsersModel } from '../model/UsersModel'
export class UsersServices {
  model:UsersModel
  constructor(usersModel: UsersModel) {
    this.model = usersModel
  }

  async create(){
    try {
      const newUser = await this.model.add()
      console.log('user created:', newUser.rows[0] )
      return newUser.rows[0]

    } catch(error){
      throw new Error(error)
    }
  }
}