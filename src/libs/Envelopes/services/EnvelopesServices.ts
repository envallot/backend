import { EnvelopesModel } from "../model/EnvelopesModel";

interface Envelope {
  id: number;
  limit_amount: number;
  name: string
}

export class EnvelopesServices {
  model: EnvelopesModel

  constructor(envelopesModel: EnvelopesModel) {
    this.model = envelopesModel
  }

  async create(userID: string, name: string, limitAmount: number): Promise<any> {
    return await this.model.add(userID, name, limitAmount)
  }



  async getAll(userID:string) {
    const envelopes = await this.model.getAll(parseInt(userID))
    console.log('env service', envelopes)
    const envsObj:any = {}
    envelopes.forEach((env:Envelope) => {
      console.log('forEach', env)
      envsObj[env.id] = env
      console.log('envsObj', envsObj)
    })
    console.log('envsObj2', envsObj)

    return envsObj
  }
  /**
   * get normalizes a users items into an object of unassigned items, and envelops and the items that belong in them
   * @param userID user id of owner
   */
  async get(userID: string) {
    const itemsWithEnvID = await this.model.get(parseInt(userID))
    const unassignedItems: any = {}
    const envsWithItems: any = {}
    itemsWithEnvID.forEach((item: any) => {

      if (item.env_id === null) {
        unassignedItems[item.item_id] = item
      } else {
        if(!envsWithItems[item.env_id]) {
          envsWithItems[item.env_id] = {}
          envsWithItems[item.env_id]["items"] = {}
        }
        envsWithItems[item.env_id]["name"] = item.env_name
        envsWithItems[item.env_id]["limit"] = item.limit_amount
        envsWithItems[item.env_id]["id"] = item.env_id


        envsWithItems[item.env_id].items[item.item_id] = item
        envsWithItems[item.env_id].items[item.item_id].amount = envsWithItems[item.env_id].items[item.item_id] / 100
      }
    })
    return itemsWithEnvID
  }

  async change(id: number, name: string, limitAmount: number) {
    return await this.model.update(id, name, limitAmount)
  }

  async remove(itemID: string) {
    return await this.model.delete(itemID)
  }
}