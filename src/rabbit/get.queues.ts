import axios, { AxiosResponse} from "axios";
import { spawn } from 'child_process';

//credenciales
const rabbitmq_user = 'user';
const rabbitmq_password = 'password';
const rabbitmq_server = '127.0.0.1';
const rabbitmq_port = '45673';

export interface QueueInfo {
  name: string;
  messages: number;
}

export async function GetQueues(): Promise<QueueInfo[]> {

  const kuectlCmd = 'kubectl';
  const args = ['port-forward', 'svc/rabbitmq-prod-ready', '45673:15672', '4673:5672', '-n', 'rabbitmq-system'];

  const kubectlProcess = spawn(kuectlCmd, args);

  kubectlProcess.stdout.on('data', (data) => {
    console.log(`kubectl output: ${data}`);
  });

  kubectlProcess.stderr.on('data', (data) => {
    console.error(`kubectl error: ${data}`);
  });

  kubectlProcess.on('close', (code) => {
    console.log(`kubectl process exited with code ${code}`);
  });

  // Agregamos una espera para que el proceso de port-forwarding se ejecute durante un tiempo adecuado
  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log('Conexión establecida con kubectl y port-forwarding activo.');
  
  const url = `http://${rabbitmq_server}:${rabbitmq_port}/api/queues`;

  const response: AxiosResponse<any> = await axios.get(url, {
    auth: {
      username: rabbitmq_user,
      password: rabbitmq_password,
    },
  });

  if (response.status === 200) {

    const queues: QueueInfo[] = response.data;

    //filtramos las colas donde messages_ready sea mayor a cero
    const filteredQueues = queues.filter(queue => queue.messages > 0);

    //Ordenamos las colas según messages_ready en orden descendente (mayor a menor)
    filteredQueues.sort((a, b) => b.messages - a.messages);

    // Seleccionamos solo las primeras 10 colas
    const top10Queues = filteredQueues.slice(0, 5);

    const modifiedQueues: QueueInfo[] = top10Queues.map((queue) => {
      // Aquí accede a las propiedades de cada objeto y realizar las operaciones necesarias
      const modifiedQueue: QueueInfo = {
        name: queue.name,
        messages: queue.messages, // Por ejemplo, duplicar el valor de messages_ready
      };

      return modifiedQueue;
    });

    // Una vez que hayas terminado de utilizar el port-forwarding, puedes finalizar el proceso de kubectl
    kubectlProcess.kill();

    return modifiedQueues;
    //return top10Queues;
  } else {
    // Una vez que hayas terminado de utilizar el port-forwarding, puedes finalizar el proceso de kubectl
    kubectlProcess.kill();
    throw new Error(`Failed to get queues: ${response.data}`);
  }
}