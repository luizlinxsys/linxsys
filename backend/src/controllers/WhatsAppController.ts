import { Request, Response } from "express";
import { getIO } from "../libs/socket";
import { removeWbot } from "../libs/wbot";
import { StartWhatsAppSession } from "../services/WbotServices/StartWhatsAppSession";
import {
  getPageProfile,
  getAccessTokenFromPage,
  removeApplcation,
  subscribeApp
} from "../services/FacebookServices/graphAPI";

import CreateWhatsAppService from "../services/WhatsappService/CreateWhatsAppService";
import DeleteWhatsAppService from "../services/WhatsappService/DeleteWhatsAppService";
import ListWhatsAppsService from "../services/WhatsappService/ListWhatsAppsService";
import ShowWhatsAppService from "../services/WhatsappService/ShowWhatsAppService";
import UpdateWhatsAppService from "../services/WhatsappService/UpdateWhatsAppService";
import ListSessionService from "../services/WhatsappService/ListSessionService";
import Whatsapp from "../models/Whatsapp";

interface WhatsappData {
  name: string;
  queueIds: number[];
  greetingMessage?: string;
  farewellMessage?: string;
  status?: string;
  isDefault?: boolean;
  isMultidevice?: boolean;
}

interface Root {
  name: string;
  access_token: string;
  instagram_business_account: InstagramBusinessAccount;
  id: string;
}

interface InstagramBusinessAccount {
  id: string;
  username: string;
  name: string;
}

export const index = async (req: Request, res: Response): Promise<Response> => {
  const whatsapps = await ListSessionService();

  return res.status(200).json(whatsapps);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const {
    name,
    status,
    isDefault,
    greetingMessage,
    farewellMessage,
    queueIds,
    isMultidevice
  }: WhatsappData = req.body;

  const { whatsapp, oldDefaultWhatsapp } = await CreateWhatsAppService({
    name,
    status,
    isDefault,
    greetingMessage,
    farewellMessage,
    queueIds,
    channel: "whatsapp",
    isMultidevice
  });

  StartWhatsAppSession(whatsapp);

  const io = getIO();
  io.emit("whatsapp", {
    action: "update",
    whatsapp
  });

  if (oldDefaultWhatsapp) {
    io.emit("whatsapp", {
      action: "update",
      whatsapp: oldDefaultWhatsapp
    });
  }

  return res.status(200).json(whatsapp);
};

export const storeFacebook = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {
    facebookUserId,
    facebookUserToken,
    addInstagram
  }: {
    facebookUserId: string;
    facebookUserToken: string;
    addInstagram: boolean;
  } = req.body;

  const { data } = await getPageProfile(facebookUserId, facebookUserToken);

  if (data.lenght === 0) {
    return res.status(400).json({
      error: "Facebook page not found"
    });
  }
  const io = getIO();

  const pages = [];
  for await (const page of data) {
    const { name, access_token, id, instagram_business_account } = page;

    console.log(page)

    const acessTokenPage = await getAccessTokenFromPage(access_token);

    if (instagram_business_account && addInstagram) {
      const {
        id: instagramId,
        username,
        name: instagramName
      } = instagram_business_account;
      pages.push({
        name: username || instagramName,
        facebookUserId: facebookUserId,
        facebookPageUserId: instagramId,
        facebookUserToken: acessTokenPage,
        tokenMeta: facebookUserToken,
        isDefault: false,
        channel: "instagram",
        status: "CONNECTED",
        greetingMessage: "",
        farewellMessage: "",
        queueIds: [],
        isMultidevice: false
      });

      // await subscribeApp(instagramId, acessTokenPage);


      pages.push({
        name,
        facebookUserId: facebookUserId,
        facebookPageUserId: id,
        facebookUserToken: acessTokenPage,
        tokenMeta: facebookUserToken,
        isDefault: false,
        channel: "facebook",
        status: "CONNECTED",
        greetingMessage: "",
        farewellMessage: "",
        queueIds: [],
        isMultidevice: false
      });

      await subscribeApp(id, acessTokenPage);

    }

    if (!instagram_business_account) {
      pages.push({
        name,
        facebookUserId: facebookUserId,
        facebookPageUserId: id,
        facebookUserToken: acessTokenPage,
        tokenMeta: facebookUserToken,
        isDefault: false,
        channel: "facebook",
        status: "CONNECTED",
        greetingMessage: "",
        farewellMessage: "",
        queueIds: [],
        isMultidevice: false
      });

      await subscribeApp(page.id, acessTokenPage);
    }
  }
  for await (const pageConection of pages) {
    const exist = await Whatsapp.findOne({
      where: {
        facebookPageUserId: pageConection.facebookPageUserId
      }
    });

    if (exist) {
      await exist.update({
        ...pageConection
      });
    }

    if (!exist) {
      const { whatsapp } = await CreateWhatsAppService(pageConection);

      io.emit("whatsapp", {
        action: "update",
        whatsapp
      });
    }
  }
  return res.status(200);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { whatsappId } = req.params;

  const whatsapp = await ShowWhatsAppService(whatsappId);

  return res.status(200).json(whatsapp);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { whatsappId } = req.params;
  const whatsappData = req.body;

  const { whatsapp, oldDefaultWhatsapp } = await UpdateWhatsAppService({
    whatsappData,
    whatsappId
  });

  const io = getIO();
  io.emit("whatsapp", {
    action: "update",
    whatsapp
  });

  if (oldDefaultWhatsapp) {
    io.emit("whatsapp", {
      action: "update",
      whatsapp: oldDefaultWhatsapp
    });
  }

  return res.status(200).json(whatsapp);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { whatsappId } = req.params;
  const io = getIO();

  const connection = await ShowWhatsAppService(whatsappId);

  if (connection.channel === "whatsapp") {
    removeWbot(+whatsappId);

    await DeleteWhatsAppService(whatsappId);

    io.emit("whatsapp", {
      action: "delete",
      whatsappId: +whatsappId
    });
  }

  if (connection.channel === "facebook" || connection.channel === "instagram") {
    await removeApplcation(
      connection.facebookUserId,
      connection.facebookUserToken
    );

    const conectionsFacebook = await Whatsapp.findAll({
      where: {
        facebookUserId: connection.facebookUserId
      }
    });

    for await (const connectionFacebook of conectionsFacebook) {
      await DeleteWhatsAppService(`${connectionFacebook.id}`);

      io.emit("whatsapp", {
        action: "delete",
        whatsappId: connectionFacebook.id
      });
    }
  }

  return res.status(200).json({ message: "Whatsapp deleted." });
};
