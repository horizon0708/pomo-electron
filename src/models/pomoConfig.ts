import { PomoInterruptionReason } from "./pomoInterruption";

export default class PomoConfig {
    public pomoDuration:number = 1 * 60 * 1000
    public breakDuration = 0.05 * 60 * 1000
    public notifyOnEnd = true;
    public soundOnEnd = true;
    public autoStartAfterBreak = false;
    public interruptionReasons: PomoInterruptionReason[] = []
} 