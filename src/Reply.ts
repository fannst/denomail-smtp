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

import { Command } from './Command.ts';

const encoder: TextEncoder = new TextEncoder();
const decoder: TextDecoder = new TextDecoder();

export class Reply {
    public static prefix: string = 'fsmtp';
    public static line_length: number = 76;

    private _code: number;
    private _enchanced_code?: string;
    private _message: string;

    /**
     * Creates a new reply
     * @param c the code
     * @param m the message
     * @param ec the enchanced code
     */
    public constructor(c: number, m: string, ec?: string)
    {
        this._code = c;
        this._message = m;
        this._enchanced_code = ec;
    }

    /*********************************
     * Getters / Setters
     *********************************/

    /*********************************
     * Response Methods
     *********************************/

    /**
     * Sends a [CODE: Message] response
     * @param conn the connection
     * @param c the code
     * @param m the message
     */
    public send = async (conn: Deno.Conn): Promise<void> => {
        const t: string = `${this._message} - ${Reply.prefix}`;

        if ('000 '.length + this._message.length <= Reply.line_length) {
            await Reply.write_line(conn, this._code, t, true, this._enchanced_code);
        } else {
            await Reply.write_lines(conn, this._code, Reply.wrap(t));
        }
    };

    /**
     * Wraps an message into multiple lines
     * @param m the message to wrap into multiple lines
     */
    private static wrap = (m: string): string[] => {
        const max_len: number = Reply.line_length - '000 '.length;
        let result: string[] = [];

        for (let i = 0; i < m.length; ) {
            result.push(m.substr(i, max_len).trim());

            if (m.length - i > max_len) {
                i += Reply.line_length;
            } else {
                i += m.length - i;
            }
        }

        return result;
    };

    /**
     * Writes a array of lines
     * @param conn the connection
     * @param c the code
     * @param t the lines
     */
    public static write_lines = async (conn: Deno.Conn, c: number, t: string[]): Promise<void> => {
        for (let i: number = 0; i < t.length; ++i) {
            await Reply.write_line(conn, c, t[i], i === (t.length - 1));
        }
    }

    /**
     * Writes an line
     * @param conn the connection
     * @param c the code
     * @param s the string
     * @param l is the last in sequence
     * @param ec enchanced code
     */
    public static write_line = async (conn: Deno.Conn, c: number, s: string, l: boolean, ec?: string): Promise<void> => {
        if (ec && l) {
            await conn.write(encoder.encode(`${c} ${ec} ${s}\r\n`));
        } else {
            await conn.write(encoder.encode(`${c}${l ? ' ' : '-'}${s}\r\n`));
        }
    };
}