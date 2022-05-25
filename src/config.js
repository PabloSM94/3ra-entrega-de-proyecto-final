import fs from 'fs'

export default {
    mongodb: {
        cnxStr: 'mongodb+srv://pablosm94:coderhouse@clusterpm.2bebn.mongodb.net/ecommerce',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            serverSelectionTimeoutMS: 5000,
        }
    },
    firebase: {
        serviceAccount : JSON.parse(fs.readFileSync('ecommercebackend-4f9c7-firebase-adminsdk-h1z7v-fbdbf2233d.json','utf8'))
//("path/to/serviceAccountKey.json");
    }
}