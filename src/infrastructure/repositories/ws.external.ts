import { Client, LegacySessionAuth, LocalAuth } from "whatsapp-web.js";
import { image as imageQr } from "qr-image";
import LeadExternal from "../../domain/lead-external.repository";

/**
 * Extendemos los super poderes de whatsapp-web
 */
class WsTransporter extends Client implements LeadExternal {
  private status = false;
  private isGroupAndExist = false;
  private groupId = "";

  constructor() {
    super({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: [
          "--disable-setuid-sandbox",
          "--unhandled-rejections=strict",
        ],
      },
    });

    console.log("Iniciando....");

    this.initialize();

    this.on("ready", async () => {
      this.status = true;
      console.log("LOGIN_SUCCESS");

      // Obténemos una lista de todos los chats disponibles (conversaciones)
      const chats = await this.getChats();

      // Reemplazamos "Nombre del Grupo" con el nombre exacto del grupo que estás buscando
      //const groupName = "SoporteDad-Privado";
      const groupName = "Copernico";

      // Buscamos el chat que corresponde al grupo por su nombre
      const groupChat = chats.find((chat) => chat.isGroup && chat.name === groupName);

      if (groupChat) {
        // Si encontraste el grupo, muestra su ID
        this.isGroupAndExist = true;
        this.groupId = groupChat.id._serialized;
        console.log(`ID del Grupo "${groupName}": ${groupChat.id._serialized}`);
      } else {
        console.log(`No se encontró el grupo con el nombre "${groupName}".`);
      }
    });

    this.on("auth_failure", () => {
      this.status = false;
      console.log("LOGIN_FAIL");
    });

    this.on("qr", (qr) => {
      console.log("Escanea el codigo QR que esta en la carepta tmp");
      this.generateImage(qr);
    });
  }

  /**
   * Enviar mensaje de WS
   * @param lead
   * @returns
   */
  async sendMsg(lead: { message: string; phone: string }): Promise<any> {
    try {
      if (!this.status) return Promise.resolve({ error: "WAIT_LOGIN" });
      //valida si el grupo existe y que el chat sea grupo
      if (this.isGroupAndExist === true) {
        const { message, phone } = lead;
        //envia mensaje a un contacto enviado desde postman
        //const response = await this.sendMessage(`${phone}@c.us`, message);
        //envia mensaje a un grupo enviado desde postman
        const response = await this.sendMessage(`${this.groupId}`, message);
        //return { id: response.id.id };
        return { response : response.id.id}
      }
    } catch (e: any) {
      return Promise.resolve({ error: e.message });
    }
  }

  getStatus(): boolean {
    return this.status;
  }

  private generateImage = (base64: string) => {
    const path = `${process.cwd()}/tmp`;
    let qr_svg = imageQr(base64, { type: "svg", margin: 4 });
    qr_svg.pipe(require("fs").createWriteStream(`${path}/qr.svg`));
    console.log(`⚡ Recuerda que el QR se actualiza cada minuto ⚡'`);
    console.log(`⚡ Actualiza F5 el navegador para mantener el mejor QR⚡`);
  };
}

export default WsTransporter;
