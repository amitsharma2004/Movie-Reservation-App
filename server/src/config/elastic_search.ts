import 'dotenv/config';
import { Client } from "@elastic/elasticsearch";

const esClient = new Client({
    node: process.env.ELASTIC_SEARCH_URL || "http://localhost:9200",
})

export default esClient;