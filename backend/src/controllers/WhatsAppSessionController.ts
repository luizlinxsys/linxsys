import { Request, Response } from "express";
import { getWbot } from "../libs/wbot";
import ShowWhatsAppService from "../services/WhatsappService/ShowWhatsAppService";
import { StartWhatsAppSession } from "../services/WbotServices/StartWhatsAppSession";
import UpdateWhatsAppService from "../services/WhatsappService/UpdateWhatsAppService";
import DeleteBaileysService from "../services/BaileysServices/DeleteBaileysService";
import BaileysSessions from "../models/BaileysSessions";

const store = async (req: Request, res: Response): Promise<Response> => {
  const { whatsappId } = req.params;
  const whatsapp = await ShowWhatsAppService(whatsappId);

  StartWhatsAppSession(whatsapp);

  return res.status(200).json({ message: "Starting session." });
};

const update = async (req: Request, res: Response): Promise<Response> => {
  const { whatsappId } = req.params;

  const { whatsapp } = await UpdateWhatsAppService({
    whatsappId,
    whatsappData: { session: "" }
  });
  await DeleteBaileysService(whatsappId);

  StartWhatsAppSession(whatsapp);

  return res.status(200).json({ message: "Starting session." });
};

const remove = async (req: Request, res: Response): Promise<Response> => {
  const { whatsappId } = req.params;
  const whatsapp = await ShowWhatsAppService(whatsappId);

  if(whatsapp.channel === "whatsapp"){
  await DeleteBaileysService(whatsappId);
  await BaileysSessions.destroy({
    where: {
      whatsappId: whatsapp.id
    }
  });
  const wbot = getWbot(whatsapp.id);

  wbot.logout();
  }

  if(whatsapp.channel === "facebook" || whatsapp.channel === "instagram") {
    whatsapp.destroy();
  }

  return res.status(200).json({ message: "Session disconnected." });
};

export default { store, remove, update };
