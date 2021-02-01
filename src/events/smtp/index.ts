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

import { ServerEvent } from "../../ServerEvent.ts";
import { event as quitEvent } from './quit.event.ts';
import { event as mailEvent } from './mail.event.ts';
import { event as rcptEvent } from './rcpt.event.ts';
import { event as heloEvent } from './helo.event.ts';
import { event as dataEvent } from './data.event.ts';

export const smtp_events: {
    [key: string]: ServerEvent
} = {
    quit: quitEvent,
    mail: mailEvent, 
    rcpt: rcptEvent,
    helo: heloEvent,
    data: dataEvent
};
