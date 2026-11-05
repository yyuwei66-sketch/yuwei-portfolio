(function () {
  "use strict";

  var projects = {
    membra: {
      title: "Membra-AI",
      category: "Research × RAG",
      short: "An evidence-grounded assistant for membrane and thin-film research.",
      description: "A student research collaboration building a knowledge assistant for membrane literature and comparable experiments. It combines retrieval and semantic search across 2,701 question-answer and evidence pairs.",
      tags: ["Python", "RAG", "Semantic search", "Streamlit"],
      repo: "https://github.com/yyuwei66-sketch/Membra-AI"
    },
    maze: {
      title: "Maze Escape AI",
      category: "AI × game systems",
      short: "A playable pursuit game with generated wraparound mazes.",
      description: "A human-versus-monster game for comparing search and optimization agents in a changing maze. The project explores A*, BFS, Minimax, genetic map generation, and multiple pursuit strategies.",
      tags: ["Python", "C++", "Flask", "A*", "BFS", "Minimax"],
      repo: "https://github.com/yyuwei66-sketch/maze-escape-ai"
    },
    freshman: {
      title: "XMUM Freshman Chatbot",
      category: "Applied NLP",
      short: "An FAQ assistant for new students.",
      description: "Combines intent rules, category prediction, and answer retrieval to respond to freshman enquiries, with a confidence-aware response strategy.",
      tags: ["Python", "Flask", "Naive Bayes", "Linear SVM"],
      repo: "https://github.com/yyuwei66-sketch/xmum-freshman-chatbot"
    },
    systems: {
      title: "Interactive Systems Lab",
      category: "Interactive web",
      short: "Three browser games and a Three.js runner.",
      description: "A collection of Alchemy Lab, Arcane Escape, and Space Runner, plus a Three.js runner. The projects explore reusable interactions, game states, and visual feedback.",
      tags: ["JavaScript", "Three.js", "Canvas", "Game systems"],
      repo: "https://github.com/yyuwei66-sketch/interactive-systems-lab",
      demo: "https://yyuwei66-sketch.github.io/interactive-systems-lab/"
    },
    modeling: {
      title: "2026 Modeling Project",
      category: "Team modeling",
      short: "Collaborative modeling work with shared data and report materials.",
      description: "A team project organized into four analysis tracks with shared data, notebooks, and a technical report.",
      tags: ["Python", "Jupyter", "Data analysis", "Team project"],
      repo: "https://github.com/yyuwei66-sketch/CUMCM_2026"
    },
    agriculture: {
      title: "Agricultural Disease Classification",
      category: "Computer vision",
      short: "A comparison of ResNet50 and YOLOv8 on a 26-class image dataset.",
      description: "A computer-vision research project comparing ResNet50 and YOLOv8n/s, with repeatable preprocessing and evaluation workflows. Validation accuracy was around 70%+.",
      tags: ["PyTorch", "ResNet50", "YOLOv8", "Image classification"],
      repo: ""
    }
  };

  var focusNotes = {
    vision: "Learning how visual systems can turn images into reliable, useful signals.",
    embodied: "Exploring agents that perceive, reason, and act within an environment.",
    multimodal: "Connecting language, images, and other signals into useful applications.",
    agents: "Understanding how agents plan, use tools, and build a model of the world.",
    trust: "Thinking about systems people can inspect, understand, and rely on."
  };

  var body = document.body;
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  var tiles = Array.prototype.slice.call(document.querySelectorAll(".bento-grid > .tile"));
  var projectDialog = document.getElementById("project-dialog");
  var searchDialog = document.getElementById("search-dialog");
  var toastTimer;

  function showToast(message) {
    var toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.classList.remove("visible"); }, 2200);
  }

  function setFilter(filter) {
    filterButtons.forEach(function (button) {
      var selected = button.dataset.filter === filter;
      button.setAttribute("aria-pressed", selected ? "true" : "false");
      button.classList.toggle("active", selected);
    });
    tiles.forEach(function (tile) {
      var categories = (tile.dataset.category || "").split(/\s+/);
      tile.hidden = filter !== "all" && categories.indexOf(filter) === -1;
    });
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () { setFilter(button.dataset.filter); });
  });

  var themeButton = document.getElementById("theme-toggle");
  var themeIcon = document.getElementById("theme-icon");
  function applyTheme(theme) {
    body.dataset.theme = theme;
    var dark = theme === "dark";
    themeButton.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    themeButton.title = dark ? "Switch to light mode" : "Switch to dark mode";
    themeIcon.innerHTML = dark
      ? '<path d="M20.8 13A8.5 8.5 0 0 1 11 3.2 8.5 8.5 0 1 0 20.8 13Z"></path>'
      : '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path>';
  }

  try {
    var savedTheme = window.localStorage.getItem("yuwei-theme");
    if (savedTheme === "dark" || savedTheme === "light") applyTheme(savedTheme);
  } catch (error) {}
  themeButton.addEventListener("click", function () {
    var nextTheme = body.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try { window.localStorage.setItem("yuwei-theme", nextTheme); } catch (error) {}
  });

  var portraitToggle = document.getElementById("portrait-toggle");
  portraitToggle.addEventListener("click", function () {
    var flipped = portraitToggle.getAttribute("aria-expanded") === "true";
    portraitToggle.setAttribute("aria-expanded", flipped ? "false" : "true");
    document.getElementById("flip-label").textContent = flipped ? "Flip to meet me ↻" : "Flip back ↻";
  });

  document.querySelectorAll("[data-focus]").forEach(function (button) {
    button.addEventListener("click", function () {
      document.querySelectorAll("[data-focus]").forEach(function (item) { item.setAttribute("aria-pressed", "false"); });
      button.setAttribute("aria-pressed", "true");
      document.getElementById("focus-copy").textContent = focusNotes[button.dataset.focus] || "";
    });
  });

  var projectTitle = document.getElementById("project-dialog-title");
  var projectDescription = document.getElementById("project-description");
  var projectStack = document.getElementById("project-stack");
  var projectLinks = document.getElementById("project-links");

  function openProject(id) {
    var project = projects[id];
    if (!project) return;
    document.getElementById("project-category").innerHTML = '<span class="eyebrow-dot"></span> ' + project.category;
    projectTitle.textContent = project.title;
    projectDescription.textContent = project.description;
    projectStack.innerHTML = "";
    project.tags.forEach(function (tag) {
      var chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = tag;
      projectStack.appendChild(chip);
    });
    projectLinks.innerHTML = "";
    if (project.repo) {
      var source = document.createElement("a");
      source.className = "button-primary";
      source.href = project.repo;
      source.target = "_blank";
      source.rel = "noopener noreferrer";
      source.textContent = "View source ↗";
      projectLinks.appendChild(source);
    }
    if (project.demo) {
      var demo = document.createElement("a");
      demo.className = "button-secondary";
      demo.href = project.demo;
      demo.target = "_blank";
      demo.rel = "noopener noreferrer";
      demo.textContent = "Try the live demo ↗";
      projectLinks.appendChild(demo);
    }
    if (typeof projectDialog.showModal === "function") projectDialog.showModal();
  }

  document.querySelectorAll("[data-project]").forEach(function (button) {
    button.addEventListener("click", function () { openProject(button.dataset.project); });
  });
  document.querySelectorAll("[data-close]").forEach(function (button) {
    button.addEventListener("click", function () {
      var dialog = document.getElementById(button.dataset.close);
      if (dialog) dialog.close();
    });
  });
  [projectDialog, searchDialog].forEach(function (dialog) {
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
  });

  var searchButton = document.getElementById("search-open");
  var searchInput = document.getElementById("search-input");
  var searchResults = document.getElementById("search-results");
  var searchEntries = Object.keys(projects).map(function (id) {
    var project = projects[id];
    return { type: "project", id: id, title: project.title, text: project.short + " " + project.tags.join(" ") };
  }).concat([
    { type: "section", id: "main", title: "About Yuwei", text: "AI undergraduate XMUM education GPA rank profile" },
    { type: "section", id: "maze", title: "Playable Maze Escape", text: "game keyboard arrows BFS AI route" },
    { type: "section", id: "focus", title: "Research interests", text: "computer vision embodied multimodal agents world models trustworthy AI" },
    { type: "section", id: "contact", title: "Contact", text: "email github collaborate" }
  ]);

  function renderSearch(query) {
    var term = query.trim().toLowerCase();
    var matches = searchEntries.filter(function (entry) {
      return !term || (entry.title + " " + entry.text).toLowerCase().indexOf(term) !== -1;
    }).slice(0, 7);
    searchResults.innerHTML = "";
    if (!matches.length) {
      var empty = document.createElement("div");
      empty.className = "search-empty";
      empty.textContent = "No matches yet. Try a project name or research area.";
      searchResults.appendChild(empty);
      return;
    }
    matches.forEach(function (entry) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "search-result";
      button.setAttribute("role", "option");
      var copy = document.createElement("span");
      var title = document.createElement("strong");
      var subtitle = document.createElement("small");
      title.textContent = entry.title;
      subtitle.textContent = entry.type === "project" ? "Project · " + projects[entry.id].category : "Jump to section";
      copy.appendChild(title);
      copy.appendChild(subtitle);
      var arrow = document.createElement("span");
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "↗";
      button.appendChild(copy);
      button.appendChild(arrow);
      button.addEventListener("click", function () {
        searchDialog.close();
        if (entry.type === "project") {
          openProject(entry.id);
        } else if (entry.id === "focus") {
          setFilter("research");
          document.querySelector(".focus-card").scrollIntoView({ behavior: "smooth", block: "center" });
        } else if (entry.id === "maze") {
          setFilter("work");
          document.getElementById("maze").scrollIntoView({ behavior: "smooth", block: "center" });
          window.setTimeout(function () { document.getElementById("maze-board").focus(); }, 450);
        } else if (entry.id === "contact") {
          setFilter("about");
          document.querySelector(".contact-card").scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          setFilter("about");
          document.querySelector(".hero").scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
      searchResults.appendChild(button);
    });
  }

  function openSearch() {
    renderSearch("");
    if (typeof searchDialog.showModal === "function") {
      searchDialog.showModal();
      window.setTimeout(function () { searchInput.focus(); }, 20);
    }
  }

  searchButton.addEventListener("click", openSearch);
  searchInput.addEventListener("input", function () { renderSearch(searchInput.value); });
  document.addEventListener("keydown", function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openSearch();
    }
  });

  var mazeLayout = ["######.", ".......", ".#####.", ".#...#.", ".###.#.", ".....#.", ".#####."];
  var mazeBoard = document.getElementById("maze-board");
  var gameStatus = document.getElementById("game-status");
  var position = { x: 0, y: 6 };
  var routeVisible = false;
  var victory = false;

  function shortestRoute() {
    var startKey = position.x + "," + position.y;
    var goalKey = "6,0";
    var queue = [{ x: position.x, y: position.y }];
    var visited = new Set([startKey]);
    var parents = new Map();
    var directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (queue.length) {
      var current = queue.shift();
      var currentKey = current.x + "," + current.y;
      if (currentKey === goalKey) break;
      directions.forEach(function (direction) {
        var nx = current.x + direction[0];
        var ny = current.y + direction[1];
        var key = nx + "," + ny;
        if (ny >= 0 && ny < mazeLayout.length && nx >= 0 && nx < mazeLayout[0].length && mazeLayout[ny][nx] !== "#" && !visited.has(key)) {
          visited.add(key);
          parents.set(key, currentKey);
          queue.push({ x: nx, y: ny });
        }
      });
    }
    if (!visited.has(goalKey)) return new Set();
    var path = new Set();
    var cursor = goalKey;
    while (cursor !== startKey) {
      path.add(cursor);
      cursor = parents.get(cursor);
      if (!cursor) break;
    }
    return path;
  }

  function renderMaze() {
    mazeBoard.innerHTML = "";
    var route = routeVisible ? shortestRoute() : new Set();
    mazeLayout.forEach(function (row, y) {
      row.split("").forEach(function (value, x) {
        var cell = document.createElement("span");
        cell.className = "maze-cell";
        cell.setAttribute("role", "gridcell");
        if (value === "#") {
          cell.classList.add("wall");
          cell.setAttribute("aria-label", "Wall");
        } else {
          var key = x + "," + y;
          if (route.has(key)) cell.classList.add("route");
          if (x === 6 && y === 0) {
            cell.classList.add("goal");
            cell.setAttribute("aria-label", "Exit");
            cell.textContent = "↗";
          } else {
            cell.setAttribute("aria-label", "Path");
          }
          if (x === position.x && y === position.y) {
            cell.classList.add("player");
            cell.setAttribute("aria-label", "Your position");
            cell.textContent = "●";
          }
        }
        mazeBoard.appendChild(cell);
      });
    });
  }

  function movePlayer(dx, dy) {
    if (victory) return;
    var nx = position.x + dx;
    var ny = position.y + dy;
    if (ny < 0 || ny >= mazeLayout.length || nx < 0 || nx >= mazeLayout[0].length || mazeLayout[ny][nx] === "#") {
      gameStatus.textContent = "A wall is in the way. Try another route.";
      return;
    }
    position = { x: nx, y: ny };
    if (nx === 6 && ny === 0) {
      victory = true;
      gameStatus.textContent = "You escaped. The AI route is one way to solve it.";
      showToast("Maze escaped — nicely navigated.");
    } else {
      gameStatus.textContent = routeVisible ? "Following the highlighted shortest route." : "Good move. Keep looking for the exit.";
    }
    renderMaze();
  }

  var deltas = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  document.querySelectorAll("[data-move]").forEach(function (button) {
    button.addEventListener("click", function () {
      var delta = deltas[button.dataset.move];
      movePlayer(delta[0], delta[1]);
      mazeBoard.focus({ preventScroll: true });
    });
  });
  mazeBoard.addEventListener("keydown", function (event) {
    var keys = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] };
    var delta = keys[event.key] || keys[event.key.toLowerCase()];
    if (delta) {
      event.preventDefault();
      movePlayer(delta[0], delta[1]);
    }
  });
  document.getElementById("route-button").addEventListener("click", function (event) {
    routeVisible = !routeVisible;
    event.currentTarget.textContent = routeVisible ? "Hide AI route" : "Show AI route";
    gameStatus.textContent = routeVisible ? "Shortest route found with breadth-first search." : "Route hidden. Explore the maze yourself.";
    renderMaze();
  });
  document.getElementById("maze-reset").addEventListener("click", function () {
    position = { x: 0, y: 6 };
    routeVisible = false;
    victory = false;
    document.getElementById("route-button").textContent = "Show AI route";
    gameStatus.textContent = "You are the compass. Reach the green exit.";
    renderMaze();
  });
  renderMaze();

  var tools = ["Python", "C++", "JavaScript", "PyTorch", "YOLOv8", "RAG", "Streamlit", "Flask", "Three.js", "NumPy", "pandas", "Jupyter", "Git"];
  var toolList = document.getElementById("tool-list");
  var toolCenter = document.getElementById("tool-center");
  var toolNote = document.getElementById("tool-note");
  var activeTool = "Python";

  function renderTools() {
    toolList.innerHTML = "";
    tools.forEach(function (tool) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "tool-chip";
      button.textContent = tool;
      button.setAttribute("aria-pressed", tool === activeTool ? "true" : "false");
      button.addEventListener("click", function () {
        activeTool = tool;
        toolCenter.textContent = tool;
        toolNote.textContent = tool + " is part of the toolkit I’m exploring.";
        renderTools();
      });
      toolList.appendChild(button);
    });
  }

  document.getElementById("shuffle-tools").addEventListener("click", function () {
    tools.push(tools.shift());
    activeTool = tools[0];
    toolCenter.textContent = activeTool;
    toolNote.textContent = "The constellation has been rearranged.";
    renderTools();
  });
  renderTools();

  function updateTime() {
    try {
      document.getElementById("my-time").textContent = new Intl.DateTimeFormat("en-MY", {
        timeZone: "Asia/Kuala_Lumpur",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }).format(new Date());
    } catch (error) {
      document.getElementById("my-time").textContent = "--:--";
    }
  }

  updateTime();
  window.setInterval(updateTime, 1000);
  document.getElementById("year").textContent = String(new Date().getFullYear());

  document.querySelectorAll(".tile").forEach(function (tile) {
    tile.addEventListener("pointermove", function (event) {
      var rect = tile.getBoundingClientRect();
      tile.style.setProperty("--mx", (event.clientX - rect.left) + "px");
      tile.style.setProperty("--my", (event.clientY - rect.top) + "px");
    });
    tile.addEventListener("pointerleave", function () {
      tile.style.removeProperty("--mx");
      tile.style.removeProperty("--my");
    });
  });
}());
