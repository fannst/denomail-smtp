import { smtp_events } from './smtp/index.ts';
import { esmtp_events } from './esmtp/index.ts';

export const events: {
    [key:string]: Function
} = {
    ...smtp_events, ...esmtp_events
};
