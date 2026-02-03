export type Category = {
  id: string;
  name: string;
  count: number;
};

export type Chat = {
  id: string;
  name: string;
  categoryId: string;
  categoryLabel: string;
  time: string;
  preview: string;
  unread: number;
};

export type Message = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
};

export const categories: Category[] = [
  { id: "all", name: "Todos", count: 128 },
  { id: "voluntariado", name: "Voluntariado", count: 42 },
  { id: "medios", name: "Medios", count: 9 },
  { id: "donantes", name: "Donantes", count: 18 },
  { id: "equipo", name: "Equipo", count: 31 },
  { id: "prensa", name: "Prensa", count: 6 },
];

export const chats: Chat[] = [
  {
    id: "valentina",
    name: "Valentina R.",
    categoryId: "voluntariado",
    categoryLabel: "Voluntariado",
    time: "10:42",
    preview: "Quiero saber donde me anoto.",
    unread: 2,
  },
  {
    id: "prensa-local",
    name: "Prensa Local",
    categoryId: "medios",
    categoryLabel: "Medios",
    time: "10:05",
    preview: "Nos confirman el horario?",
    unread: 0,
  },
  {
    id: "carlos",
    name: "Carlos M.",
    categoryId: "donantes",
    categoryLabel: "Donantes",
    time: "Ayer",
    preview: "Gracias por el informe.",
    unread: 0,
  },
  {
    id: "equipo-barrio-norte",
    name: "Equipo Barrio Norte",
    categoryId: "equipo",
    categoryLabel: "Equipo",
    time: "Ayer",
    preview: "Listo el material para la reunion.",
    unread: 5,
  },
];

export const messages: Message[] = [
  {
    id: "m1",
    from: "them",
    text: "Hola! Quiero saber donde me anoto para ser voluntaria.",
    time: "10:31",
  },
  {
    id: "m2",
    from: "me",
    text: "Te paso el link y horarios disponibles.",
    time: "10:33",
  },
  {
    id: "m3",
    from: "them",
    text: "Genial, gracias!",
    time: "10:42",
  },
  {
    id: "m4",
    from: "me",
    text: "Mensaje enviado con plantilla aprobada.",
    time: "10:45",
  },
];
