import { Logger, LoggerLevel } from 'https://github.com/fannst/denomail-logger/raw/main/index.ts';

import { SMTPServer, SMTPServerFlags } from './src/Server.ts';

const logger: Logger = new Logger(LoggerLevel.Trace, 'Main');
logger.warn('Fannst SMTP is still highly under development, do not use it for any serious purpose!');

const smtp_server: SMTPServer = new SMTPServer({
    flags: SMTPServerFlags.AllowStartTLS | SMTPServerFlags.ListenPlain | SMTPServerFlags.ListenSecure
});

smtp_server.listen();
smtp_server.register_default_events();

logger.info('SMTP Server Ready!');