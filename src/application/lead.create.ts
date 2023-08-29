import LeadExternal from "../domain/lead-external.repository";

export class LeadCreate {
  private leadExternal: LeadExternal;
  constructor(respositories: LeadExternal) {
    this.leadExternal = respositories;
  }

  public async sendMessageAndSave({
    message,
    phone,
  }: {
    message: string;
    phone: string;
  }) {
    const responseExSave = await this.leadExternal.sendMsg({ message, phone });//TODO enviar a ws
    return {responseExSave};
  }
}
