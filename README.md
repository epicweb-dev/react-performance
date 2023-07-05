<div>
  <h1 align="center"><a href="https://epicreact.dev/performance">⚡ React Performance 🚀 EpicReact.Dev</a></h1>
  <strong>
    React is fast, until it isn't
  </strong>
  <p>
    Learn everything you need to diagnose, profile, and fix performance problems
    in your React application using the Browser Performance Profiler,
    React DevTools Profiler, and proven React optimization techniques.
  </p>

  <a href="https://epicreact.dev">
    <img
      alt="Learn React from Start to Finish"
      src="https://kentcdodds.com/images/epicreact-promo/er-1.gif"
    />
  </a>
</div>

<hr />

<!-- prettier-ignore-start -->
[![Build Status][build-badge]][build]
[![All Contributors][all-contributors-badge]](#contributors)
[![GPL 3.0 License][license-badge]][license]
[![Code of Conduct][coc-badge]][coc]
[![Gitpod ready-to-code][gitpod-badge]](https://gitpod.io/#https://github.com/kentcdodds/react-performance)
<!-- prettier-ignore-end -->

## Prerequisites

- Install the React DevTools
  ([Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
  (recommended),
  [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/))
- Experience with React and all hooks

> NOTE: The EpicReact.dev videos were recorded with React version ^16.13 and all
> material in this repo has been updated to React version ^18. Differences are
> minor and any relevant differences are noted in the instructions.

## Quick start

It's recommended you run everything in the same environment you work in every
day, but if you don't want to set up the repository locally, you can get started
in one click with [Gitpod](https://gitpod.io),
[CodeSandbox](https://codesandbox.io/s/github/kentcdodds/react-performance), or
by following the [video demo](https://www.youtube.com/watch?v=gCoVJm3hGk4)
instructions for [GitHub Codespaces](https://github.com/features/codespaces).

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/kentcdodds/react-performance)

For a local development environment, follow the instructions below

## System Requirements

- [git][git] v2.13 or greater
- [NodeJS][node] `>=16`
- [npm][npm] v8.16.0 or greater

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

> If you want to commit and push your work as you go, you'll want to
> [fork](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/fork-a-repo)
> first and then clone your fork rather than this repo directly.

After you've made sure to have the correct things (and versions) installed, you
should be able to just run a few commands to get set up:

```shell
git clone https://github.com/kentcdodds/react-performance.git
cd react-performance
node setup
```

This may take a few minutes. **It will ask you for your email.** This is
optional and just automatically adds your email to the links in the project to
make filling out some forms easier.

If you get any errors, please read through them and see if you can find out what
the problem is. If you can't work it out on your own then please [file an
issue][issue] and provide _all_ the output from the commands you ran (even if
it's a lot).

If you can't get the setup script to work, then just make sure you have the
right versions of the requirements listed above, and run the following commands:

```shell
npm install
npm run validate
```

If you are still unable to fix issues and you know how to use Docker 🐳 you can
setup the project with the following command:

```shell
docker-compose up
```

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

### Exercises

- `src/exercise/00.md`: Background, Exercise Instructions, Extra Credit
- `src/exercise/00.js`: Exercise with Emoji helpers
- `src/__tests__/00.js`: Tests
- `src/final/00.js`: Final version
- `src/final/00.extra-0.js`: Final version of extra credit

The purpose of the exercise is **not** for you to work through all the material.
It's intended to get your brain thinking about the right questions to ask me as
_I_ walk through the material.

### Helpful Emoji 🐨 💰 💯 📝 🦉 📜 💣 💪 🏁 👨‍💼 🚨

Each exercise has comments in it to help you get through the exercise. These fun
emoji characters are here to help you.

- **Kody the Koala** 🐨 will tell you when there's something specific you should
  do
- **Marty the Money Bag** 💰 will give you specific tips (and sometimes code)
  along the way
- **Hannah the Hundred** 💯 will give you extra challenges you can do if you
  finish the exercises early.
- **Nancy the Notepad** 📝 will encourage you to take notes on what you're
  learning
- **Olivia the Owl** 🦉 will give you useful tidbits/best practice notes and a
  link for elaboration and feedback.
- **Dominic the Document** 📜 will give you links to useful documentation
- **Berry the Bomb** 💣 will be hanging around anywhere you need to blow stuff
  up (delete code)
- **Matthew the Muscle** 💪 will indicate that you're working with an exercise
- **Chuck the Checkered Flag** 🏁 will indicate that you're working with a final
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
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://kentcdodds.com"><img src="https://avatars.githubusercontent.com/u/1500684?v=3?s=100" width="100px;" alt="Kent C. Dodds"/><br /><sub><b>Kent C. Dodds</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=kentcdodds" title="Code">💻</a> <a href="https://github.com/kentcdodds/react-performance/commits?author=kentcdodds" title="Documentation">📖</a> <a href="#infra-kentcdodds" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/kentcdodds/react-performance/commits?author=kentcdodds" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://stackshare.io/jdorfman/decisions"><img src="https://avatars1.githubusercontent.com/u/398230?v=4?s=100" width="100px;" alt="Justin Dorfman"/><br /><sub><b>Justin Dorfman</b></sub></a><br /><a href="#fundingFinding-jdorfman" title="Funding Finding">🔍</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://bol.vin"><img src="https://avatars2.githubusercontent.com/u/1684826?v=4?s=100" width="100px;" alt="Frédéric Bolvin"/><br /><sub><b>Frédéric Bolvin</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=Fensterbank" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://vojta.io"><img src="https://avatars2.githubusercontent.com/u/25487857?v=4?s=100" width="100px;" alt="Vojta Holik"/><br /><sub><b>Vojta Holik</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=vojtaholik" title="Code">💻</a> <a href="#design-vojtaholik" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/marcosvega91"><img src="https://avatars2.githubusercontent.com/u/5365582?v=4?s=100" width="100px;" alt="Marco Moretti"/><br /><sub><b>Marco Moretti</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=marcosvega91" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://ricardobusquet.com"><img src="https://avatars1.githubusercontent.com/u/7198302?v=4?s=100" width="100px;" alt="Ricardo Busquet"/><br /><sub><b>Ricardo Busquet</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=rbusquet" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/nywleswoey"><img src="https://avatars3.githubusercontent.com/u/28249994?v=4?s=100" width="100px;" alt="Selwyn Yeow"/><br /><sub><b>Selwyn Yeow</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=nywleswoey" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/emzoumpo"><img src="https://avatars2.githubusercontent.com/u/2103443?v=4?s=100" width="100px;" alt="Emmanouil Zoumpoulakis"/><br /><sub><b>Emmanouil Zoumpoulakis</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=emzoumpo" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://peter.hozak.info/"><img src="https://avatars0.githubusercontent.com/u/1087670?v=4?s=100" width="100px;" alt="Peter Hozák"/><br /><sub><b>Peter Hozák</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=Aprillion" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/pritamsangani/"><img src="https://avatars3.githubusercontent.com/u/22857896?v=4?s=100" width="100px;" alt="Pritam Sangani"/><br /><sub><b>Pritam Sangani</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=PritamSangani" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/milamer"><img src="https://avatars2.githubusercontent.com/u/12884134?v=4?s=100" width="100px;" alt="Christian Schurr"/><br /><sub><b>Christian Schurr</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=milamer" title="Code">💻</a> <a href="https://github.com/kentcdodds/react-performance/commits?author=milamer" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://magrippis.com"><img src="https://avatars0.githubusercontent.com/u/3502800?v=4?s=100" width="100px;" alt="Johnny Magrippis"/><br /><sub><b>Johnny Magrippis</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=jmagrippis" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/AhmedAymanM"><img src="https://avatars1.githubusercontent.com/u/535126?v=4?s=100" width="100px;" alt="Ahmed"/><br /><sub><b>Ahmed</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=AhmedAymanM" title="Code">💻</a> <a href="https://github.com/kentcdodds/react-performance/commits?author=AhmedAymanM" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/RobbertWolfs"><img src="https://avatars2.githubusercontent.com/u/12511178?v=4?s=100" width="100px;" alt="Robbert Wolfs"/><br /><sub><b>Robbert Wolfs</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=RobbertWolfs" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://www.gwanduke.com"><img src="https://avatars0.githubusercontent.com/u/7443435?v=4?s=100" width="100px;" alt="Kim Gwan-duk"/><br /><sub><b>Kim Gwan-duk</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=gwanduke" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://rasmusjosefsson.com"><img src="https://avatars2.githubusercontent.com/u/13612444?v=4?s=100" width="100px;" alt="Rasmus Josefsson"/><br /><sub><b>Rasmus Josefsson</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=rajjejosefsson" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/MarcosNASA"><img src="https://avatars3.githubusercontent.com/u/45607262?v=4?s=100" width="100px;" alt="Marcos NASA G"/><br /><sub><b>Marcos NASA G</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=MarcosNASA" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Snaptags"><img src="https://avatars1.githubusercontent.com/u/1249745?v=4?s=100" width="100px;" alt="Markus Lasermann"/><br /><sub><b>Markus Lasermann</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=Snaptags" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://vk.com/vasilii_kovalev"><img src="https://avatars0.githubusercontent.com/u/10310491?v=4?s=100" width="100px;" alt="Vasilii Kovalev"/><br /><sub><b>Vasilii Kovalev</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=vasilii-kovalev" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/matchai"><img src="https://avatars0.githubusercontent.com/u/4658208?v=4?s=100" width="100px;" alt="Matan Kushner"/><br /><sub><b>Matan Kushner</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=matchai" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://michaeldeboey.be"><img src="https://avatars3.githubusercontent.com/u/6643991?v=4?s=100" width="100px;" alt="Michaël De Boey"/><br /><sub><b>Michaël De Boey</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=MichaelDeBoey" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://www.veljkoblagojevic.com"><img src="https://avatars2.githubusercontent.com/u/28904821?v=4?s=100" width="100px;" alt="Veljko Blagojevic"/><br /><sub><b>Veljko Blagojevic</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=Wekios" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://bobbywarner.com"><img src="https://avatars0.githubusercontent.com/u/554961?v=4?s=100" width="100px;" alt="Bobby Warner"/><br /><sub><b>Bobby Warner</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=bobbywarner" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://angular-tips.com"><img src="https://avatars2.githubusercontent.com/u/1087957?v=4?s=100" width="100px;" alt="Jesús Rodríguez"/><br /><sub><b>Jesús Rodríguez</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=Foxandxss" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://valentin-hervieu.fr"><img src="https://avatars2.githubusercontent.com/u/2678610?v=4?s=100" width="100px;" alt="Valentin Hervieu"/><br /><sub><b>Valentin Hervieu</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/issues?q=author%3AValentinH" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://davsanchez.com"><img src="https://avatars2.githubusercontent.com/u/2999604?v=4?s=100" width="100px;" alt="David Sánchez"/><br /><sub><b>David Sánchez</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=d4vsanchez" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://merott.com"><img src="https://avatars3.githubusercontent.com/u/1757708?v=4?s=100" width="100px;" alt="Merott Movahedi"/><br /><sub><b>Merott Movahedi</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=Merott" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.arjenbloemsma.nl"><img src="https://avatars1.githubusercontent.com/u/8061052?v=4?s=100" width="100px;" alt="Arjen Bloemsma"/><br /><sub><b>Arjen Bloemsma</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=arjenbloemsma" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/syed-naveed-elahi/"><img src="https://avatars.githubusercontent.com/u/19769879?v=4?s=100" width="100px;" alt="Naveed Elahi"/><br /><sub><b>Naveed Elahi</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=BboyStatix" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://tknappe.com/"><img src="https://avatars.githubusercontent.com/u/138048?v=4?s=100" width="100px;" alt="Tyler Knappe"/><br /><sub><b>Tyler Knappe</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=knappe" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/0xnoob"><img src="https://avatars.githubusercontent.com/u/49793844?v=4?s=100" width="100px;" alt="0xnoob"/><br /><sub><b>0xnoob</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=0xnoob" title="Code">💻</a> <a href="https://github.com/kentcdodds/react-performance/commits?author=0xnoob" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://emildev.netlify.app/"><img src="https://avatars.githubusercontent.com/u/10499067?v=4?s=100" width="100px;" alt="Emil Esplund"/><br /><sub><b>Emil Esplund</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=esplito" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://swiftwithjustin.co"><img src="https://avatars.githubusercontent.com/u/5117473?v=4?s=100" width="100px;" alt="Justin Stanley"/><br /><sub><b>Justin Stanley</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=jstheoriginal" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://pavlos.dev"><img src="https://avatars.githubusercontent.com/u/100233?v=4?s=100" width="100px;" alt="Pavlos Vinieratos"/><br /><sub><b>Pavlos Vinieratos</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=pvinis" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Reignable"><img src="https://avatars.githubusercontent.com/u/18505669?v=4?s=100" width="100px;" alt="Joe Barrett"/><br /><sub><b>Joe Barrett</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=Reignable" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/LochMess"><img src="https://avatars.githubusercontent.com/u/18762221?v=4?s=100" width="100px;" alt="LochMess"/><br /><sub><b>LochMess</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=LochMess" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://codewars.com/users/mstosio"><img src="https://avatars.githubusercontent.com/u/10117225?v=4?s=100" width="100px;" alt="Michal"/><br /><sub><b>Michal</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=mstosio" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/marioleed"><img src="https://avatars.githubusercontent.com/u/1763448?v=4?s=100" width="100px;" alt="Mario Sannum"/><br /><sub><b>Mario Sannum</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=marioleed" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/CJThornburg"><img src="https://avatars.githubusercontent.com/u/59716885?v=4?s=100" width="100px;" alt="CJThornburg"/><br /><sub><b>CJThornburg</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=CJThornburg" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.lucianoayres.com.br"><img src="https://avatars.githubusercontent.com/u/20209393?v=4?s=100" width="100px;" alt="Luciano Ayres"/><br /><sub><b>Luciano Ayres</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=lucianoayres" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/skgyan"><img src="https://avatars.githubusercontent.com/u/5046860?v=4?s=100" width="100px;" alt="Sushil Kumar"/><br /><sub><b>Sushil Kumar</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=skgyan" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://unravelweb.dev"><img src="https://avatars.githubusercontent.com/u/26349046?v=4?s=100" width="100px;" alt="Nishu Goel"/><br /><sub><b>Nishu Goel</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=NishuGoel" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://creador.dev"><img src="https://avatars.githubusercontent.com/u/40248406?v=4?s=100" width="100px;" alt="Pawan Kumar"/><br /><sub><b>Pawan Kumar</b></sub></a><br /><a href="https://github.com/kentcdodds/react-performance/commits?author=creador-dev" title="Documentation">📖</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
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

<!-- prettier-ignore-start -->
[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[git]: https://git-scm.com/
[build-badge]: https://img.shields.io/github/workflow/status/kentcdodds/react-performance/validate/main?logo=github&style=flat-square
[build]: https://github.com/kentcdodds/react-performance/actions?query=workflow%3Avalidate
[license-badge]: https://img.shields.io/badge/license-GPL%203.0%20License-blue.svg?style=flat-square
[license]: https://github.com/kentcdodds/react-performance/blob/main/LICENSE
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[gitpod-badge]: https://img.shields.io/badge/Gitpod-ready--to--code-908a85?logo=gitpod
[coc]: https://github.com/kentcdodds/react-performance/blob/main/CODE_OF_CONDUCT.md
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[all-contributors-badge]: https://img.shields.io/github/all-contributors/kentcdodds/react-performance?color=orange&style=flat-square
[win-path]: https://www.howtogeek.com/118594/how-to-edit-your-system-path-for-easy-command-line-access/
[mac-path]: http://stackoverflow.com/a/24322978/971592
[issue]: https://github.com/kentcdodds/react-performance/issues/new
<!-- prettier-ignore-end -->
