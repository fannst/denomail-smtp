import { smtp_events } from './smtp/index.ts';
import { esmtp_events } from './esmtp/index.ts';
import { ServerEvent } from "../ServerEvent.ts";

export const events: {
    [key:string]: ServerEvent
} = {
    ...smtp_events, ...esmtp_events
};
