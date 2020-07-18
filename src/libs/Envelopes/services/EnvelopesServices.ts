import { EnvelopesModel } from "../model/EnvelopesModel";
import { itemsModel as Items } from "../../Items/model"

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

  async getAll(userID: string) {
    const envelopes = await this.model.getAll(parseInt(userID))
    return envelopes
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
        if (!envsWithItems[item.env_id]) {
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

  async remove(envelopeID: string) {
    return await this.model.delete(envelopeID)
  }

  /**
   * removeEnvAndItems firs deletes all items that were assigne to env, then deletes env
   * 
   * @param userID ID of user this belongs to
   * @param envelopeID ID fo envelope to delete
   */
  async removeEnvAndItems(userID: string, envelopeID: string) {
    const itemsToRemove = await Items.getByEnvelope(userID, envelopeID)
    console.log('itemsToRemove', itemsToRemove)
    const promises: any[] = []
    itemsToRemove.forEach((item: any) => {
      promises.push(Items.delete(item.id))
    })

    const resolved = await Promise.all(promises)
    console.log('resolved ', resolved)

    return await this.model.delete(envelopeID)

  }

  /**
   * First sets envelope_id of all items assigned to envelope to null, then delete env
   * 
   * @param userID ID of user
   * @param envelopeID ID of env to delete
   */
  async removeEnvUnassignItems(userID: string, envelopeID: string) {
    const itemsToUnassign = await Items.getByEnvelope(userID, envelopeID)
    console.log('itemsToUnassign', itemsToUnassign)
    const promises: any[] = []
    itemsToUnassign.forEach((item: any) => {
      promises.push(Items.unassign(item.id))
    })

    const resolved = await Promise.all(promises)
    console.log('resolved ', resolved)

    return await this.model.delete(envelopeID)
  }
}

