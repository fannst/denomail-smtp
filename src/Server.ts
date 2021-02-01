/*
Copyright 2020 fannst

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { Logger, LoggerLevel } from 'https://github.com/fannst/denomail-logger/raw/main/index.ts';
import { assert } from "https://deno.land/std@0.85.0/testing/asserts.ts";
import { EventEmitter, GenericFunction } from "https://deno.land/std/node/events.ts";

import { smtp_events } from './events/smtp/index.ts';
import { esmtp_events } from './events/esmtp/index.ts';
import { Session } from "./Session.ts";
import { Client } from "./Client.ts";

export const SMTP_SSL_PORT: number = 465;
export const SMTP_PLAIN_PORT: number = 25;

export const SMTPServerFlags = {
    /* The Listening Options */
    ListenSecure: (1 << 0), ListenPlain: (1 << 1),
    /* The Other Options */
    AllowStartTLS: (1 << 2)
};

export interface SMTPServerConfig {
    flags: number,
    cert_file?: string,
    key_file?: string
}

export class SMTPServer {
    private _config: SMTPServerConfig;
    private _logger: Logger;
    private _listener?: Deno.Listener;

    public constructor(config: SMTPServerConfig)
    {
        this._config = config;
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

    /**
     * Listens the SMTP Server on the configured ports
     */
    public listen = async (): Promise<void> => {
        if (this._config.flags & SMTPServerFlags.AllowStartTLS) {
            this._logger.info('STARTTLS Allowed from plain connections!');
        }
        

        if (this._config.flags & SMTPServerFlags.ListenPlain) {
            this._listener = Deno.listen({ port: SMTP_PLAIN_PORT });
        } else if (this._config.flags & SMTPServerFlags.ListenSecure) {
            assert(this._config.cert_file);
            assert(this._config.key_file);

            this._listener = Deno.listenTls({
                port: SMTP_SSL_PORT,
                certFile: this._config.cert_file,
                keyFile: this._config.key_file
            });

            this._logger.info(`SSL listener ready on port: ${SMTP_SSL_PORT}`);
        } else {
            throw new Error('Please specify which type of listening to perform!');
        }

        for await (const conn of this._listener) {
            this.handle_connection(conn);
        }
    };

    /**
     * Handles a socket connection
     * @param conn the connection
     */
    private handle_connection = async (conn: Deno.Conn): Promise<void> => {
        new Client(new Session(conn)).run();
    };
}

