export default class TouchEvent {
  static SWIPE_THRESHOLD: number = 0;

  static SWIPE_LEFT: number = 1;
  static SWIPE_RIGHT: number = 2;
  static SWIPE_UP: number = 3;
  static SWIPE_DOWN: number = 4;

  public startEvent: TouchCustomEvents;
  public endEvent: TouchCustomEvents | null;

  constructor(startEvent: TouchCustomEvents, endEvent?: TouchCustomEvents | null) {
    this.startEvent = startEvent;
    this.endEvent = endEvent || null;
  }

  public isSwipeLeft(): boolean {
    return this.getSwipeDirection() === TouchEvent.SWIPE_LEFT;
  }

  public isSwipeRight(): boolean {
    return this.getSwipeDirection() === TouchEvent.SWIPE_RIGHT;
  }

  public getSwipeDirection(): number | null {
    if (!this.startEvent.changedTouches || !this.endEvent?.changedTouches) {
      return null;
    }

    let start = this.startEvent.changedTouches[0];
    let end = this.endEvent.changedTouches[0];

    if (!start || !end) {
      return null;
    }

    let horizontalDifference = start.screenX - end.screenX;
    let verticalDifference = start.screenY - end.screenY;

    if (Math.abs(horizontalDifference) > Math.abs(verticalDifference)) {
      if (horizontalDifference >= TouchEvent.SWIPE_THRESHOLD) {
        return TouchEvent.SWIPE_LEFT;
      } else if (horizontalDifference <= -TouchEvent.SWIPE_THRESHOLD) {
        return TouchEvent.SWIPE_RIGHT;
      }
    } else {
      if (verticalDifference >= TouchEvent.SWIPE_THRESHOLD) {
        return TouchEvent.SWIPE_UP;
      } else if (verticalDifference <= -TouchEvent.SWIPE_THRESHOLD) {
        return TouchEvent.SWIPE_DOWN;
      }
    }

    return null;
  }

  public setEndEvent(endEvent: TouchCustomEvents | null): void {
    this.endEvent = endEvent;
  }
}
