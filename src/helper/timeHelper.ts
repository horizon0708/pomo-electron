
export function milliseceondToMinuteSeconds(ms: number): PomoTime {
    console.log(ms)
    const pureSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor( pureSeconds / 60 )
    const seconds = pureSeconds % 60
    return new PomoTime(minutes, seconds)
}

export class PomoTime {
    public minutes: number = 0
    public seconds: number = 0
    constructor(minutes: number, seconds:number) {
        this.minutes = minutes
        this.seconds = seconds
    }
}