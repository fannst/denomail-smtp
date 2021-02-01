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

    if (!(session.flags & SessionFlags.MailDone)) {
        throw new CommandSequenceError('Send FROM first');
    }
};

export const rcpt = async (logger: Logger, session: Session, command: Command, reply: Reply): Promise<void> => {
    validate(session);

    // Parses the address argument
    const argument: CommandArgument_Address = CommandArgument_Address.parse(command.args);

    // Prints the recipient to the console, and adds it to the destination
    //  address list in the sessin
    logger.trace(`Message to: ${argument.address.toString()}`);
    session.addTo(argument.address);

    // Sets the flag to indicate at least one RCPT address is set
    if (!(session.flags & SessionFlags.RcptDone)) {
        session.flags |= SessionFlags.RcptDone;
    }
}
