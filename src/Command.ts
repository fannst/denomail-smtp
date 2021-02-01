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
import { Address } from "https://raw.githubusercontent.com/fannst/denomail-mime/main/src/Address.ts";

export class CommandSequenceError extends Error {}

export class CommandError extends Error {
    private _code: number;
    private _enchanced_code?: string;
    
    public constructor(m: string, c: number, ec?: string) {
        super(m);

        this._code = c;
        this._enchanced_code = ec;
    }

    public get code() {
        return this._code;
    }

    public get enchanced_code() {
        return this._enchanced_code;
    }
}

export class CommandArgument_Hostname {
    private _hostname: string;

    public constructor (h: string) {
        this._hostname = h;
    }

    public get hostname() {
        return this._hostname;
    }

    public static parse = (args?: string[]): CommandArgument_Hostname => {
        if (!args || args.length < 1) {
            throw new CommandError('Not enough arguments.', 501, '5.5.4')
        } else if (args.length > 1) {
            throw new CommandError('Too many arguments.', 501, '5.5.4');
        }

        return new CommandArgument_Hostname(args[0]);
    }
};

export class CommandArgument_Address {
    private _address: Address;

    public constructor (a: Address) {
        this._address = a;
    }

    public get address() {
        return this._address;
    }

    public static parse = (args?: string[]): CommandArgument_Address => {
        if (!args || args.length < 1) {
            throw new CommandError('Not enough arguments.', 501, '5.5.4')
        } else if (args.length > 1) {
            throw new CommandError('Too many arguments.', 501, '5.5.4');
        }
        
        const splitted: string[] = args[0].split(':');
        if (splitted.length < 2) {
            throw new CommandError('Invalid address argument.', 501, '5.1.3');
        }
        try {
            return new CommandArgument_Address(Address.parse(splitted[1]));
        } catch (e) {
            if (e instanceof SyntaxError) {
                throw new CommandError(e.message, 501, '5.1.3');
            }
            throw e;
        }
    };
}

export type CommandArgument_Null = null;

export type CommandParsedArgument = CommandArgument_Address | CommandArgument_Null | CommandArgument_Hostname;

export class Command
{
    private _command: string;
    private _args?: string[];

    /**
     * Creates a new request class
     * @param c the command
     * @param a the arguments
     */
    public constructor(c: string, a?: string[])
    {
        this._command = c;
        this._args = a;
    }

    /*********************************
     * Getters / Setters
     *********************************/

    public get command() {
        return this._command;
    }

    public get args() {
        return this._args;
    }
}
