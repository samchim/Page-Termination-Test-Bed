This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Experiment Result

### Event Base Approach

-   record the API call received by BE
-   order of event no stable

| Browser                      | Mac OS Chrome                                                            | Mac OS Firefox                       | Mac OS Safari                            | Andriod Chrome                                                                     |
| ---------------------------- | ------------------------------------------------------------------------ | ------------------------------------ | ---------------------------------------- | ---------------------------------------------------------------------------------- |
| Switch Focus                 | "blur"                                                                   | "blur"                               | "blur"                                   | no event                                                                           |
| Switch App                   | N/A                                                                      | N/A                                  | N/A                                      | "blur"<br>--switch back--<br>"visibilitychange"                                    |
| Lock screen                  | "blur"<br>"visibilitychange"                                             | "visibilitychange"<br>"blur"         | "visibilitychange"<br>"blur"             | -- event detected but not sent ---<br>"visibilitychange"<br>"blur"                 |
| Switch Tab                   | "visibilitychange"<br>"blur"                                             | "blur"<br>"visibilitychange"         | "blur"<br>"visibilitychange"             | "visibilitychange"<br>"blur"                                                       |
| Redirect to other site       | "beforeunload"<br>"pagehide"<br>"unload"                                 | "blur"<br>"beforeunload"<br>"unload" | "pagehide"                               | "beforeunload"<br>"pagehide"<br>"unload"                                           |
| Redirect to same site        | no event                                                                 | no event                             | no event                                 | no event                                                                           |
| Fold / Unflod screen         | N/A                                                                      | N/A                                  | N/A                                      | "blur"<br>"visibilitychange"                                                       |
| Close Tab (while Acative)    | "visibilitychange"<br>"pagehide"<br>"beforeunload"<br>"unload"<br>"blur" | "beforeunload"<br>"blur"<br>"unload" | "beforeunload"<br>"pagehide"<br>"unload" | "visibilitychange"<br>"blur"                                                       |
| Close Tab (while Hidden)     | "beforeunload"<br>"pagehide"<br>"unload"                                 | "beforeunload"<br>"unload"           | "beforeunload"<br>"pagehide"<br>"unload" | no event                                                                           |
| Close Window (while Acative) | "visibilitychange"<br>"beforeunload"<br>"pagehide"<br>"unload"<br>"blur" | "beforeunload"<br>"blur"<br>"unload" | "beforeunload"<br>"pagehide"<br>"unload" | -- close the only tab --<br>"visibilitychange"<br>"blur"<br>"pagehide"<br>"unload" |
| Quit App (while Acative)     | "visibilitychange"<br>"beforeunload"<br>"pagehide"<br>"unload"           | "beforeunload"                       | "beforeunload"                           | no event                                                                           |
| Discard (mannually)          | no event                                                                 | N/A                                  | N/A                                      | N/A                                                                                |

### Service Worker Approach

-   heart beat methodology
    -   SW check page live each 1000ms
    -   send signal to BE if no feedback at 900ms
-   Mobile browser require SSL in order to register service worker
    -   even self-sign certificate can't work

| Browser           | Mac OS Chrome | Mac OS Firefox | Mac OS Safari | Android Chrome |
| ----------------- | ------------- | -------------- | ------------- | -------------- |
| Close Tab         | Yes           | Yes            | Yes           | N/A            |
| Close Window      | Yes           | Yes            | Yes           | N/A            |
| Close Last Window | No            | Yes            | Yes           | N/A            |
| Quit App          | No            | No             | No            | N/A            |

-   service worker would not die immediately when
    -   page is closed
    -   window is closed
    -   page is discarded
-   BE cannot receive active "session end" message when
    -   all windows are closed (chrome)
    -   quit app
-   Only certain feature support in background
    -   push notification
    -   background sync
    -   periodic background sync
        -   most likely to fit in this task, but experimental and only chrome
-   on Mobile, service worker need HTTPS to work
    -   even self sign certificate cant work
