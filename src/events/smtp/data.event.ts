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

import { Logger } from 'https://github.com/fannst/denomail-logger/raw/main/index.ts';
import { BufReader, ReadLineResult } from 'https://deno.land/std@0.85.0/io/bufio.ts';

import { Command } from '../../Command.ts';
import { Session, SessionFlags } from '../../Session.ts';
import { ServerEvent } from "../../ServerEvent.ts";
import { SequenceChecks } from "../../SequenceChecks.ts";
import { Reply } from "../../Reply.ts";

const decoder: TextDecoder = new TextDecoder();

const pre = async (logger: Logger, session: Session, command: Command): Promise<void> => {
    SequenceChecks.greetingDone(session);
    SequenceChecks.mailDone(session);
    SequenceChecks.rcptDone(session);
};

const run = async (logger: Logger, session: Session, command: Command): Promise<void> => {
    const reader: BufReader = new BufReader(session.conn);
    let total: string = '';

    await new Reply(354, 'OK, end with <CR><LF>.<CR><LF>', '2.0.0').send(session.conn);

    // Reads the MIME message
    const start_time: number = performance.now();
    while (true) {
        let res: ReadLineResult | null;
        let line: string = '';

        // Reads the line until Deno says there is nothing
        //  much left for the current line
        do {
            res = await reader.readLine();
            if (res === null) {
                return;
            }

            line += decoder.decode(res.line);
        } while (res.more);

        // Appends the line to the result, and checks if we're
        //  at the end of the message
        total += line + '\r\n';
        if (line === '.') {
            break;
        }
    }

    const end_time: number = performance.now();
    const kb_sec: number = Math.round((total.length / (end_time - start_time)));

    // Sends the confirmation
    logger.trace(`Data received of size ${total.length} bytes, ${kb_sec} KB/sec`);
    await new Reply(250, `Message queued for delivery, ${kb_sec} KB/sec`, '2.0.0').send(session.conn);
};

const post = async (logger: Logger, session: Session, command: Command): Promise<void> => {
    if (!(session.flags & SessionFlags.DataDone)) {
        session.flags |= SessionFlags.DataDone;
    }
};

export const event: ServerEvent = {
    run, pre, post
};
