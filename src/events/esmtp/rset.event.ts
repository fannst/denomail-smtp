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
import { Session } from '../../Session.ts';
import { ServerEvent } from "../../ServerEvent.ts";
import { Reply } from "../../Reply.ts";

const run = async (logger: Logger, session: Session, command: Command): Promise<void> => {
    logger.trace('Reset performed.');
    await new Reply(250, 'OK, Reset performed', '2.0.0').send(session.conn);
};


const post = async (logger: Logger, session: Session, command: Command): Promise<void> => {
    session.to = undefined;
    session.from = undefined;
    session.data = undefined;
    session.flags = 0;
};

export const event: ServerEvent = {
    run, pre: null, post
};
