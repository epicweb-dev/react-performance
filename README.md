# React Performance ⚡

> Let's make our apps fast ⚡

👋 hi there! My name is [Kent C. Dodds](https://kentcdodds.com)! This is a
workshop repo to teach you about profiling React applications to identify slow
parts and using proven tools and techniques to make your app fast.

<!-- prettier-ignore-start -->
[![Build Status][build-badge]][build]
[![AppVeyor Build Status][win-build-badge]][win-build]
[![GPL 3.0 License][license-badge]][license]
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)
[![Code of Conduct][coc-badge]][coc]
<!-- prettier-ignore-end -->

## Workshop Topics

Here are the tools and techniques we'll be covering:

- Loading less code via code splitting
- Install and explore the React DevTools
- Identify and fix slow components with React DevTools Profiler
- Identify and fix slow JavaScript with the Chrome DevTools Profiler
- Use Web Workers to free up the main thread from expensive computations
- Solve "perf death by a thousand cuts"
- Optimize context providers
- Production Monitoring

## Pre-Workshop Instructions/Requirements

In order for us to maximize our efforts during the workshop, please complete the
following things to prepare.

- 📺 only necessary if the workshop is remote via Zoom
- 👋 specific to the material for this workshop

- [ ] 👋 Setup the project (follow the setup instructions below) (~5 minutes)
- [ ] 📺 Install and setup [Zoom](https://zoom.us) on the computer you will be
      using (~5 minutes)
- [ ] 📺 Watch
      [Use Zoom for KCD Workshops](https://egghead.io/lessons/egghead-use-zoom-for-kcd-workshops)
      (~8 minutes).
- [ ] Watch
      [Setup and Logistics for KCD Workshops](https://egghead.io/lessons/egghead-setup-and-logistics-for-kcd-workshops)
      (~24 minutes). Please do NOT skip this step.
- [ ] 👋 Install the React DevTools
      ([Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
      (recommended),
      [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/))
- [ ] 👋 Watch [The Beginner's Guide to React](https://kcd.im/beginner-react)
      (available free on Egghead.io), or have the equivalent experience (77
      minutes)
- [ ] 👋 Watch my talk
      [Why React Hooks](https://www.youtube.com/watch?v=zWsZcBiwgVE&list=PLV5CVI1eNcJgNqzNwcs4UKrlJdhfDjshf)
      (35 minutes)
- [ ] 👋 Go through my
      [Learn React Hooks Workshop](https://kentcdodds.com/workshops/hooks), or
      have the equivalent basic experience of using hooks. You should be
      experienced with `useState`, `useEffect`, and `useRef`.
- [ ] 👋 Go through my
      [Advanced React Hooks Workshop](https://kentcdodds.com/workshops/advanced-react-hooks),
      or have the equivalent experience. You should be experienced with
      `useContext` and `useReducer` (experience with `useMemo` and `useCallback`
      is a bonus).

The more prepared you are for the workshop, the better it will go for you.

## System Requirements

- [git][git] v2 or greater
- [NodeJS][node] v10 or greater
- [npm][npm] v6 or greater

All of these must be available in your `PATH`. To verify things are set up
properly, you can run this:

```shell
git --version
node --version
npm --version
```

If you have trouble with any of these, learn more about the PATH environment
variable and how to fix it here for [windows][win-path] or
[mac/linux][mac-path].

## Setup

After you've made sure to have the correct things (and versions) installed, you
should be able to just run a few commands to get set up:

```
git clone https://github.com/kentcdodds/react-performance.git
cd react-performance
npm run setup --silent
```

This may take a few minutes. **It will ask you for your email.** This is
optional and just automatically adds your email to the links in the project to
make filling out some forms easier. If you get any errors, please read through
them and see if you can find out what the problem is. If you can't work it out
on your own then please [file an issue][issue] and provide _all_ the output from
the commands you ran (even if it's a lot).

You may be able to work through the entire workshop in the browser. Go to
[this codesandbox](https://codesandbox.io/s/github/kentcdodds/react-performance)
and you should be good to go. Note that sometimes people have trouble with
codesandbox not working quite right with tests, but you should be able to work
around that. If you're concerned, then it would probably be better to just set
things up locally.

## Running the app

To get the app up and running (and really see if it worked), run:

```shell
npm start
```

This should start up your browser. If you're familiar, this is a standard
[react-scripts](https://create-react-app.dev/) application.

You can also open
[the deployment of the app on Netlify](https://react-performance.netlify.app/).

## Running the tests

```shell
npm test
```

This will start [Jest](https://jestjs.io/) in watch mode. Read the output and
play around with it. The tests are there to help you reach the final version,
however _sometimes_ you can accomplish the task and the tests still fail if you
implement things differently than I do in my solution, so don't look to them as
a complete authority.

## Workshop Outline

👋 I'm Kent C. Dodds

- 🏡 Utah
- 👩 👧 👦 👦 👦 🐕
- 🏢 https://kentcdodds.com
- 🐦/🐙 @kentcdodds
- 🏆 https://TestingJavaScript.com
- 👩‍🚀 https://EpicReact.Dev
- 💻 https://kcd.im/workshops
- 🎙 https://kcd.im/podcast
- 🥚 https://kcd.im/egghead
- 🥋 https://kcd.im/fem
- 💌 https://kcd.im/news
- 📝 https://kcd.im/blog
- 📺 https://kcd.im/devtips
- 👨‍💻 https://kcd.im/coding
- 📽 https://kcd.im/youtube
- ❓ https://kcd.im/ama

### Schedule

- 😴 Logistics
- 💪 Code splitting
- 😴 10 Minutes
- 💪 useMemo for expensive calculations
- 💪 React.memo for reducing unnecessary re-renders
- 🌮 30 Minutes
- 💪 Window large lists with react-window
- 😴 10 Minutes
- 💪 Fix "perf death by a thousand cuts"
- 💪 Optimize context value
- 😴 10 Minutes
- 💪 Production performance monitoring
- ❓ Q&A

### Questions

Please do ask! Interrupt me. If you have an unrelated question, please ask on
[my AMA](https://kcd.im/ama).

### Zoom (for remote workshops)

- Help us make this more human by keeping your video on if possible
- Keep microphone muted unless speaking
- Breakout rooms

### Exercises

- `src/exercise/00.md`: Background, Exercise Instructions, Extra Credit
- `src/exercise/00.js`: Exercise with Emoji helpers
- `src/__tests__/00.js`: Tests
- `src/final/00.js`: Final version
- `src/final/00.extra-0.js`: Final version of extra credit

The purpose of the exercise is **not** for you to work through all the material.
It's intended to get your brain thinking about the right questions to ask me as
_I_ walk through the material.

### Helpful Emoji 🐨 💪 🏁 💰 💯 🦉 📜 💣 👨‍💼 🚨

Each exercise has comments in it to help you get through the exercise. These fun
emoji characters are here to help you.

- **Kody the Koala Bear** 🐨 will tell you when there's something specific you
  should do
- **Matthew the Muscle** 💪 will indicate what you're working with an exercise
- **Chuck the Checkered Flag** 🏁 will indicate that you're working with a final
  version
- **Marty the Money Bag** 💰 will give you specific tips (and sometimes code)
  along the way
- **Hannah the Hundred** 💯 will give you extra challenges you can do if you
  finish the exercises early.
- **Olivia the Owl** 🦉 will give you useful tidbits/best practice notes and a
  link for elaboration and feedback.
- **Dominic the Document** 📜 will give you links to useful documentation
- **Berry the Bomb** 💣 will be hanging around anywhere you need to blow stuff
  up (delete code)
- **Peter the Product Manager** 👨‍💼 helps us know what our users want
- **Alfred the Alert** 🚨 will occasionally show up in the test failures with
  potential explanations for why the tests are failing.

## Contributors

Thanks goes to these wonderful people
([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://kentcdodds.com"><img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;" alt=""/><br /><sub><b>Kent C. Dodds</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=kentcdodds" title="Code">💻</a> <a href="https://github.com/kentcdodds/react-performance/commits?author=kentcdodds" title="Documentation">📖</a> <a href="#infra-kentcdodds" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/kentcdodds/react-performance/commits?author=kentcdodds" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://stackshare.io/jdorfman/decisions"><img src="https://avatars1.githubusercontent.com/u/398230?v=4" width="100px;" alt=""/><br /><sub><b>Justin Dorfman</b></sub></a><br /><a href="#fundingFinding-jdorfman" title="Funding Finding">🔍</a></td>
    <td align="center"><a href="https://bol.vin"><img src="https://avatars2.githubusercontent.com/u/1684826?v=4" width="100px;" alt=""/><br /><sub><b>Frédéric Bolvin</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=Fensterbank" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the
[all-contributors](https://github.com/kentcdodds/all-contributors)
specification. Contributions of any kind welcome!

## Workshop Feedback

Each exercise has an Elaboration and Feedback link. Please fill that out after
the exercise and instruction.

At the end of the workshop, please go to this URL to give overall feedback.
Thank you! https://kcd.im/rp-ws-feedback

## License

This material is available for private, non-commercial use under the
[GPL version 3](http://www.gnu.org/licenses/gpl-3.0-standalone.html). If you
would like to use this material to conduct your own workshop, please contact me
at me@kentcdodds.com

<!-- prettier-ignore-start -->
[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[git]: https://git-scm.com/
[build-badge]: https://img.shields.io/travis/com/kentcdodds/react-performance.svg?style=flat-square&logo=travis
[build]: https://travis-ci.com/kentcdodds/react-performance
[license-badge]: https://img.shields.io/badge/license-GPL%203.0%20License-blue.svg?style=flat-square
[license]: https://github.com/kentcdodds/react-performance/blob/master/README.md#license
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/kentcdodds/react-performance/blob/master/CODE_OF_CONDUCT.md
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[win-path]: https://www.howtogeek.com/118594/how-to-edit-your-system-path-for-easy-command-line-access/
[mac-path]: http://stackoverflow.com/a/24322978/971592
[issue]: https://github.com/kentcdodds/react-performance/issues/new
[win-build-badge]: https://img.shields.io/appveyor/ci/kentcdodds/react-performance.svg?style=flat-square&logo=appveyor
[win-build]: https://ci.appveyor.com/project/kentcdodds/react-performance
<!-- prettier-ignore-end -->
