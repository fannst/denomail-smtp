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

import { Command } from '../../Command.ts';
import { Reply } from "../../Reply.ts";
import { SequenceChecks } from "../../SequenceChecks.ts";
import { Session } from '../../Session.ts';
import { ServerEvent } from "../../ServerEvent.ts";

const pre = async (logger: Logger, session: Session, command: Command): Promise<void> => {
    SequenceChecks.greetingDone(session);
};

const run = async (logger: Logger, session: Session, command: Command): Promise<void> => {
    logger.trace('Upgrading to STARTTLS.');
    await new Reply(220, 'OK, Go ahead!', '2.0.0').send(session.conn);

    // TODO: StartTLS - Not supported in Deno atm
}


const post = async (logger: Logger, session: Session, command: Command): Promise<void> => {

};

export const event: ServerEvent = {
    run, pre, post
};
