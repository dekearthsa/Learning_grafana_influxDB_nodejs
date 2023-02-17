require('dotenv').config();
const mqtt = require("mqtt");
const { InfluxDB, Point } = require("@influxdata/influxdb-client");


const influxUrl = process.env.INFLUXDB_SERVER
const influxToken = process.env.INFLUXDB_TOKEN
const influxOrg = process.env.INFLUXDB_ORG

const influxUrl_C = process.env.INFLUXDB_SERVER_CLOUD
const influxToken_C = process.env.INFLUXDB_TOKEN_CLOUD
const influxOrg_C = process.env.INFLUXDB_ORG_CLOUD

const influxBucket = "test_map"

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

    client.subscribe("send-from-hive-map", (err) => {
        if(err){
            console.log("error subcribe")
        }
    })

    client.on('message', (topic, message) => {
        try{
            const jsonParse = JSON.parse(message)
            // push to influxdb where table   //
            // console.log(jsonParse)
            // {
            //     "table":1,
            //     "generatorID":"generator1",
            //     "lat":0,
            //     "lon":0,
            //     "value":12
            // }
            const point = new Point('geolocationIAQ')
            .tag("table", jsonParse.table)
            .tag("generatorID", jsonParse.generatorID)
            .tag("lat", jsonParse.lat)
            .tag("lon", jsonParse.lon)
            .stringField("lat",jsonParse.lat)
            .stringField("lon",jsonParse.lon)
            .floatField("value", jsonParse.value)
            .timestamp(new Date());

            try{
                writeApi.writePoint(point);
                console.log("FINISHED")
            }catch(err){
                console.log("error => ",err)
            }


        }catch(err){
            console.log("error json format.", err)
        }
    })
});
