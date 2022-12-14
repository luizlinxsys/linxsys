import Mustache from "mustache";
import Contact from "../models/Contact";

export default (body: string, contact: Contact): string => {
  const view = {
    name: contact ? contact.name : "",
    gretting: greeting()
  };
  return Mustache.render(body, view);
};

export const greeting = (): string => {
  const greetings = ["Boa madrugada", "Bom dia", "Boa tarde", "Boa noite"];
  const h = new Date().getHours();
  return greetings[(h / 6) >> 0];
};
