const game = {
  slug: "trouble-maker",
  host: "bobanya",
  createdAt: 1588553102804,
  updatedAt: 1588553102804,
  players: ["bobanya", "genji", "millie", "jilly", "rosa", "heinrich"],
  settings: {
    rotations: 2,
    turnDurationSeconds: 90,
    teamsCount: 2,
    autoStart: false,
  },
  games: [
    {
      startTime: 1588553102804,
      endTime: null,
      teams: [
        {
          teamName: "Booty Shakers",
          players: ["jilly", "rosa", "heinrich"],
          playerIndex: 0,
          score: 3,
        },
        {
          teamName: "Silver Tiger Claw",
          players: ["bobanya", "genji", "millie"],
          playerIndex: 2,
          score: 1,
        },
      ],
      totalTurns: 12,
      turns: [
        {
          startTime: 1588553102804,
          endTime: 1588554102804,
          teamIndex: 0,
          player: "jilly",
          author: "bobanya",
          prompt: "car jacking",
          success: true,
        },
        {
          startTime: 1588555102804,
          endTime: 1588556102804,
          teamIndex: 1,
          player: "bobanya",
          author: "jilly",
          prompt: "aquaphor",
          success: true,
        },
        {
          startTime: 1588557102804,
          endTime: 1588558102804,
          teamIndex: 0,
          player: "rosa",
          author: "genji",
          prompt: "snail eating a cucumber",
          success: true,
        },
        {
          startTime: 1588558102804,
          endTime: 1588559102804,
          teamIndex: 1,
          player: "genji",
          author: "rosa",
          prompt: "five star wings",
          success: false,
        },
        {
          startTime: 1588558102804,
          endTime: 1588559102804,
          teamIndex: 0,
          player: "heinrich",
          author: "millie",
          prompt: "i'm a lil bitch",
          success: true,
        },
      ],
    },
  ],
  prompts: [
    {
      author: "bobanya",
      prompt: "lip light",
    },
    {
      author: "genji",
      prompt: "star wards: the last jedi",
    },
    {
      author: "millie",
      prompt: "plush baby legs",
    },
    {
      author: "jilly",
      prompt: "smoking is cool kids",
    },
    {
      author: "rosa",
      prompt: "smoothie hoochie",
    },
    {
      author: "heinrich",
      prompt: "gloop gloop gloop",
    },
    {
      author: "heinrich",
      prompt: "mousie go bye bye",
    },
  ],
}

window.onload = () => {

  defineCustomElements();

  const colors = generateColors(game.games[0].teams.length);
  const main = document.querySelector('main');
  const teams = game.games[0].teams;
  const players = game.players;
  const host = 'jilly';
  const actorUp = 'rosa';
  const onDeck = 'heinrich';

  main.appendChild(h('team-box', {
    players: teams[0].players,
    teamColor: colors[0],
    score: teams[0].score,
    host: host, 
    actorUp: actorUp, 
    onDeck: onDeck, 
    myTeam: true,
  }));

  main.appendChild(h('team-box', {
    players: teams[1].players,
    teamColor: colors[1],
    score: teams[1].score,
    host: host, 
    actorUp: actorUp, 
    onDeck: onDeck, 
    myTeam: false,
  }));
}

/* Paul Frazee's handy templating function: */
function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  for (let k in attrs) {
    if (k === 'className') el.className = attrs[k];
    else el.setAttribute(k, attrs[k]);
  }
  for (let child of children) el.appendChild(child);
  return el;
}

/* create a text node */
function t(text) {
  return document.createTextNode(text);
}

/* create a template instance from a template ID */
function c(templateId, ...children) {
  const el = document.importNode(document.getElementById(templateId).content, true);
  const slot = el.querySelector('slot')
  for (let child of children) slot.appendChild(child);
  return el;
}

/* generate a set of n equidistant colors */
function generateColors(
  n,
  startingHue = Math.floor(Math.random() * 360)
) {
  return new Array(n)
    .fill('')
    .map((_, index) => {
      var hue = (startingHue + (Math.floor(360 / n) * index)) % 360;
      return `hsl(${hue}, 100%, 75%)`
    });
}

/* get array from attribute object */
function arrayFromAttribute(attrObj) {
  return attrObj.value.split(',');
}

/* get boolean from attribute object */
function booleanFromAttribute(attrObj) {
  return attrObj.value === "true";
}

function applyStyleToSelector(root, property, value, selector) {
  const elements = root.querySelectorAll(selector);
  elements.forEach((element) => {
    element.style[property] = value;
  });
  return elements;
}

function hideElement(root, selector) {
  applyStyleToSelector(root, 'display', 'none', selector);
}

function setupCustomElement(context) {
  context.attachShadow({ mode: 'open' });
  const template = document.getElementById(context.localName);
  const el = template.content.cloneNode(true);
  context.shadowRoot.appendChild(el);
}

function defineCustomElements() {
  /* More Verbose Class Syntax:
   * class PlayerListItem extends HTMLElement { ... }
   * customElements.define('player-list-item', PlayerListItem) */

  /* PlayerListItem */
  customElements.define('player-list-item', class extends HTMLElement {
    connectedCallback() {
      const teamColor = this.attributes.teamColor.value;
      const player = this.attributes.player.value;
      const host = this.attributes.host.value;
      const actorUp = this.attributes.actorUp.value;
      const onDeck = this.attributes.onDeck.value;
      /* this.localName is 'player-list' in this case */
      const el = c(this.localName, t(player));
      applyStyleToSelector(el, 'background', teamColor, '.team-box__badge--status-on-deck');
      applyStyleToSelector(el, 'color', teamColor, '.team-box__player-name');
      player !== host && hideElement(el, '.team-box__badge--host');
      player !== actorUp && hideElement(el, '.team-box__badge--status-actor-up');
      player !== onDeck && hideElement(el, '.team-box__badge--status-on-deck');
      this.appendChild(el);
    }
  });

  /* PlayerList */
  customElements.define('player-list', class extends HTMLElement {
    constructor() {
      super();
      setupCustomElement(this);
    }

    connectedCallback() {
      const teamColor = this.attributes.teamColor.value;
      /* `players` is a comma-separated list, 
       * so it needs to be converted back to array */
      const players = arrayFromAttribute(this.attributes.players);
      const host = this.attributes.host.value;
      const actorUp = this.attributes.actorUp.value;
      const onDeck = this.attributes.onDeck.value;
      const items = players.map((player) => h('player-list-item', { teamColor, player, host, actorUp, onDeck }));
      const slot = this.shadowRoot.querySelector('slot');
      items.forEach((item) => {
        slot.appendChild(item);
      });
    }
  });

  /* TeamScore */
  customElements.define('team-score', class extends HTMLElement {
    connectedCallback() {
      const score = this.attributes.score.value;
      const el = c(this.localName, t(score));
      this.appendChild(el);
    }
  });

  /* TeamBox */
  customElements.define('team-box', class extends HTMLElement {
    constructor() {
      super();
      setupCustomElement(this);
    }

    connectedCallback() {
      const players = arrayFromAttribute(this.attributes.players);
      const teamColor = this.attributes.teamColor.value;
      const host = this.attributes.host.value;
      const actorUp = this.attributes.actorUp.value;
      const onDeck = this.attributes.onDeck.value;
      const myTeam = booleanFromAttribute(this.attributes.myTeam);
      !myTeam && hideElement(this.shadowRoot, '.team-box__rename-button');
      const score = this.attributes.score.value;
      applyStyleToSelector(this.shadowRoot, 'background', teamColor, '.team-box__body, .team-box__team-label');
      const slot = this.shadowRoot.querySelector('slot');
      slot.appendChild(h('player-list', { players, teamColor, host, actorUp, onDeck }));
      slot.appendChild(h('team-score', { score }));
    }
  });
}
