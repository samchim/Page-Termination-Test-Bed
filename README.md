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

In order to register service worker on mobile platform, a public SSL certificate is required. You can get one by deploying this project on [Vercel](https://vercel.com/docs/deployments/overview)

## Result

### event base approach

-   hock methodology
    -   add event listener to lifecycle events
        -   visibilitychange
        -   blur
        -   freeze
        -   pagehide
        -   beforeunload
        -   unload
    -   use `sendBeacon()` to send POST request to BE
    -   record the reqeuset BE recevied in different action

| Browser                      | Mac OS Chrome                                                            | Mac OS Firefox                       | Mac OS Safari                            | Andriod Chrome                                                                                      | Andriod Firefox                                                | iOS Safari                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------ | ------------------------------------ | ---------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Switch Focus                 | "blur"                                                                   | "blur"                               | "blur"                                   | no event                                                                                            | N/A                                                            | N/A                                                                                             |
| Switch App                   | N/A                                                                      | N/A                                  | N/A                                      | "blur"<br>--switch back--<br>"visibilitychange"                                                     | "visibilitychange"                                             | "blur"<br>"visibilitychange"                                                                    |
| Lock screen                  | "blur"<br>"visibilitychange"                                             | "visibilitychange"<br>"blur"         | "visibilitychange"<br>"blur"             | -- event detected but not sent ---<br>"visibilitychange"<br>"blur"                                  | "visibilitychange"                                             | "blur"<br>"visibilitychange"                                                                    |
| Switch Tab                   | "visibilitychange"<br>"blur"                                             | "blur"<br>"visibilitychange"         | "blur"<br>"visibilitychange"             | "visibilitychange"<br>"blur"                                                                        | "visibilitychange"                                             | ---tab selector---<br>"blur"<br>---select other tab---<br>"visibilitychange"<br>                |
| Redirect to other site       | "beforeunload"<br>"pagehide"<br>"unload"                                 | "blur"<br>"beforeunload"<br>"unload" | "pagehide"                               | "beforeunload"<br>"pagehide"<br>"unload"                                                            | "beforeunload"<br>"pagehide"<br>"visibilitychange"<br>"unload" | "visibilitychange"<br>"pagehide"                                                                |
| Redirect to same site        | no event                                                                 | no event                             | no event                                 | no event                                                                                            | no event                                                       | no event                                                                                        |
| Fold / Unflod screen         | N/A                                                                      | N/A                                  | N/A                                      | "blur"<br>"visibilitychange"                                                                        | "visibilitychange"                                             | N/A                                                                                             |
| Close Tab (while Acative)    | "visibilitychange"<br>"pagehide"<br>"beforeunload"<br>"unload"<br>"blur" | "beforeunload"<br>"blur"<br>"unload" | "beforeunload"<br>"pagehide"<br>"unload" | "visibilitychange"<br>"blur"                                                                        | "visibilitychange"<br>"pagehide"<br>"unload"<br>"blur"         | ---tab selector---<br>"blur"<br>---close tab---<br>"pagehide"<br>"visibilitychange"<br>"unload" |
| Close Tab (while Hidden)     | "beforeunload"<br>"pagehide"<br>"unload"                                 | "beforeunload"<br>"unload"           | "beforeunload"<br>"pagehide"<br>"unload" | no event                                                                                            | "blur"<br>"unload"<br>"pagehide"                               | "pagehide"<br>"visibilitychange"<br>"unload"                                                    |
| Close Window (while Acative) | "visibilitychange"<br>"beforeunload"<br>"pagehide"<br>"unload"<br>"blur" | "beforeunload"<br>"blur"<br>"unload" | "beforeunload"<br>"pagehide"<br>"unload" | -- close the only tab --<br>"visibilitychange"<br>"blur"<br>"pagehide"<br>"unload"                  | "visibilitychange"<br>"pagehide"<br>"unload"                   | ---tab selector---<br>"blur"<br>---close tab---<br>"pagehide"<br>"visibilitychange"<br>"unload" |
| Quit App (while Acative)     | "visibilitychange"<br>"beforeunload"<br>"pagehide"<br>"unload"           | "beforeunload"                       | "beforeunload"                           | ---Galaxy Fold 3---<br>no event<br>---Google Pixel---<br>"blur"<br>"visibilitychange"<br>"pagehide" | "visibilitychange"                                             | no event                                                                                        |
| Discard (mannually)          | no event                                                                 | N/A                                  | N/A                                      | N/A                                                                                                 |                                                                | N/A                                                                                             |

### service worker approach

-   heart beat methodology
    -   SW check page live each 1000ms
    -   if no feedback at 900ms, SW use `fetch()` send POST request to BE
    -   shown whether BE can receive the request

| Browser           | Mac OS Chrome | Mac OS Firefox | Mac OS Safari | Android Chrome | Andriod Firefox | iOS Safari |
| ----------------- | ------------- | -------------- | ------------- | -------------- | --------------- | ---------- |
| Close Tab         | Yes           | Yes            | Yes           | Yes            | yes             | yes        |
| Close Window      | Yes           | Yes            | Yes           | N/A            | N/A             | N/A        |
| Close Last Window | No            | Yes            | Yes           | N/A            | N/A             | N/A        |
| Quit App          | No            | No             | No            | No             | No              | No         |

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
    -   even self sign certificate can't work
    -   can host the whole project to Vercel in order to get public certificate and test with mobile

### Extra founding

-   Mac OS Safari would start to preload the page when you type the URL and before clicking enter
    -   when typing other URL and unfocusing the URL bar, would unload the page and send the same POST request to BE as closing the tab

## Conclusion

### How to determine end of session

-   this study answer the question
    -   "What user action we **can** observe from frontend"
-   but cannot answer the question
    -   "What user action we **want** to observe from frontend"
-   we need to further discuss with BE / analyst about what user action is determined as "closing the game", but not "just leave the game for a few second and quick come back"
-   signal send to BE can serve as a trigger to reduce the timeout duration, instead of shutting down the session immediately

### Event base approach and service worker approach

-   event base approach can cover more situation
    -   quit app can only be observed from event base approach
-   however the event fired is different among browser / OS, but SW can be more fully controller by our developer
-   SW can be service as a middleware between game and BE, that can
    -   filter out actions that could be considered as unwanted noise by BE; or
    -   delay the signal sent; or
    -   conclude on device analyze and data pre-process before sending back to BE

### Future Action

-   test on more OS / platform,
    -   the event fired by browser may differ
-   discuss with BE team to determine how the observed actions in frontend can be translated to user actions, resulting a more detailed requirement specification
-   design a solution that can balance performance, reliability, modularity and backward-compatibility
