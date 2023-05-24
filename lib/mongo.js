import { json } from "express"
import { MongoClient, ObjectId } from "mongodb"
const mongoUrl = "mongodb://localhost:27017"
const mongoDB = "express"

const client = new MongoClient(mongoUrl)

let walkDate = new Date().getDate() + "/" + (new Date().getMonth()+1) + "/" + new Date().getFullYear();
let lastDeviceId = null;
let currentDeviceId = null;
let allDates = [];
var dateReset = false;

export default class Mongo 
{
  static setStatus = async(collection, status = "Active" ,id = null) => {

    const query = id ? { _id: new ObjectId(id) } : {}
    try {
      await client.connect();
      client.db(mongoDB)
      .collection(collection)
      .updateOne(query, { 
        $set: { 
        device_status: status }});
    } catch (err) {
      throw new Error(err.message);
    }
    return("succes");
  }

  static setCustomer = async(collection,newCusromer) => 
  {
    newCusromer._id = new ObjectId();
    try {
      await client.connect()
      client.db(mongoDB)
      .collection(collection)
      .insertOne(newCusromer);
    } catch (err) {
      throw new Error(err.message);
    }
    return("succes");
  }

  static fetch = async(collection,id = null) => {
    const result = []
    const query = id ? { device_id: id } : {device_id: "eenmalige-hash-code-vanuit-de-backend" }
    try 
    {
      await client.connect();
      let data = client.db(mongoDB)
                       .collection(collection)
                       .find(query);
      await data.forEach(item => 
      {
        if(id == null)
        {
            item.device_id = this.RandomId();
        }

        currentDeviceId = item.device_id;
        
        item.message_id = this.RandomId();
        item.device_status = "active";

        if(lastDeviceId != currentDeviceId)
        {
          walkDate = new Date().getDate() + "/" + (new Date().getMonth()+1) + "/" + new Date().getFullYear();
          lastDeviceId = currentDeviceId;
        }

        item.date = walkDate;//this.RandomDate(2022,2023);//new Date().getDate() + "/" + (new Date().getMonth()+1) + "/" + new Date().getFullYear() ;
        // print("hi")//item.devices[0]);

        item.devices.forEach(device => 
        {
            device.device_status = "active";
          
            let ranYield = this.RandomYield();
            let surplus = this.RandomSurplus(ranYield);
          
            device.device_total_yield = this.RandomTotal(ranYield) + "kWh";
            device.device_month_yield = ranYield + "kWh";

            device.device_total_surpuls = this.RandomTotal(surplus) + "kWh";
            device.device_month_surplus = surplus + "kWh";

            if(id == null)
            {
              device.serial_number = this.RandomId();
              device.device_type = this.Radomtype();
            }
        })

        if(id == null)
        {
          let randomPanels = Math.floor(Math.random() * 15.99) + 3;

          for(let i = 0; i < randomPanels; i++)
          {
            let ranYield = this.RandomYield();
            let surplus = this.RandomSurplus(ranYield);

            item.devices.push(
            {
              "serial_number": this.RandomId(),
              "device_type": "solar",
              "device_status": "active",
              "device_total_yield": this.RandomTotal(ranYield) + "kWh",
              "device_month_yield": ranYield + "kWh",
              "device_total_surpuls": this.RandomTotal(surplus) + "kWh",
              "device_month_surplus": surplus + "kWh"
            }
            )
          }
        }

        result.push(item);
      })
      await client.close();
    } 
    catch (err)
    {
      throw new Error(err.message);
    }
    if(id == null)
    {
      this.setCustomer("solar-data",result[0]);
    }
    else
    {
      //ittarate dates
      this.minDate();
    }

    return(result);
  }

  static specialFetch = async(collection,id = null) => {
    const result = []
    
    while(dateReset == false)
    {
      allDates.push(this.minDate());
    }

    const query = id ? { device_id: id } : {device_id: "eenmalige-hash-code-vanuit-de-backend" }
    try 
    {
      await client.connect();
      let data = client.db(mongoDB)
                       .collection(collection)
                       .find(query);
      await data.forEach(item => 
      {
        allDates.forEach(date =>
        {
          if(id == null)
          {
              item.device_id = this.RandomId();
          }

          currentDeviceId = item.device_id;
          
          item.message_id = this.RandomId();
          item.device_status = "active";

          if(lastDeviceId != currentDeviceId)
          {
            walkDate = new Date().getDate() + "/" + (new Date().getMonth()+1) + "/" + new Date().getFullYear();
            lastDeviceId = currentDeviceId;
          }
          
          item.date = date;//this.RandomDate(2022,2023);//new Date().getDate() + "/" + (new Date().getMonth()+1) + "/" + new Date().getFullYear() ;
          // print("hi")//item.devices[0]);

          item.devices.forEach(device => 
          {
              device.device_status = "active";
            
              let ranYield = this.RandomYield();
              let surplus = this.RandomSurplus(ranYield);
            
              device.device_total_yield = this.RandomTotal(ranYield) + "kWh";
              device.device_month_yield = ranYield + "kWh";

              device.device_total_surpuls = this.RandomTotal(surplus) + "kWh";
              device.device_month_surplus = surplus + "kWh";

              if(id == null)
              {
                device.serial_number = this.RandomId();
                device.device_type = this.Radomtype();
              }
          })

          if(id == null)
          {
            let randomPanels = Math.floor(Math.random() * 15.99) + 3;

            for(let i = 0; i < randomPanels; i++)
            {
              let ranYield = this.RandomYield();
              let surplus = this.RandomSurplus(ranYield);

              item.devices.push(
              {
                "serial_number": this.RandomId(),
                "device_type": "solar",
                "device_status": "active",
                "device_total_yield": this.RandomTotal(ranYield) + "kWh",
                "device_month_yield": ranYield + "kWh",
                "device_total_surpuls": this.RandomTotal(surplus) + "kWh",
                "device_month_surplus": surplus + "kWh"
              }
              )
            }
          }

          result.push(item);
        })
      }
    )
      await client.close();
    } 
    catch (err)
    {
      throw new Error(err.message);
    }
    if(id == null)
    {
      this.setCustomer("solar-data",result[0]);
    }
    else
    {
      //ittarate dates
      // this.minDate();
    }

    return(result);
  }

  static minDate()
  {
    let dates = walkDate.split("/");
    
    if(dates[1] > 1)
    {
      dates[1] = dates[1] - 1;
    }
    else
    {
      dates[1] = 12;
      dates[2] = dates[2] - 1;
    }
    
    if(dates[2] <= 2013 && dates[1] <= 5)
    {
      dateReset = true;
      dates = this.resetDate(dates);
    }
    
    walkDate = dates[0]  + "/" + dates[1]  + "/" + dates[2];

    return dates[0]  + "/" + dates[1]  + "/" + dates[2];
  }

  static resetDate(dates)
  {
    dates[0] = new Date().getDate();
    dates[1] = new Date().getMonth() + 1;
    dates[2] = new Date().getFullYear();

    return dates;
  }

  static RandomDate(startYear, endYear) 
  {
    let year = startYear + Math.round(Math.random() * (endYear - startYear));
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1;
    let month = currentMonth + 1 + Math.floor(Math.random() * (11.99 - currentMonth));

    if(currentDate.getFullYear() == year)
    {
      month = Math.ceil(Math.random() * (currentMonth - 0.01));
    }

    let date = 1 + "/" + (month) + "/" + year;
    // let $date = new Date().getDate() + "/" + (new Date().getMonth()+1) + "/" + new Date().getFullYear() ;
    return date;
  }

  static RandomId () {
    return "" + Math.round(Math.random() * 8999999999 + 1000000000) + "";
    return crypto.randomBytes(10).toint32();

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
    return Math.round((Math.random() * 50 + 25) * 100)/100;
  }

  static RandomSurplus (ranYield) {
    return Math.round((ranYield * Math.random()) * 100)/100;
  }

  static RandomTotal (part) {
    return Math.round((part * (Math.random() * 10 + 1)) * 100)/100;
  }


  ////////////////////////////////////

  // static fetch = async(collection,id = null) => 
  // {
  //   const result = []
  //   const query = id ? { _id: new ObjectId(id) } : {}
  //   try {
  //     await client.connect();
  //     let data = client.db(mongoDB)
  //                      .collection(collection)
  //                      .find(query);
  //     await data.forEach(item => 
  //     {
  //       deviceId = this.RandomId();

  //       item._id = id;
  //       item.message_id = this.RandomId();
  //       item.device_id = deviceId;
  //       item.device_status = "active";
  //       item.date = new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear();
  //       item.devices.forEach(device => {
  //         device.device_status = "active";

  //         let ranYield = this.RandomYield();
  //         let surplus = this.RandomSurplus(ranYield);

  //         device.device_total_yield = this.RandomTotal(ranYield) + "kWh";
  //         device.device_month_yield = ranYield + "kWh";

  //         device.device_total_surpuls = this.RandomTotal(surplus) + "kWh";
  //         device.device_month_surplus = surplus + "kWh";

  //         // if(id == null)
  //         // {
  //           device.serial_number = this.RandomId();
  //           device.device_type = this.Radomtype();   //this.setCustomer("solar-data",device);
  //         // }
  //       })

  //       //this.setCustomer("solar-data",item);        
  //       result.push(item);
  //     })
  //     await client.close();
  //   } catch (err) {
  //     throw new Error(err.message);
  //   }
  //   return(result);
  // }
}