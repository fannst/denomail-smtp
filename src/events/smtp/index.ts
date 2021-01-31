import { quit } from './quit.event.ts';
import { data } from './data.event.ts';
import { mail } from './mail.event.ts';
import { rcpt } from './rcpt.event.ts';
import { helo } from './helo.event.ts';

export const smtp_events: {
    [key: string]: Function
} = {
    quit, data, mail, rcpt, helo
};
