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

import { Reply } from '../../Reply.ts';
import { Command, CommandArgument_Address, CommandSequenceError } from '../../Command.ts';
import { Session, SessionFlags } from '../../Session.ts';
import { SequenceChecks } from "../../SequenceChecks.ts";
import { ServerEvent } from "../../ServerEvent.ts";

const pre = async (logger: Logger, session: Session, command: Command): Promise<void> => {
    SequenceChecks.greetingDone(session);

    if (session.flags & SessionFlags.MailDone) {
        throw new CommandSequenceError('MAIL FROM already sent');
    }
};

const run = async (logger: Logger, session: Session, command: Command): Promise<void> => {
    const argument: CommandArgument_Address = CommandArgument_Address.parse(command.args);

    logger.trace(`Received from: ${argument.address.toString()}`);
    session.from = argument.address;

    await new Reply(250, `OK, from: ${argument.address.toString()}`, '2.1.0').send(session.conn);
}


const post = async (logger: Logger, session: Session, command: Command): Promise<void> => {
    if (!(session.flags & SessionFlags.MailDone)) {
        session.flags |= SessionFlags.MailDone;
    }
};

export const event: ServerEvent = {
    run, pre, post
};
