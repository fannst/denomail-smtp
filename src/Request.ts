export class Request
{
    private _conn: Deno.Conn;

    public constructor(conn: Deno.Conn)
    {
        this._conn = conn;
    }

    /*********************************
     * Getters / Setters
     *********************************/

    public get conn()
    {
        return this._conn;
    }
}
