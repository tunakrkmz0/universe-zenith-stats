"use client";

import { useEffect, useState } from "react";

import {
    getRecentLolPlayers,
    LolApiClientError,
} from "@/lib/lol-api-client";
import type { LolRecentPlayer } from "@/types/lol-analysis";
import Link from "next/link";

type RecentPlayersPanelProps = {
    refreshKey?: number;
};

function formatDate(value: string | Date | null): string {
    if (!value) {
        return "Henüz yok";
    }

    return new Intl.DateTimeFormat("tr-TR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(value));
}

export function RecentPlayersPanel({ refreshKey = 0 }: RecentPlayersPanelProps) {
    const [players, setPlayers] = useState<LolRecentPlayer[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function loadRecentPlayers() {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await getRecentLolPlayers();
            setPlayers(response.players);
        } catch (error) {
            if (error instanceof LolApiClientError) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Son analizlenen oyuncular alınamadı.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        void loadRecentPlayers();
    }, [refreshKey]);

    return (
        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                        Geçmiş
                    </p>
                    <h2 className="mt-1 text-xl font-semibold">
                        Son Analizlenen Oyuncular
                    </h2>
                </div>

                <button
                    type="button"
                    onClick={loadRecentPlayers}
                    disabled={isLoading}
                    className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isLoading ? "Yükleniyor..." : "Yenile"}
                </button>
            </div>

            {errorMessage && (
                <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {errorMessage}
                </div>
            )}

            {!isLoading && players.length === 0 && !errorMessage && (
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">
                    Henüz kayıtlı analiz yok.
                </div>
            )}

            <div className="flex flex-col gap-3">
                {players.map((player) => (
                    <Link
                        key={player.id}
                        href={`/lol/player/${player.id}`}
                        className="block rounded-2xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-cyan-400"
                    >
                        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                            <div>
                                <p className="font-semibold text-slate-100">
                                    {player.gameName}#{player.tagLine}
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    {player.region.toUpperCase()} · {player.analyzedMatchCount} maç
                                </p>
                            </div>

                            <div className="text-sm text-slate-400 md:text-right">
                                <p>Son analiz</p>
                                <p className="font-medium text-slate-300">
                                    {formatDate(player.lastFetchedAt)}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}