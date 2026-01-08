import esClient from "../config/elastic_search.js";
import logger from "./logger.js";

async function checkConnection () {
    try {
        const health = await esClient.cluster.health();
        logger.info(`ES health: ${ health }`);
    } catch (error) {
        console.error("Elasticsearch is having a breakdown:", error);
    }
}

checkConnection ();

export default checkConnection;