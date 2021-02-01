import { CommandSequenceError } from "./Command.ts";
import { Session, SessionFlags } from "./Session.ts";

export class SequenceChecks {
    public static greetingDone = (session: Session): void => {
        if (!(session.flags & SessionFlags.GreetingDone)) {
            throw new CommandSequenceError('EHLO/HELO first');
        }
    };
}