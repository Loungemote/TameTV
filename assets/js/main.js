// TameTV site: progressive enhancement only. Every page works and reads in full without this file. With it, the
// hero's remote drives the TV beside it, sections come in as they scroll into view, and looping art rests while it's
// off screen. With Reduce Motion on, every state still changes but nothing travels.
(function () {
  "use strict";

  var root = document.documentElement;
  if (!root.classList.contains("js")) {
    // The head gave up waiting for this script (slow network) and showed everything; keep it shown.
    root.classList.add("js", "is-late");
  }
  root.classList.add("is-live");

  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var canObserve = "IntersectionObserver" in window;

  function calm() {
    return motionQuery.matches;
  }

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $$(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function easeOut(p) {
    return 1 - Math.pow(1 - p, 3);
  }

  function restart(el, className) {
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  }

  // ---------------------------------------------------------------- header

  var header = $("[data-header]");
  var toggle = $("[data-nav-toggle]");
  var nav = $("[data-nav]");

  // Over the family section's light sheet the header turns light too, so its links stay readable.
  var daySheet = $(".family__sheet");

  if (header) {
    var scrolled = null;
    var day = null;
    var onScroll = function () {
      var now = window.scrollY > 8;
      if (now !== scrolled) {
        scrolled = now;
        header.classList.toggle("is-scrolled", now);
      }
      if (daySheet) {
        var box = daySheet.getBoundingClientRect();
        var under = box.top < 32 && box.bottom > 32;
        if (under !== day) {
          day = under;
          header.classList.toggle("is-day", under);
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function setNav(open) {
    nav.classList.toggle("is-open", open);
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }

  if (toggle && nav && header) {
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setNav(false);
        toggle.focus();
      }
    });
    var wide = window.matchMedia("(min-width: 1081px)");
    if (wide.addEventListener) {
      wide.addEventListener("change", function () {
        if (wide.matches) setNav(false);
      });
    }
  }

  // On a phone, Get the app opens this phone's store; elsewhere it scrolls to the store badges and QR codes.
  var agent = navigator.userAgent;
  var onIOS = /iPhone|iPad|iPod/.test(agent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var onAndroid = /Android/.test(agent);
  $$("[data-get-app]").forEach(function (link) {
    var store = onIOS ? link.getAttribute("data-ios") : onAndroid ? link.getAttribute("data-android") : "";
    if (store) {
      link.href = store;
      link.rel = "noopener";
    }
  });

  // The language menu closes on a click elsewhere and on Escape.
  var lang = $("[data-lang]");
  if (lang) {
    document.addEventListener("click", function (event) {
      if (lang.open && !lang.contains(event.target)) lang.open = false;
    });
    lang.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && lang.open) {
        event.stopPropagation();
        lang.open = false;
        $("summary", lang).focus();
      }
    });
  }

  // The menu marks the section on screen (home pages: the links to this page's own sections).
  if (nav && canObserve) {
    var spied = [];
    $$("a[href*='#']", nav).forEach(function (link) {
      if (link.pathname !== window.location.pathname || link.hash === "#download") return;
      var section = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (section) spied.push({ link: link, section: section, on: false });
    });
    if (spied.length) {
      var spy = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            spied.forEach(function (item) {
              if (item.section === entry.target) item.on = entry.isIntersecting;
            });
          });
          spied.forEach(function (item) {
            item.link.classList.toggle("is-current", item.on);
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      spied.forEach(function (item) {
        spy.observe(item.section);
      });
    }
  }

  // ---------------------------------------------------------------- reveal on scroll

  function reveal(el) {
    el.classList.add("is-in");
  }

  var revealables = $$("[data-reveal]");
  if (!canObserve || root.classList.contains("is-late")) {
    revealables.forEach(reveal);
  } else {
    var revealer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          revealer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    revealables.forEach(function (el) {
      revealer.observe(el);
    });

    // Looping art rests while it's off screen.
    var rester = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          entry.target.classList.toggle("is-away", !entry.isIntersecting);
        });
      },
      { rootMargin: "10% 0px" }
    );
    revealables.concat($$(".hero, .brands")).forEach(function (el) {
      rester.observe(el);
    });
  }

  // ---------------------------------------------------------------- the family sheet rises into place

  var sheetSection = $("[data-sheet]");
  var sheet = sheetSection && $(".family__sheet", sheetSection);
  if (sheet) {
    var sheetQueued = false;
    var drawSheet = function () {
      sheetQueued = false;
      if (calm()) {
        sheet.style.removeProperty("--sheet");
        return;
      }
      var top = sheetSection.getBoundingClientRect().top;
      var height = window.innerHeight;
      if (top > height * 1.2 || top < -height) return;
      var p = clamp((height - top) / (height * 0.7), 0, 1);
      sheet.style.setProperty("--sheet", (0.94 + 0.06 * easeOut(p)).toFixed(4));
    };
    var queueSheet = function () {
      if (sheetQueued) return;
      sheetQueued = true;
      window.requestAnimationFrame(drawSheet);
    };
    window.addEventListener("scroll", queueSheet, { passive: true });
    window.addEventListener("resize", queueSheet);
    drawSheet();
  }

  // ---------------------------------------------------------------- pointer light on the TV cards

  if (window.matchMedia("(hover: hover)").matches) {
    $$(".platform").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", event.clientX - rect.left + "px");
        card.style.setProperty("--my", event.clientY - rect.top + "px");
      });
    });
  }

  // ---------------------------------------------------------------- text pages: the section in view in the contents

  var tocLinks = $$(".toc a");
  if (tocLinks.length && canObserve) {
    var byId = {};
    tocLinks.forEach(function (link) {
      byId[decodeURIComponent(link.hash.slice(1))] = link;
    });
    var tocSpy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          tocLinks.forEach(function (link) {
            link.classList.remove("is-active");
          });
          byId[entry.target.id].classList.add("is-active");
        });
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );
    Object.keys(byId).forEach(function (id) {
      var heading = document.getElementById(id);
      if (heading) tocSpy.observe(heading);
    });
  }

  // ---------------------------------------------------------------- the hero: a remote that drives the TV

  var demo = $("[data-demo]");
  if (demo) initDemo(demo);

  function initDemo(demo) {
    var tv = $("[data-tv]", demo);
    var screen = $("[data-screen]", demo);
    var remote = $("[data-remote]", demo);
    var feature = $("[data-feature]", demo);
    var tiles = $$("[data-tile]", demo);
    var nexts = $$("[data-next]", demo);
    var player = $("[data-player]", demo);
    var finger = $("[data-finger]", demo);
    var live = $("[data-live]", demo);
    var glow = $("[data-glow]", demo);
    var search = $("[data-search]", demo);
    var searchText = $("[data-search-text]", demo);
    var results = $$("[data-result]", demo);
    var touchpad = $("[data-touchpad]", demo);
    var appsheet = $("[data-appsheet]", demo);
    var appButtons = $$("button", appsheet);
    var tip = $("[data-tip]", demo);
    var acts = {};
    $$("[data-act]", demo).forEach(function (button) {
      acts[button.getAttribute("data-act")] = button;
    });
    var out = {
      playerApp: $("[data-player-app]", demo),
      playerProgress: $("[data-progress]", demo),
      playerTime: $("[data-player-time]", demo),
      playerState: $("[data-player-state]", demo),
      volumeLevel: $("[data-osd-level]", demo),
      volumeNumber: $("[data-osd-num]", demo),
      channel: $("[data-osd-channel]", demo),
      seek: $("[data-osd-seek]", demo),
      status: $("[data-status-text]", demo),
      receipt: $("[data-receipt-text]", demo),
      playingTile: $("[data-playing-tile]", demo),
      playingApp: $("[data-playing-app]", demo),
      playingProgress: $("[data-playing-progress]", demo),
      playingTime: $("[data-playing-time]", demo)
    };
    var osd = {
      volume: $("[data-osd=volume]", demo),
      channel: $("[data-osd=channel]", demo),
      seek: $("[data-osd=seek]", demo)
    };
    var words = {
      heard: demo.getAttribute("data-heard"),
      volume: demo.getAttribute("data-volume"),
      muted: demo.getAttribute("data-muted"),
      asleep: demo.getAttribute("data-asleep"),
      connected: demo.getAttribute("data-status"),
      listening: demo.getAttribute("data-listening"),
      said: demo.getAttribute("data-said"),
      saidNote: demo.getAttribute("data-said-note"),
      typed: demo.getAttribute("data-typed"),
      typedNote: demo.getAttribute("data-typed-note"),
      more: demo.getAttribute("data-more")
    };
    var keys = {};
    $$("[data-key]", demo).forEach(function (button) {
      keys[button.getAttribute("data-key")] = button;
    });

    // The app's Demo TV apps (AppModel.demoApps), with where each one's show is up to.
    var APPS = [
      { name: "Streamly", a: "#ff6b7f", b: "#b3203f", at: 2530, length: 5880 },
      { name: "Tubeview", a: "#6d95ff", b: "#2f47c4", at: 384, length: 880 },
      { name: "Cinemo", a: "#b28bff", b: "#6231cf", at: 4325, length: 7440 },
      { name: "Kidzone", a: "#6fe0a8", b: "#1c8f62", at: 512, length: 1320 }
    ];
    var NEXT_APP = [1, 0, 3]; // whose show each "continue watching" tile is
    var GLOW_AT = { up: ["50%", "18%"], down: ["50%", "82%"], left: ["18%", "50%"], right: ["82%", "50%"], ok: ["50%", "50%"] };
    var REPEATS = { up: 1, down: 1, left: 1, right: 1, volup: 1, voldown: 1, rewind: 1, forward: 1 };
    var SHORTCUTS = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      Escape: "back",
      Backspace: "back",
      h: "home",
      H: "home",
      m: "mute",
      M: "mute",
      "+": "volup",
      "=": "volup",
      "-": "voldown",
      _: "voldown"
    };

    var state = {
      on: true,
      playing: -1, // the app on screen, or -1 for the TV's home screen
      paused: false,
      last: 0, // the app the remote's Now Playing card shows
      row: 1, // 0 the featured banner, 1 apps, 2 continue watching
      col: 0,
      cols: [0, 0, 0],
      featureApp: 0,
      volume: 18,
      muted: false,
      channel: 1,
      search: false, // the TV's search is open
      result: 0 // the search result in focus
    };
    var mode = "dpad"; // what the pad shows: the D-pad, the touchpad or the apps

    function clock(seconds) {
      var h = Math.floor(seconds / 3600);
      var m = Math.floor((seconds % 3600) / 60);
      var s = Math.floor(seconds % 60);
      return (h ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s;
    }

    // -------------------------------------------------------------- what the TV shows

    function focused() {
      if (state.row === 0) return feature;
      return state.row === 1 ? tiles[state.col] : nexts[state.col];
    }

    function focusedApp() {
      if (state.row === 0) return state.featureApp;
      return state.row === 1 ? state.col : NEXT_APP[state.col];
    }

    function paint(app) {
      demo.style.setProperty("--fa", APPS[app].a);
      demo.style.setProperty("--fb", APPS[app].b);
    }

    function drawFocus() {
      [feature].concat(tiles, nexts).forEach(function (el) {
        el.classList.remove("is-focus");
      });
      focused().classList.add("is-focus");
      if (state.row !== 0) state.featureApp = focusedApp();
      if (state.playing < 0) paint(focusedApp());
    }

    function bump(direction, el) {
      el = el || focused();
      var by = { left: ["-0.9cqw", "0"], right: ["0.9cqw", "0"], up: ["0", "-0.9cqw"], down: ["0", "0.9cqw"] }[direction];
      el.style.setProperty("--bx", by[0]);
      el.style.setProperty("--by", by[1]);
      restart(el, "is-bump");
    }

    function rowLength(row) {
      return row === 0 ? 1 : row === 1 ? tiles.length : nexts.length;
    }

    function move(direction) {
      var row = state.row + (direction === "down" ? 1 : direction === "up" ? -1 : 0);
      var col = state.col + (direction === "right" ? 1 : direction === "left" ? -1 : 0);
      if (row !== state.row) {
        if (row < 0 || row > 2) return bump(direction);
        if (row === 0) col = 0;
        else if (state.row === 0) col = state.cols[row];
        else col = Math.min(rowLength(row) - 1, Math.round(((state.col + 0.5) * rowLength(row)) / rowLength(state.row) - 0.5));
      }
      if (col < 0 || col >= rowLength(row)) return bump(direction);
      state.row = row;
      state.col = col;
      state.cols[row] = col;
      drawFocus();
    }

    function drawPlaying() {
      var app = APPS[state.last];
      var progress = ((app.at / app.length) * 100).toFixed(2) + "%";
      out.playerProgress.style.width = progress;
      out.playerTime.textContent = clock(app.at);
      out.playingProgress.style.width = progress;
      out.playingTime.textContent = clock(app.at);
      if (out.playingTile.getAttribute("data-app") !== String(state.last)) {
        out.playingTile.setAttribute("data-app", String(state.last));
        out.playingTile.style.setProperty("--fa", app.a);
        out.playingTile.style.setProperty("--fb", app.b);
        out.playingTile.innerHTML = "";
        out.playingTile.appendChild($(".glyph", tiles[state.last]).cloneNode(true));
        out.playingApp.textContent = app.name;
        out.playerApp.textContent = app.name;
      }
    }

    function open(app, origin) {
      var from = (origin || focused()).getBoundingClientRect();
      var box = screen.getBoundingClientRect();
      player.style.setProperty("--ox", (((from.left + from.width / 2 - box.left) / box.width) * 100).toFixed(1) + "%");
      player.style.setProperty("--oy", (((from.top + from.height / 2 - box.top) / box.height) * 100).toFixed(1) + "%");
      closeSearch();
      state.playing = app;
      state.last = app;
      state.paused = false;
      paint(app);
      drawPlaying();
      tv.classList.remove("is-paused");
      tv.classList.add("is-playing");
      remote.classList.remove("is-home", "is-paused");
      return APPS[app].name;
    }

    function close() {
      if (state.playing < 0) return false;
      state.playing = -1;
      state.paused = false;
      tv.classList.remove("is-playing", "is-paused");
      remote.classList.remove("is-paused");
      remote.classList.add("is-home");
      drawFocus();
      return true;
    }

    // -------------------------------------------------------------- the TV's search: the mic and the keyboard type into it

    var typing = 0;
    function type(text, done) {
      var letters = Array.from(text);
      var count = 0;
      clearTimeout(typing);
      if (calm()) {
        searchText.textContent = text;
        return done();
      }
      searchText.textContent = "";
      (function next() {
        searchText.textContent = letters.slice(0, ++count).join("");
        if (count < letters.length) typing = setTimeout(next, 45 + Math.random() * 45);
        else typing = setTimeout(done, 220);
      })();
    }

    function drawResult() {
      results.forEach(function (el, i) {
        el.classList.toggle("is-focus", i === state.result);
      });
      paint(state.result);
    }

    function openSearch(text, note) {
      close();
      state.search = true;
      state.result = 0;
      drawResult();
      tv.classList.remove("is-found");
      tv.classList.add("is-search");
      type(text, function () {
        tv.classList.add("is-found");
      });
      receipt(note, 2400);
      return note;
    }

    function closeSearch() {
      if (!state.search) return false;
      state.search = false;
      clearTimeout(typing);
      tv.classList.remove("is-search", "is-found");
      if (state.playing < 0) paint(focusedApp());
      return true;
    }

    function moveResult(direction) {
      var next = state.result + (direction === "right" ? 1 : -1);
      if (next < 0 || next >= results.length) return bump(direction, results[state.result]);
      state.result = next;
      drawResult();
    }

    function pause() {
      state.paused = !state.paused;
      tv.classList.toggle("is-paused", state.paused);
      remote.classList.toggle("is-paused", state.paused);
      if (!state.paused) {
        var badge = out.playerState;
        badge.classList.add("is-flash", "is-resume");
        clearTimeout(badge.timer);
        badge.timer = setTimeout(function () {
          badge.classList.remove("is-flash", "is-resume");
        }, 550);
      }
    }

    var osdTimers = {};
    function show(name) {
      osd[name].classList.add("is-on");
      clearTimeout(osdTimers[name]);
      osdTimers[name] = setTimeout(function () {
        osd[name].classList.remove("is-on");
      }, 1600);
    }

    function seek(seconds) {
      var app = APPS[state.playing];
      app.at = clamp(app.at + seconds, 0, app.length - 1);
      drawPlaying();
      out.seek.textContent = (seconds > 0 ? "+" : "−") + Math.abs(seconds) + " s";
      show("seek");
    }

    function drawVolume() {
      out.volumeLevel.style.width = state.volume + "%";
      out.volumeNumber.textContent = String(state.volume);
      osd.volume.classList.toggle("is-muted", state.muted);
      remote.classList.toggle("is-muted", state.muted);
    }

    function volume(step) {
      state.muted = false;
      state.volume = clamp(state.volume + step, 0, 100);
      drawVolume();
      show("volume");
      return words.volume.replace("{n}", state.volume);
    }

    function mute() {
      state.muted = !state.muted;
      drawVolume();
      show("volume");
      return state.muted ? words.muted : words.volume.replace("{n}", state.volume);
    }

    var powerTimer = 0;
    function power() {
      state.on = !state.on;
      clearTimeout(powerTimer);
      remote.classList.toggle("is-asleep", !state.on);
      out.status.textContent = state.on ? words.connected : words.asleep;
      // .is-waking stays on until the next power off, so the power-on animation never replays by itself.
      tv.classList.toggle("is-off", !state.on);
      tv.classList.toggle("is-waking", state.on);
      if (!state.on) {
        // Back on, the TV starts on its home screen.
        clearTimeout(micTimer);
        remote.classList.remove("is-listening");
        powerTimer = setTimeout(function () {
          close();
          closeSearch();
          Object.keys(osd).forEach(function (name) {
            osd[name].classList.remove("is-on");
          });
        }, 520);
      }
      return state.on ? words.connected : words.asleep;
    }

    // -------------------------------------------------------------- what the remote shows

    var receiptTimer = 0;
    function receipt(message, ms) {
      out.receipt.textContent = message;
      remote.classList.add("has-receipt");
      clearTimeout(receiptTimer);
      receiptTimer = setTimeout(function () {
        remote.classList.remove("has-receipt");
      }, ms || 1300);
    }

    var liveTimer = 0;
    function announce(message) {
      clearTimeout(liveTimer);
      liveTimer = setTimeout(function () {
        live.textContent = message;
      }, 450);
    }

    function lightUp(key) {
      if (!GLOW_AT[key]) return;
      glow.style.setProperty("--gx", GLOW_AT[key][0]);
      glow.style.setProperty("--gy", GLOW_AT[key][1]);
      glow.classList.add("is-on");
      clearTimeout(glow.timer);
      glow.timer = setTimeout(function () {
        glow.classList.remove("is-on");
      }, 140);
    }

    function hold(button) {
      clearTimeout(button.upTimer);
      button.classList.add("is-down");
      button.downAt = Date.now();
    }

    function letGo(button) {
      clearTimeout(button.upTimer);
      button.upTimer = setTimeout(function () {
        button.classList.remove("is-down");
      }, Math.max(0, 110 - (Date.now() - (button.downAt || 0))));
    }

    // One key press: what the TV does, and the receipt that says it heard.
    function press(key, ghostly) {
      if (!ghostly) visitorPressed();
      lightUp(key);
      if (!state.on && key !== "power") {
        restart(keys.power, "is-hint");
        if (!ghostly) announce(words.asleep);
        return;
      }
      var message = words.heard;
      var playing = state.playing >= 0;
      switch (key) {
        case "power":
          message = power();
          if (!ghostly) announce(message);
          return;
        case "up":
        case "down":
          if (playing) break;
          if (state.search) bump(key, results[state.result]);
          else move(key);
          break;
        case "left":
        case "right":
          if (playing) seek(key === "left" ? -10 : 10);
          else if (state.search) moveResult(key);
          else move(key);
          break;
        case "ok":
        case "playpause":
          if (playing) pause();
          else {
            var name = state.search ? open(state.result, results[state.result]) : open(focusedApp());
            if (!ghostly) announce(name);
          }
          break;
        case "back":
          if (!close() && !closeSearch() && state.row !== 1) {
            state.row = 1;
            state.col = state.cols[1];
            drawFocus();
          }
          break;
        case "home":
          close();
          closeSearch();
          state.row = 1;
          state.col = 0;
          state.cols[1] = 0;
          drawFocus();
          break;
        case "channel":
          state.channel = (state.channel % 99) + 1;
          out.channel.textContent = String(state.channel);
          show("channel");
          break;
        case "mute":
          message = mute();
          break;
        case "volup":
        case "voldown":
          message = volume(key === "volup" ? 1 : -1);
          break;
        case "rewind":
        case "forward":
          if (playing) seek(key === "rewind" ? -10 : 10);
          break;
      }
      receipt(message);
      if (!ghostly && message !== words.heard) announce(message);
    }

    // -------------------------------------------------------------- the mic, the dock and what the pad shows

    var micTimer = 0;
    function listen() {
      remote.classList.add("is-listening");
      receipt(words.listening, 4000);
      announce(words.listening);
      clearTimeout(micTimer);
      micTimer = setTimeout(
        function () {
          remote.classList.remove("is-listening");
          announce(openSearch(words.said, words.saidNote));
        },
        calm() ? 300 : 1400
      );
    }

    function setMode(next) {
      if (appsheet.contains(document.activeElement) && next !== "apps") acts.apps.focus({ preventScroll: true });
      mode = next;
      remote.setAttribute("data-mode", next);
      ["dpad", "touchpad", "apps"].forEach(function (name) {
        acts[name].setAttribute("aria-pressed", String(name === next));
      });
      appButtons.forEach(function (button) {
        button.setAttribute("tabindex", next === "apps" ? "0" : "-1");
      });
    }

    var tipTimer = 0;
    function showTip() {
      tip.classList.add("is-on");
      announce(words.more);
      clearTimeout(tipTimer);
      tipTimer = setTimeout(function () {
        tip.classList.remove("is-on");
      }, 2600);
    }

    function asleep() {
      if (state.on) return false;
      restart(keys.power, "is-hint");
      announce(words.asleep);
      return true;
    }

    function act(name, button) {
      visitorPressed();
      hold(button);
      letGo(button);
      if (name === "dpad" || name === "touchpad") return setMode(name);
      if (name === "apps") return setMode(mode === "apps" ? "dpad" : "apps");
      if (name === "more") return showTip();
      if (asleep()) return;
      if (name === "mic") listen();
      if (name === "keyboard") announce(openSearch(words.typed, words.typedNote));
    }

    remote.addEventListener("click", function (event) {
      var button = event.target.closest("[data-act]");
      if (button) act(button.getAttribute("data-act"), button);
    });

    appButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        visitorPressed();
        if (asleep()) return;
        var app = Number(button.getAttribute("data-app"));
        announce(open(app, tiles[app]));
        receipt(words.heard);
        setTimeout(function () {
          if (mode === "apps") setMode("dpad");
        }, 450);
      });
    });

    // The touchpad: a swipe moves one step, a tap is OK.
    var swipe = null;
    function drawDot(event) {
      var box = touchpad.getBoundingClientRect();
      touchpad.style.setProperty("--tx", event.clientX - box.left + "px");
      touchpad.style.setProperty("--ty", event.clientY - box.top + "px");
    }
    touchpad.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      visitorPressed();
      swipe = { id: event.pointerId, x: event.clientX, y: event.clientY };
      if (touchpad.setPointerCapture) touchpad.setPointerCapture(event.pointerId);
      drawDot(event);
      touchpad.classList.add("is-touching");
    });
    touchpad.addEventListener("pointermove", function (event) {
      if (swipe && event.pointerId === swipe.id) drawDot(event);
    });
    touchpad.addEventListener("pointerup", function (event) {
      if (!swipe || event.pointerId !== swipe.id) return;
      var dx = event.clientX - swipe.x;
      var dy = event.clientY - swipe.y;
      swipe = null;
      touchpad.classList.remove("is-touching");
      if (Math.abs(dx) < 14 && Math.abs(dy) < 14) press("ok");
      else if (Math.abs(dx) > Math.abs(dy)) press(dx > 0 ? "right" : "left");
      else press(dy > 0 ? "down" : "up");
    });
    touchpad.addEventListener("pointercancel", function () {
      swipe = null;
      touchpad.classList.remove("is-touching");
    });

    // -------------------------------------------------------------- playback runs while the demo is on screen

    var inView = !canObserve;
    var ticker = 0;
    function tick() {
      if (state.playing < 0 || state.paused || !state.on) return;
      var app = APPS[state.playing];
      app.at = app.at + 1 >= app.length ? 0 : app.at + 1;
      drawPlaying();
    }
    function runClock() {
      var should = inView && !document.hidden;
      if (should && !ticker) ticker = setInterval(tick, 1000);
      if (!should && ticker) {
        clearInterval(ticker);
        ticker = 0;
      }
    }

    // -------------------------------------------------------------- pointer, touch and keyboard

    // Keyboard users get one stop in the remote (OK); arrows, Escape, H, M and +/− press the other keys.
    Object.keys(keys).forEach(function (name) {
      if (name !== "ok") keys[name].setAttribute("tabindex", "-1");
    });
    Object.keys(SHORTCUTS).forEach(function (shortcut) {
      var button = keys[SHORTCUTS[shortcut]];
      if (!button || /^[a-z_=]$/.test(shortcut)) return;
      var list = button.getAttribute("aria-keyshortcuts");
      button.setAttribute("aria-keyshortcuts", list ? list + " " + shortcut : shortcut);
    });

    var held = null;
    var lastRelease = { button: null, at: 0 };

    function fire() {
      held.fired = true;
      press(held.key);
      if (held.touch && navigator.vibrate) {
        try {
          navigator.vibrate(8);
        } catch (error) {
          /* no haptics here */
        }
      }
    }

    function release(sent) {
      if (!held) return;
      clearTimeout(held.wait);
      clearInterval(held.repeat);
      if (sent && held.touch && !held.fired) fire();
      letGo(held.button);
      lastRelease = { button: held.button, at: Date.now() };
      held = null;
    }

    remote.addEventListener("pointerdown", function (event) {
      var button = event.target.closest("[data-key]");
      if (!button || (event.pointerType === "mouse" && event.button !== 0)) return;
      release(false);
      held = {
        button: button,
        key: button.getAttribute("data-key"),
        id: event.pointerId,
        touch: event.pointerType !== "mouse",
        fired: false
      };
      hold(button);
      // A mouse presses at once. A finger presses when it lifts, so a scroll that starts on the remote presses nothing.
      if (!held.touch) fire();
      if (REPEATS[held.key]) {
        held.wait = setTimeout(function () {
          if (!held) return;
          if (!held.fired) fire();
          held.repeat = setInterval(function () {
            if (held) press(held.key);
          }, 110);
        }, 420);
      }
    });

    document.addEventListener("pointerup", function (event) {
      if (held && event.pointerId === held.id) release(true);
    });
    document.addEventListener("pointercancel", function (event) {
      if (held && event.pointerId === held.id) release(false);
    });
    remote.addEventListener("contextmenu", function (event) {
      if (event.target.closest("[data-key]")) event.preventDefault();
    });

    // Enter or Space on a focused key, and a screen reader's activation, arrive as a click.
    remote.addEventListener("click", function (event) {
      var button = event.target.closest("[data-key]");
      if (!button) return;
      if (lastRelease.button === button && Date.now() - lastRelease.at < 600) return;
      hold(button);
      letGo(button);
      press(button.getAttribute("data-key"));
    });

    remote.addEventListener("keydown", function (event) {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      var key = SHORTCUTS[event.key];
      if (!key || !keys[key]) return;
      event.preventDefault();
      if (GLOW_AT[key] && mode !== "dpad") setMode("dpad");
      hold(keys[key]);
      press(key);
      if (GLOW_AT[key] && document.activeElement !== keys.ok) keys.ok.focus({ preventScroll: true });
    });
    remote.addEventListener("keyup", function (event) {
      var key = SHORTCUTS[event.key];
      if (key && keys[key]) letGo(keys[key]);
    });

    // -------------------------------------------------------------- the invitation and the ghost finger

    var visitor = false; // the visitor has pressed a key
    var ghost = { token: 0, timer: 0, runs: 0, active: false, blocked: false };
    var inviteTimer = 0;
    var SCRIPT = [
      ["right", 650],
      ["right", 700],
      ["ok", 2500],
      ["volup", 260],
      ["volup", 260],
      ["volup", 1500],
      ["back", 1100],
      ["left", 420],
      ["left", 900]
    ];

    function invite(on) {
      demo.classList.toggle("is-inviting", on && !visitor && state.on);
    }

    function visitorPressed() {
      if (visitor) return;
      visitor = true;
      stopGhost();
      invite(false);
    }

    function placeFinger(button, jump) {
      var box = remote.getBoundingClientRect();
      var target = button.getBoundingClientRect();
      if (jump) finger.style.transition = "none";
      finger.style.left = target.left + target.width / 2 - box.left + "px";
      finger.style.top = target.top + target.height / 2 - box.top + "px";
      if (jump) {
        void finger.offsetWidth;
        finger.style.transition = "";
      }
    }

    function later(fn, ms) {
      clearTimeout(ghost.timer);
      ghost.timer = setTimeout(fn, ms);
    }

    function startGhost() {
      if (visitor || ghost.blocked || ghost.active || ghost.runs >= 2 || calm() || !inView || document.hidden) return;
      if (demo.matches(":hover")) return later(startGhost, 2500);
      ghost.active = true;
      ghost.runs += 1;
      var token = ++ghost.token;
      var step = 0;
      invite(false);
      placeFinger(keys[SCRIPT[0][0]], true);
      finger.classList.add("is-on");
      (function next() {
        if (token !== ghost.token) return;
        if (step >= SCRIPT.length) return endGhost();
        var move = SCRIPT[step++];
        var button = keys[move[0]];
        placeFinger(button, false);
        later(function () {
          if (token !== ghost.token) return;
          restart(finger, "is-tap");
          hold(button);
          letGo(button);
          press(move[0], true);
          later(next, move[1]);
        }, step === 1 ? 650 : 480);
      })();
    }

    function endGhost() {
      ghost.active = false;
      finger.classList.remove("is-on");
      if (visitor) return;
      invite(true);
      later(startGhost, 12000);
    }

    // Quietly put the TV back the way it started (when the ghost is cut off before the visitor has pressed anything).
    function reset() {
      close();
      closeSearch();
      state.row = 1;
      state.col = 0;
      state.cols = [0, 0, 0];
      state.volume = 18;
      drawVolume();
      drawFocus();
    }

    function stopGhost() {
      ghost.token += 1;
      clearTimeout(ghost.timer);
      if (!ghost.active) return;
      ghost.active = false;
      finger.classList.remove("is-on");
      if (!visitor) reset();
    }

    remote.addEventListener("focusin", function () {
      ghost.blocked = true;
      stopGhost();
    });

    var seen = false;
    function onView(visible) {
      inView = visible;
      runClock();
      clearTimeout(inviteTimer);
      if (!visible) {
        stopGhost();
        return;
      }
      if (visitor) return;
      // First look: the TV turns on, then the remote asks for OK; a little later a ghost finger shows an evening.
      inviteTimer = setTimeout(
        function () {
          invite(true);
          later(startGhost, 5500);
        },
        seen ? 600 : 2200
      );
      seen = true;
    }

    if (canObserve) {
      new IntersectionObserver(
        function (entries) {
          onView(entries[entries.length - 1].isIntersecting);
        },
        { threshold: 0.35 }
      ).observe(demo);
    } else {
      onView(true);
    }

    document.addEventListener("visibilitychange", function () {
      runClock();
      if (document.hidden) stopGhost();
      else if (inView && !visitor) later(startGhost, 4000);
    });

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener("change", function () {
        if (calm()) stopGhost();
      });
    }

    // The TV leans a little away from a mouse pointer; the remote stays put under it.
    var hero = demo.closest(".hero");
    if (hero && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      var leanQueued = false;
      var lean = { x: 0, y: 0 };
      var drawLean = function () {
        leanQueued = false;
        demo.style.setProperty("--sx", lean.x.toFixed(3));
        demo.style.setProperty("--sy", lean.y.toFixed(3));
      };
      hero.addEventListener("pointermove", function (event) {
        if (event.pointerType !== "mouse" || calm()) return;
        var box = hero.getBoundingClientRect();
        lean.x = clamp(((event.clientX - box.left) / box.width) * 2 - 1, -1, 1);
        lean.y = clamp(((event.clientY - box.top) / box.height) * 2 - 1, -1, 1);
        if (!leanQueued) {
          leanQueued = true;
          window.requestAnimationFrame(drawLean);
        }
      });
      hero.addEventListener("pointerleave", function () {
        lean.x = 0;
        lean.y = 0;
        drawLean();
      });
    }

    demo.addEventListener("animationend", function (event) {
      var done = { bump: "is-bump", tap: "is-tap", hint: "is-hint" }[event.animationName];
      if (done) event.target.classList.remove(done);
    });

    remote.classList.add("is-home");
    setMode("dpad");
    drawFocus();
    drawPlaying();
    drawVolume();
  }
})();
