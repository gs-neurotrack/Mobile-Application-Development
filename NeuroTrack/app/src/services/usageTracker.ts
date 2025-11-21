// src/services/usageTracker.ts
import { AppState, AppStateStatus } from 'react-native';

export type UsagePayload = {
  idUser: number;
  workHours: number;     
  meetings: number;
  clicks: number;
  doubleClicks: number;
  logDate: string;       
};

class UsageTracker {
  private static _instance: UsageTracker;

  private userId: number | null = null;
  private sessionStartMs: number | null = null;
  private lastResumeMs: number | null = null;
  private accumulatedActiveMs = 0;

  private clicks = 0;
  private doubleClicks = 0;
  private meetings = 0;

  private currentAppState: AppStateStatus = 'active';

  private constructor() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  public static get instance() {
    if (!this._instance) {
      this._instance = new UsageTracker();
    }
    return this._instance;
  }

  startSession(userId: number) {
    const now = Date.now();

    this.userId = userId;
    this.sessionStartMs = now;
    this.lastResumeMs = now;
    this.accumulatedActiveMs = 0;

    this.clicks = 0;
    this.doubleClicks = 0;
    this.meetings = 0;

    console.log('[UsageTracker] Sessão iniciada para user', userId);
  }

  registerClick() {
    if (!this.userId) return;
    this.clicks += 1;
  }

  registerDoubleClick() {
    if (!this.userId) return;
    this.doubleClicks += 1;
  }

  registerMeeting() {
    if (!this.userId) return;
    this.meetings += 1;
  }
    getMeetings(): number {
    return this.meetings;
  }



    setMeetings(value: number) {
    if (!this.userId) return; 
    const safe = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
    this.meetings = safe;
    console.log('[UsageTracker] setMeetings =>', safe);
  }

   incrementMeeting() {
    if (!this.userId) return;
    this.meetings += 1;
    console.log('[UsageTracker] incrementMeeting =>', this.meetings);
  }
  
  private handleAppStateChange = (nextState: AppStateStatus) => {
    if (this.currentAppState === 'active' && nextState.match(/inactive|background/)) {
      this.pauseActiveTime();
    } else if (
      (this.currentAppState === 'background' || this.currentAppState === 'inactive') &&
      nextState === 'active'
    ) {
      this.resumeActiveTime();
    }

    this.currentAppState = nextState;
  };

  private resumeActiveTime() {
    if (!this.userId) return;
    this.lastResumeMs = Date.now();
  }

  private pauseActiveTime() {
    if (!this.userId) return;
    if (!this.lastResumeMs) return;

    const now = Date.now();
    const diff = now - this.lastResumeMs;
    if (diff > 0) {
      this.accumulatedActiveMs += diff;
    }
    this.lastResumeMs = null;
  }


private getTotalActiveMinutes(): number {
  let totalMs = this.accumulatedActiveMs;

  if (this.lastResumeMs) {
    totalMs += Date.now() - this.lastResumeMs;
  }

  const totalMinutesFloat = totalMs / (1000 * 60); 
  const totalMinutes = Math.round(totalMinutesFloat); 

  console.log('[UsageTracker] totalMinutes (rounded):', totalMinutes);
  return totalMinutes; 
}


private getTotalActiveHours(): number {
  const minutes = this.getTotalActiveMinutes();
  const hours = minutes / 60;
  return Number(hours.toFixed(2)); 
}


  
  buildPayload(): UsagePayload | null {
    if (!this.userId || !this.sessionStartMs) {
      console.log('[UsageTracker] buildPayload sem sessão ativa');
      return null;
    }

    const workHours = this.getTotalActiveHours();
    const today = new Date();
    const logDate = today.toISOString().split('T')[0];

    const payload: UsagePayload = {
      idUser: this.userId,
      workHours,
      meetings: this.meetings,
      clicks: this.clicks,
      doubleClicks: this.doubleClicks,
      logDate,
    };

    console.log('[UsageTracker] buildPayload =>', payload);
    return payload;
  }



buildDailyLogForCSharp():
  | { idUser: number; workMinutes: number; meetings: number }
  | null {
  if (!this.userId || !this.sessionStartMs) {
    console.log('[UsageTracker] buildDailyLogForCSharp sem sessão ativa');
    return null;
  }

  const totalMinutes = this.getTotalActiveMinutes();

  const payload = {
    idUser: this.userId,
    workMinutes: totalMinutes, 
    meetings: this.meetings,
  };

  console.log('[UsageTracker] buildDailyLogForCSharp =>', payload);
  return payload;
}


  reset() {
    console.log('[UsageTracker] RESET');
    this.userId = null;
    this.sessionStartMs = null;
    this.lastResumeMs = null;
    this.accumulatedActiveMs = 0;
    this.clicks = 0;
    this.doubleClicks = 0;
    this.meetings = 0;
  }
}

export const usageTracker = UsageTracker.instance;
