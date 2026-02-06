import 'dotenv/config';
import { Client } from "@elastic/elasticsearch";

let esClient: Client | null = null;

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
