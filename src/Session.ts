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

import { Address } from 'https://github.com/fannst/denomail-mime/raw/main/index.ts';

export const SessionFlags = {
    GreetingDone: (1 << 0),
    MailDone: (1 << 1),
    RcptDone: (1 << 2),
    DataDone: (1 << 3)
};

export class Session {
    private _flags: number;
    private _conn: Deno.Conn;
    private _conn_open: boolean;
    private _to?: Address[];
    private _from?: Address;
    private _data?: string;

    public constructor(c: Deno.Conn)
    {
        this._conn = c;
        this._conn_open = true;
        this._flags = 0;
    }

    /*********************************
     * Getters / Setters
     *********************************/

    public get data() {
        return this.data;
    }

    public set data(d: string | undefined) {
        this._data = d;
    }

    public get conn_open() {
        return this._conn_open;
    }

    public get conn() {
        return this._conn;
    }

    public set conn(c: Deno.Conn) {
        this._conn = c;
    }

    public get flags() {
        return this._flags;
    }

    public set flags(f: number) {
        this._flags = f;
    }

    public set from(a: Address | undefined) {
        this._from = a;
    }

    public set to(t: Address[] | undefined) {
        this._to = t;
    }

    public addTo = (a: Address): void => {
        if (this._to === undefined) {
            this._to = [];
        }

        this._to.push(a);
    }

    public get from(): Address | undefined {
        return this._from;
    }

    public get to(): Address[] | undefined {
        return this._to;
    }

    /*********************************
     * Instance methods
     *********************************/

    public close() {
        if (this._conn_open) {
            this._conn_open = false;
            this._conn.close();
        }
    }
}