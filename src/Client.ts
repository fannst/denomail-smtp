import EventEmitter from "https://deno.land/std@0.85.0/node/events.ts";
import { BufReader, ReadLineResult } from 'https://deno.land/std@0.85.0/io/bufio.ts';
import { Logger, LoggerLevel } from 'https://github.com/fannst/denomail-logger/raw/main/index.ts';

import { Session } from "./Session.ts";
import { Command, CommandSequenceError, CommandArgument_Address, CommandArgument_Hostname, CommandError } from "./Command.ts";
import { Reply } from "./Reply.ts";
import { events } from './events/index.ts';

const decoder: TextDecoder = new TextDecoder();
const encoder: TextEncoder = new TextEncoder();

export class Client {
    private _session: Session;
    private _logger: Logger;
    
    public constructor(session: Session) {
        this._session = session;
        this._logger = new Logger(LoggerLevel.Trace, `SMTP/${(session.conn.remoteAddr as Deno.NetAddr).hostname}`);
    }
    
    public run = async (): Promise<void> => {
        this._logger.trace('Client connected!');

        // Sends the initial message
        new Reply(220, `Fannst ESMTP Ready at: ${new Date().toUTCString()}`).send(this._session.conn);

        // Starts the event loop
        for (;;) {
            let line: string | null;

            // Attempts to read the line, if this fails throw an error
            //  to the logger
            try {
                line = await this.read_line();
            } catch (e) {
                this._logger.error(`An error occured while reading line: ${e}`);
                break;
            }

            // If the line is null, break since the client disconnected
            if (line === null) {
                break;
            }

            // Call the line callback
            this.on_line(this._logger, line);
        }

        this._logger.trace('Client disconnected.');
        this._session.close();
    };

    /**
     * Since the deno buffered reader does not read a real line, we created a function
     *  ourselves to read that line
     */
    private read_line = async (): Promise<string | null> => {
        const reader: BufReader = new BufReader(this._session.conn);
        let line: string = '';

        for (;;) {
            let lineResult: ReadLineResult | null;

            // Attempts to read the line, but if this throws an exception
            //  it may be caused by closed connection, if so check if the
            //  connection is closed, if so error will be returning null.
            try {
                lineResult = await reader.readLine();
            } catch (e) {
                if (this._session.conn_open) {
                    throw e;
                } else {
                    return null;
                }
            }

            // If the line result is null, return null
            if (lineResult === null) {
                return null;
            }

            // Checks if there is more data left, if so just continue and append
            //  else return with the current data
            line += decoder.decode(lineResult.line);
            if (!lineResult.more) {
                break;
            }
        }

        return line;
    };


    /**
     * Handles an line which is entered on the socket
     * @param logger the logger
     * @param line the line
     */
    private on_line = async (logger: Logger, line: string): Promise<void> => {
        line = line.replace(/\s+/g, ' ').trim();
        let splitted: string[] = line.split(' ');

        // Gets the first element of the array, which is the command
        //  and use the others as arguments
        const command: Command = new Command(splitted[0].toLowerCase(), splitted.slice(1));
        try {
            if (!events[command.command]) {
                throw new CommandError('Command not found', 502, '5.5.1');
            }

            await events[command.command](logger, this._session, command);
        } catch (e) {
            if (e instanceof CommandError) {
                new Reply(e.code, e.message, e.enchanced_code).send(this._session.conn);
            } else if (e instanceof CommandSequenceError) {
                new Reply(503, e.message, '5.5.1').send(this._session.conn);
            }
        }
    };
}