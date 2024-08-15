"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useCallback, useEffect, useState } from "react";
import { METHODS } from "http";
import Link from "next/link";

export default function Home() {
    const [sessionId, setSessionId] = useState("");

    useEffect(() => {
        const fetchCreate = async () => {
            console.log(`🤖 useEffect`);
            const response = await fetch("api/session_create", {
                method: "POST",
            });
            const responseJSON = await response.json();

            setSessionId(responseJSON.sessionId);
        };

        fetchCreate();
    }, []);

    useEffect(() => {
        const visibilityChangeCallback = async () => {
            if (document.hidden) {
                const deleteUrl = `api/session_delete/${sessionId}`;
                // console.log(`🤖 fetch: `, deleteUrl);
                // await fetch(deleteUrl, { method: "POST" });

                const postUrl = `api/session_pause/${sessionId}`;
                console.log(`🤖 navigator.sendBeacon: `, postUrl);
                await navigator.sendBeacon(postUrl);
            } else {
                console.log(`🤖 welcome back`);
            }
        };
        document.addEventListener("visibilitychange", visibilityChangeCallback);

        const blurCallback = async () => {
            console.log(`🤖 blur`);
            const blurUrl = `api/session_blur/${sessionId}`;
            // await fetch(blurUrl, { method: "POST" });
            await navigator.sendBeacon(blurUrl);
        };
        window.addEventListener("blur", blurCallback);

        const freezeCallback = async () => {
            const freezeUrl = `api/session_freeze/${sessionId}`;
            // await fetch(freezeUrl, { method: "POST" });
            await navigator.sendBeacon(freezeUrl);
        };
        window.addEventListener("freeze", freezeCallback);

        const pagehideCallback = async () => {
            const pagehideUrl = `api/session_pagehide/${sessionId}`;
            // await fetch(pagehideUrl, { method: "POST" });
            await navigator.sendBeacon(pagehideUrl);
        };
        window.addEventListener("pagehide", pagehideCallback);

        const beforeunloadCallback = async () => {
            const beforeunloadUrl = `api/session_beforeunload/${sessionId}`;
            // await fetch(beforeunloadUrl, { method: "POST" });
            await navigator.sendBeacon(beforeunloadUrl);
        };
        window.addEventListener("beforeunload", beforeunloadCallback);

        const unloadCallback = async () => {
            const unloadUrl = `api/session_unload/${sessionId}`;
            // await fetch(unloadUrl, { method: "POST" });
            await navigator.sendBeacon(unloadUrl);
        };
        window.addEventListener("unload", unloadCallback);

        return () => {
            document.removeEventListener(
                "visibilitychange",
                visibilityChangeCallback,
            );
            window.removeEventListener("blur", blurCallback);
            window.removeEventListener("freeze", freezeCallback);
            window.removeEventListener("pagehide", pagehideCallback);
            window.removeEventListener("beforeunload", beforeunloadCallback);
            window.removeEventListener("unload", unloadCallback);
        };
    }, [sessionId]);

    return (
        <main className={styles.main}>
            <div className={styles.description}>
                {sessionId}
                <Link href={"/testing"}>Test</Link>
                <p>
                    Get started by editing&nbsp;
                    <code className={styles.code}>src/app/page.tsx</code>
                </p>
                <div>
                    <a
                        href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        By{" "}
                        <Image
                            src="/vercel.svg"
                            alt="Vercel Logo"
                            className={styles.vercelLogo}
                            width={100}
                            height={24}
                            priority
                        />
                    </a>
                </div>
            </div>

            <div className={styles.center}>
                <Image
                    className={styles.logo}
                    src="/next.svg"
                    alt="Next.js Logo"
                    width={180}
                    height={37}
                    priority
                />
            </div>

            <div className={styles.grid}>
                <a
                    href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                    className={styles.card}
                    // target="_blank"
                    rel="noopener noreferrer"
                >
                    <h2>
                        Docs <span>-&gt;</span>
                    </h2>
                    <p>
                        Find in-depth information about Next.js features and
                        API.
                    </p>
                </a>

                <a
                    href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                    className={styles.card}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h2>
                        Learn <span>-&gt;</span>
                    </h2>
                    <p>
                        Learn about Next.js in an interactive course
                        with&nbsp;quizzes!
                    </p>
                </a>

                <a
                    href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                    className={styles.card}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h2>
                        Templates <span>-&gt;</span>
                    </h2>
                    <p>Explore starter templates for Next.js.</p>
                </a>

                <a
                    href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                    className={styles.card}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h2>
                        Deploy <span>-&gt;</span>
                    </h2>
                    <p>
                        Instantly deploy your Next.js site to a shareable URL
                        with Vercel.
                    </p>
                </a>
            </div>
        </main>
    );
}
