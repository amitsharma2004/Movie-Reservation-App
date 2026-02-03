import 'dotenv/config';
import { Client } from "@elastic/elasticsearch";

<<<<<<< HEAD
let esClient: Client | null = null;
=======
const esClient = new Client({
    node: process.env.ELASTIC_SEARCH_URL || "http://localhost:9200",
})
>>>>>>> 03a0756d5750b5ca0bd8ba9ccf78442336e7aff6

if (process.env.ELASTIC_SEARCH_URL) {
    esClient = new Client({
        node: process.env.ELASTIC_SEARCH_URL,
        auth: {
            username: '',
            password: ''
        }
    });
}

export default esClient;
