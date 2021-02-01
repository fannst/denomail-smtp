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
import { event as helpEvent } from './help.event.ts';
import { event as EhloEvent } from './ehlo.event.ts';
import { event as starttlsEvent } from './starttls.event.ts';
import { event as rsetEvent } from './rset.event.ts';
import { event as noopEvent } from './noop.event.ts';

export const esmtp_events: {
    [key: string]: ServerEvent
} = {
    help: helpEvent,
    ehlo: EhloEvent,
    starttls: starttlsEvent,
    rset: rsetEvent,
    noop: noopEvent
};
