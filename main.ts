import { readLines } from "https://deno.land/std/io/bufio.ts";
import { Logger, LoggerLevel } from 'https://github.com/fannst/denomail-logger/raw/main/index.ts';

import { SMTPServer, SMTPServerFlags } from './src/Server.ts';

const logger: Logger = new Logger(LoggerLevel.Trace, 'Main');
logger.warn('Fannst SMTP is still highly under development, do not use it for any serious purpose!');

const smtp_server: SMTPServer = new SMTPServer({
    flags: SMTPServerFlags.AllowStartTLS | SMTPServerFlags.ListenPlain
});

smtp_server.listen();
