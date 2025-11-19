// src/services/usageTracker.ts
import { AppState } from 'react-native';

export type UsagePayload = {
  idUser: number;
  workHours: number;     // total de horas trabalhadas
  meetings: number;
  clicks: number;
  doubleClicks: number;
  logDate: string;       // "YYYY-MM-DD"
};

class UsageTracker {
  private static _instance: UsageTracker;

  private userId: number | null = null;
  private sessionStart: number | null = null; // Date.now()
  private clicks = 0;
  private doubleClicks = 0;
  private meetings = 0; // você incrementa onde fizer sentido

  private constructor() {
    AppState.addEventListener('change', (state) => {
      if (state === 'background') {
        // no futuro, dá pra salvar parcial
      }
    });
  }

  public static get instance() {
    if (!this._instance) {
      this._instance = new UsageTracker();
    }
    return this._instance;
  }

  startSession(userId: number) {
    this.userId = userId;
    this.sessionStart = Date.now();
    this.clicks = 0;
    this.doubleClicks = 0;
    this.meetings = 0;
    console.log('[UsageTracker] Sessão iniciada para user', userId);
  }

  registerClick() {
    this.clicks += 1;
  }

  registerDoubleClick() {
    this.doubleClicks += 1;
  }

  registerMeeting() {
    this.meetings += 1;
  }

  private computeWorkHours(): number {
    if (!this.sessionStart) return 0;
    const now = Date.now();
    const diffMs = now - this.sessionStart;
    const diffHours = diffMs / (1000 * 60 * 60);
    return Number(diffHours.toFixed(2)); // 2 casas decimais
  }

  // 👉 Payload completo (pra Python, por exemplo)
  buildPayload(): UsagePayload | null {
    if (!this.userId || !this.sessionStart) return null;

    const workHours = this.computeWorkHours();
    const today = new Date();
    const logDate = today.toISOString().split('T')[0]; // "YYYY-MM-DD"

    return {
      idUser: this.userId,
      workHours,
      meetings: this.meetings,
      clicks: this.clicks,
      doubleClicks: this.doubleClicks,
      logDate,
    };
  }

  // 👉 Dados específicos para API C# (GsDailyLogs)
  buildDailyLogForCSharp():
    | { idUser: number; workHoursExtra: number; meetings: number }
    | null {
    if (!this.userId || !this.sessionStart) return null;

    const totalHours = this.computeWorkHours();
    const workHoursExtra = totalHours > 8 ? Number((totalHours - 8).toFixed(2)) : 0;

    return {
      idUser: this.userId,
      workHoursExtra,
      meetings: this.meetings,
    };
  }

  reset() {
    this.userId = null;
    this.sessionStart = null;
    this.clicks = 0;
    this.doubleClicks = 0;
    this.meetings = 0;
  }
}

export const usageTracker = UsageTracker.instance;
