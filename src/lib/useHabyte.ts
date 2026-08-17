"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { localRepository } from "./storage";
import { computeStats } from "./stats";
import type { Profile, SessionLog } from "./types";

/**
 * Veri sadece tarayıcıda olduğu için ilk render boş başlar ve efektte dolar;
 * böylece sunucu ve istemci HTML'i uyuşuyor.
 */
export function useHabyte() {
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sync = () => {
      setSessions(localRepository.listSessions());
      setProfile(localRepository.getProfile());
      setLoaded(true);
    };
    sync();
    return localRepository.subscribe(sync);
  }, []);

  const stats = useMemo(() => computeStats(sessions), [sessions]);

  const addSession = useCallback((session: SessionLog) => {
    localRepository.addSession(session);
  }, []);

  const deleteSession = useCallback((id: string) => {
    localRepository.deleteSession(id);
  }, []);

  const saveProfile = useCallback((next: Profile) => {
    localRepository.saveProfile(next);
  }, []);

  const clear = useCallback(() => {
    localRepository.clear();
  }, []);

  return {
    sessions,
    profile,
    stats,
    loaded,
    addSession,
    deleteSession,
    saveProfile,
    clear,
  };
}
