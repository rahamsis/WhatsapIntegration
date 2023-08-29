import { ContainerBuilder } from "node-dependency-injection";
import { LeadCreate } from "../application/lead.create";
import LeadCtrl from "./controller/lead.ctrl";
import WsTransporter from "./repositories/ws.external";
import { GetQueues, QueueInfo } from "../rabbit/get.queues";
import { instaleapReport } from "../Instaleap/get.report.instaleap";
import { jokrReport } from "../jokr/get.report.jokr"

const container = new ContainerBuilder();

// Define el tipo de la función que devuelve una promesa de QueueInfo[]
type QueueGetterFunction = () => Promise<QueueInfo[]>;

/**
 * Inicamos servicio de WS / Bot / Twilio
 */
container.register("ws.transporter", WsTransporter);
const wsTransporter = container.get("ws.transporter");

container.register("getQueuesFunction", GetQueues);
const getQueues = container.get<QueueGetterFunction>("getQueuesFunction");

container.register("getInstaleapReport", instaleapReport);
const getInstaleapReport = container.get("getInstaleapReport");

container.register("getJokrReport", jokrReport);
const getJokrReport = container.get("getJokrReport");

container.register("lead.creator", LeadCreate).addArgument(wsTransporter);
const leadCreator = container.get("lead.creator");

container.register("lead.ctrl", LeadCtrl).addArgument(leadCreator).addArgument(getQueues).addArgument(getInstaleapReport).addArgument(getJokrReport);

export default container;
