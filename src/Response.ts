import { Request } from './Request.ts';

const encoder: TextEncoder = new TextEncoder();
const decoder: TextDecoder = new TextDecoder();

export class Response {
    public static line_length: number = 76;

    private _request: Request;

    public constructor(request: Request)
    {
        this._request = request;
    }

    /*********************************
     * Getters / Setters
     *********************************/

    public get request(): Request
    {
        return this.request;
    }

    /*********************************
     * Response Methods
     *********************************/

    /**
     * Sends a [CODE: Message] response
     * @param c the code
     * @param m the message
     */
    public send = async (c: number, m: string): Promise<void> => {
        if ('000 '.length + m.length <= Response.line_length) {
            await this.write_line(c, m, true);
        } else {
            this.write_lines(c, Response.wrap(m));
        }
    };

    /**
     * Wraps an message into multiple lines
     * @param m the message to wrap into multiple lines
     */
    private static wrap = (m: string): string[] => {
        const max_len: number = Response.line_length - '000 '.length;
        let result: string[] = [];

        for (let i = 0; i < m.length; ) {
            result.push(m.substr(i, max_len).trim());

            if (m.length - i > max_len) {
                i += Response.line_length;
            } else {
                i += m.length - i;
            }
        }

        return result;
    };

    /**
     * Writes a array of lines
     * @param c the code
     * @param t the lines
     */
    public write_lines = async (c: number, t: string[]): Promise<void> => {
        for (let i: number = 0; i < t.length; +i) {
            await this.write_line(c, t[i], i === (t.length - 1));
        }
    }

    /**
     * Writes an line
     * @param c the code
     * @param s the string
     * @param l is the last in sequence
     */
    public write_line = async (c: number, s: string, l: boolean): Promise<void> => {
        await this._request.conn.write(encoder.encode(`${c}${l ? ' ' : '-'}${s}\r\n`));
    };
}