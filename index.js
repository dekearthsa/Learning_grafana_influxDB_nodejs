require('dotenv').config();
const mqtt = require("mqtt");
const { InfluxDB, Point } = require("@influxdata/influxdb-client");


const influxUrl = process.env.INFLUXDB_SERVER
const influxToken = process.env.INFLUXDB_TOKEN
const influxOrg = process.env.INFLUXDB_ORG
const influxBucket = process.env.INFLUXDB_BUCKET

const influxClient = new InfluxDB({ 
    url: influxUrl, 
    token: influxToken 
});

const writeApi = influxClient.getWriteApi(influxOrg, influxBucket);

const client = mqtt.connect(
    process.env.MQTT_SERVER,
    {
        username: process.env.MQTT_USER,
        password: process.env.MQTT_PASSWORD
    }
)

client.on("connect", () => {

    console.log("MQTT service is running.")

    client.subscribe("send-from-hive", (err) => {
        if(err){
            console.log("error subcribe")
        }
    })

    client.on('message', (topic, message) => {
        try{
            const jsonParse = JSON.parse(message)
            // push to influxdb where table   //
            // console.log(jsonParse)
            // console.log(jsonParse.deviceName)
            // console.log(jsonParse.localtion.building)
            // console.log(jsonParse.localtion.floor)
            // console.log(jsonParse.msgParam.value)
            const point = new Point('air_q')
            .tag("type", jsonParse.deviceName)
            .tag("building", jsonParse.localtion.building)
            .tag("floor", jsonParse.localtion.floor)
            .floatField("iqa", jsonParse.msgParam.value)
            .timestamp(new Date());

            try{
                writeApi.writePoint(point);
                console.log("FINISHED")
            }catch(err){
                console.log("error => ",err)
            }

            // writeApi
            // .close()
            // .then(() => {
            //     console.log("FINISHED");
            // })
            // .catch((e) => {
            //     console.error(e);
            //     console.log("Finished ERROR");
            // });

        }catch(err){
            console.log("error json format.", err)
        }
    })
});