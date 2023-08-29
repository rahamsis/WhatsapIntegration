import { Request, Response } from "express";
import { LeadCreate } from "../../application/lead.create";
import { GetQueues, QueueInfo } from "../../rabbit/get.queues";
import { instaleapReport } from "../../Instaleap/get.report.instaleap";
import { jokrReport } from "../../jokr/get.report.jokr";

// Define el tipo de la función que devuelve una promesa de QueueInfo[]
//type QueueGetterFunction = () => Promise<QueueInfo[]>;

// Define la función para formatear la fecha
function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };

  return date.toLocaleString('pe-PE', options);
}

//Formateamos el mensaje que nos trae rabbit
function formatResponse(queues: QueueInfo[]): string {
  let formattedResponse = '';

  for (const queue of queues) {
    formattedResponse += `name: ${queue.name}\nmessage: ${queue.messages}\n\n`;
  }

  return formattedResponse.trim();
}

class LeadCtrl {
  constructor(
    private readonly leadCreator: LeadCreate,
  ) { }

  // Define la función getQueues aquí
  private getQueues: () => Promise<QueueInfo[]> = async () => {
    try {
      const queues: QueueInfo[] = await GetQueues();
      return queues;
    } catch (error: any) {
      console.error(error.message);
      throw new Error("Error retrieving queues");
    }
  };

  // Define la función instaleap aqui
  private getJokrReport = async () => {
    try {
      const query = await jokrReport();
      let message = "";
      if (query.length > 0) {        
        query.forEach(function (value: any ){
          message += "order: " + value.order_number + "\n" 
          + "created: " + formatDate(value.created_at) + "\n" 
          + "despacho: " + value.order_dispatch_id + "\n"+ "\n";          
        });
        
        return message;
      } else {
        return "No se encontraron Incidencias en la creación de pedidos Jokr" + "\n" ;
      }
      //return query;
    } catch (error: any) {
      console.log(error.message);
      throw new Error("Error retrieving dbPicking");
    }
  }

  // Define la función instaleap aqui
  private getInstaleapReport = async () => {
    try {
      const query = await instaleapReport();
      let message = "";
      if (query.length > 0) {        
        query.forEach(function (value: any){
          message += "order: " + value.order_ean_code + "\n" 
          + "created: " + formatDate(value.created_at) + "\n" 
          + "start_DW: " + formatDate(value.start_date_delivery_window) + "\n"
          + "end_DW: " + formatDate(value.end_date_delivery_window) + "\n" + "\n";
        });
        
        return message;
      } else {
        return "No se encontraron Incidencias en la creación de pedidos Instaleap" + "\n" + "\n";
      }
      //return query;
    } catch (error: any) {
      console.log(error.message);
      throw new Error("Error retrieving dbCustomer");
    }
  }

  public sendCtrl = async ({ body }: Request, res: Response) => {
    try {
      const queues: QueueInfo[] = await this.getQueues();

      const query = await this.getInstaleapReport();

      const query2 = await this.getJokrReport();

      const formattedResponse = formatResponse(queues);

      const date = formatDate(new Date());

      const title = "* - Prueba piloto - Soporte DAD - *" + "\n" + "\n"

      //const queueJson = "Reporte de queues - RabbitMQ\n" + date + "\n" + "\n" + JSON.stringify(queues);
      const queueJson = "*1. Reporte de Queues - RabbitMQ*\n" + "_" + date + "_" + "\n" + "\n" + formattedResponse + "\n" + "\n";

      //const queueJson = "Reporte de queues - RabbitMQ\n" + date + "\n" + "\n" + JSON.stringify(queues);
      const queryJson = "*2. Reporte Instaleap*\n" + "_" + date + "_" + "\n" + "\n" + query ;

      //const queueJson = "Reporte de queues - RabbitMQ\n" + date + "\n" + "\n" + JSON.stringify(queues);
      const queryJson2 = "*3. Reporte Jokr*\n" + "_" + date + "_" + "\n" + "\n" + query2;

      //res.json(queues);

      const { message, phone } = body;
      const response = await this.leadCreator.sendMessageAndSave({ message: title + queueJson + queryJson + queryJson2, phone });
      res.send(response);
    } catch (error: any) {
      console.error(error.message);
      res.status(500).send("Error retrieving queues");
    }
  };
}

export default LeadCtrl;
