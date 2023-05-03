import { json } from "express"
import { MongoClient, ObjectId } from "mongodb"
const mongoUrl = "mongodb://localhost:27017"
const mongoDB = "express"

const client = new MongoClient(mongoUrl)

export default class Mongo {

  static fetch = async(collection, id = null) => {
    const result = []
    const query = id ? { _id: new ObjectId(id) } : {}
    try {
      await client.connect();
      let data = client.db(mongoDB)
                       .collection(collection)
                       .find(query);
      await data.forEach(item => {

        item._id = "12345";
        item.message_id = this.RandomId();
        item.device_id = this.RandomId();
        item.device_status = "active";
        item.date = new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear();
        item.devices.forEach(device => {
          device.serial_number = this.RandomId();
          device.device_type = this.Radomtype();
          
          device.device_status = "active";

          let ranYield = this.RandomYield();
          let surplus = this.RandomSurplus(ranYield);

          device.device_total_yield = this.RandomTotal(ranYield) + "kWh";
          device.device_month_yield = ranYield + "kWh";

          device.device_total_surpuls = this.RandomTotal(surplus) + "kWh";
          device.device_month_surplus = surplus + "kWh";
        })
        
        result.push(item);
      })
      await client.close();
    } catch (err) {
      throw new Error(err.message);
    }
    return(result);
  }

  static RandomId () {
    return "" + Math.round(Math.random() * 8999999999 + 1000000000) + "";
  }

  static Radomtype () {
    let deviceTypes = ["solar","pump"]
    let randomNum = Math.random()

    if(randomNum > 0.5){
      return "solar";
    }

    return "pump";
  }

  static RandomYield () {
    return "" + Math.round((Math.random() * 50 + 25) * 100)/100+ "";
  }

  static RandomSurplus (ranYield) {
    return Math.round((ranYield * Math.random()) * 100)/100;
  }

  static RandomTotal (part) {
    return Math.round((part * (Math.random() * 10 + 1)) * 100)/100;
  }

}