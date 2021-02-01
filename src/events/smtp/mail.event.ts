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

const validate = (session: Session): void => {
    SequenceChecks.greetingDone(session);

    if (session.flags & SessionFlags.MailDone) {
        throw new CommandSequenceError('MAIL FROM already sent');
    }
};

export const mail = async (logger: Logger, session: Session, command: Command, reply: Reply): Promise<void> => {
    validate(session);

    // Parses the address argument
    const argument: CommandArgument_Address = CommandArgument_Address.parse(command.args);

    // Logs to the console that we know who sent it
    logger.trace(`Received from: ${argument.address.toString()}`);
    session.from = argument.address;

    // If not set yet, set the RcptDone flag to indicate that the MAIL step
    //  is done
    if (!(session.flags & SessionFlags.RcptDone)) {
        session.flags |= SessionFlags.RcptDone;
    }
}
