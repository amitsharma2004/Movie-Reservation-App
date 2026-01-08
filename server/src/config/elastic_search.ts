import { Client } from "@elastic/elasticsearch";

const esClient = new Client({
    node: process.env.ELASTIC_SEARCH_URL,
    auth: {
        username: '',
        password: ''
    }
})

export default esClient;