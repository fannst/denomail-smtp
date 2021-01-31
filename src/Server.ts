import { Logger, LoggerLevel } from 'https://github.com/fannst/denomail-logger/raw/main/index.ts';
import { EventEmitter, GenericFunction } from "https://deno.land/std/node/events.ts";

import { smtp_events } from './events/smtp/index.ts';

export const SMTP_SSL_PORT: number = 465;
export const SMTP_PLAIN_PORT: number = 25;

export const SMTPServerFlags = {
    /* The Listening Options */
    ListenSecure: (1 << 0), ListenPlain: (1 << 1),
    /* The Other Options */
    AllowStartTLS: (1 << 2)
};

export interface SMTPServerConfig {
    flags: number
}

export class SMTPServer {
    private _config: SMTPServerConfig;
    private _event_emitter: EventEmitter;
    private _logger: Logger;

    public constructor(config: SMTPServerConfig)
    {
        this._config = config;
        this._event_emitter = new EventEmitter();
        this._logger = new Logger(LoggerLevel.Trace, 'SMTPServer');
    }

    /*********************************
     * Getters / Setters
     *********************************/

    public get config()
    {
        return this._config;
    }

    /*********************************
     * Server Methods
     *********************************/

    public register_default_events = (): void => {
        // SMTP Events
        for (let key in smtp_events) {
            this._event_emitter.addListener(key, smtp_events[key] as GenericFunction);
        }

        // ESMTP Events
        
        // FSMTP Events
    };

    public listen = async (): Promise<void> => {
        //
        // Informs the console about the flags
        //

        if (this._config.flags & SMTPServerFlags.AllowStartTLS)
        {
            this._logger.info('STARTTLS Allowed from plain connections!');
        }
        
        //
        // Creates the listeners
        //
        
        if (this._config.flags & SMTPServerFlags.ListenPlain) {
            this._logger.info(`PLAIN listener ready on port: ${SMTP_PLAIN_PORT}`)
        }

        if (this._config.flags & SMTPServerFlags.ListenSecure) {
            this._logger.info(`SSL listener ready on port: ${SMTP_SSL_PORT}`);
        }
    };
}