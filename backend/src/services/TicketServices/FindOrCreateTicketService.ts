import { subHours } from "date-fns";
import { Op } from "sequelize";
import Contact from "../../models/Contact";
import Ticket from "../../models/Ticket";
import Setting from "../../models/Setting";

import ShowTicketService from "./ShowTicketService";
import Message from "../../models/Message";

interface IRequest {
  contact: Contact;
  whatsappId?: number;
  unreadMessages?: number;
  channel?: string;
  groupContact?: Contact;
  fromMe?: boolean;
  companyId?: number;
}

const secondsToTime = secs => {
  const hours = Math.floor(secs / (60 * 60));

  const Dm = secs % (60 * 60);
  const minutes = Math.floor(Dm / 60);

  const ds = Dm % 60;
  const seconds = Math.ceil(ds);

  const obj = {
    h: hours,
    m: minutes,
    s: seconds
  };
  return obj;
};

const FindOrCreateTicketService = async ({
  contact,
  whatsappId,
  channel,
  groupContact,
}: IRequest): Promise<Ticket> => {
  let ticket = await Ticket.findOne({
    where: {
      status: {
        [Op.or]: ["open", "pending"]
      },
      contactId: groupContact ? groupContact.id : contact.id,
      whatsappId,
      channel,
    }
  });

  const getAllMessageUnread = await Message.findAll({
    where: {
      ticketId: ticket?.id || null,
      read: false,
    }
  });

  const unreadMessagesBase =
    getAllMessageUnread.length > 0 ? getAllMessageUnread.length : 0;

  if (ticket) {
    await ticket.update({ unreadMessages: unreadMessagesBase });
  }

  if (!ticket && groupContact) {
    ticket = await Ticket.findOne({
      where: {
        contactId: groupContact.id,
        whatsappId,
        channel,
      },
      order: [["updatedAt", "DESC"]]
    });

    if (ticket) {
      await ticket.update({
        status: "pending",
        userId: null,
        unreadMessagesBase,
        channel,
        isBot: true
      });
    }
  }
  const msgIsGroupBlock = await Setting.findOne({
    where: { key: "timeCreateNewTicket" }
  });

  const value = msgIsGroupBlock ? parseInt(msgIsGroupBlock.value, 10) : 7200;

  if (!ticket && !groupContact) {
    ticket = await Ticket.findOne({
      where: {
        updatedAt: {
          [Op.between]: [
            +subHours(new Date(), secondsToTime(value).h),
            +new Date()
          ]
        },
        contactId: contact.id,
        whatsappId,
        channel,
      },
      order: [["updatedAt", "DESC"]]
    });

    if (ticket) {
      await ticket.update({
        status: "pending",
        userId: null,
        unreadMessagesBase,
        channel,
        isBot: true
      });
    }
  }

  if (!ticket) {
    ticket = await Ticket.create({
      contactId: groupContact ? groupContact.id : contact.id,
      status: "pending",
      isGroup: !!groupContact,
      isBot: true,
      unreadMessagesBase,
      channel,
      whatsappId,
    });
  }

  ticket = await ShowTicketService(ticket.id);

  return ticket;
};

export default FindOrCreateTicketService;
