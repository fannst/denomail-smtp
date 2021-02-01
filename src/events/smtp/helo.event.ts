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
import { Command, CommandArgument_Hostname } from '../../Command.ts';
import { Session, SessionFlags } from '../../Session.ts';

export const helo = async (logger: Logger, session: Session, command: Command): Promise<void> => {
    const argument: CommandArgument_Hostname = CommandArgument_Hostname.parse(command.args);

    const addr: Deno.NetAddr = (session.conn.remoteAddr as Deno.NetAddr);

    await new Reply(250, `Fannst ESMTP at your service, [${addr.hostname}:(${addr.port})]`).send(session.conn);

    // Sets the greeting done flag, to allow further operations
    if (!(session.flags & SessionFlags.GreetingDone)) {
        session.flags |= SessionFlags.GreetingDone;
    }
}
