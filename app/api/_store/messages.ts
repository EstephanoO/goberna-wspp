export type StoredMessage = {
  id: string;
  from: string;
  to: string;
  body: string;
  direction: "inbound" | "outbound";
  time: string;
};

const globalForMessages = globalThis as typeof globalThis & {
  __wsppMessages?: StoredMessage[];
};

const defaultMessages: StoredMessage[] = [];

const messages = globalForMessages.__wsppMessages ?? defaultMessages;

if (!globalForMessages.__wsppMessages) {
  globalForMessages.__wsppMessages = messages;
}

export const addMessage = (message: StoredMessage) => {
  messages.push(message);
};

export const listMessages = () => {
  return messages;
};
